import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { thunkAuthenticate } from "../../redux/session";
import { editADeck, getOneDeck } from "../../redux/decks";
import { getAllCards } from "../../redux/cards";
import { IoMdClose } from "react-icons/io";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CardDeckModal from "../DeckDetails/CardModal";
import './EditDeck.css';

const UpdateDeck = () => {
    const {deck_id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cardsInDeck, setCardsInDeck] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [ogDeck, setOgDeck] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    console.log('og deck ', ogDeck)
    console.log('deck now ', cardsInDeck)


    useEffect(() => {
        dispatch(thunkAuthenticate())
        .then(dispatch(getOneDeck(deck_id)))
        .then(() => setIsLoaded(true));
    }, [dispatch, deck_id]);

    useEffect(() => {
        dispatch(getAllCards());
    }, [dispatch]);

    const user = useSelector((state) => state.session.user);
    const cards = useSelector((state) => state.cardsReducer.allCards);
    const allCards = cards ? Object.values(cards) : [];
    const deck_by_id = useSelector((state) => state.decksReducer.deckDetail.deck);

    const validateData = () => {
        const error = {};
        if (name.length > 50) error['name'] = "Deck name must be shorter than 50 characters.";
        if (name.length < 5) error['name'] = "Deck name must be longer than 5 characters.";
        if (description.length < 10) error['description'] = "Description must be longer than 10 characters";
        if (description.length > 300) error['description'] = "Description must be shorter than 300 characters";
        if (cardsInDeck.length < 5) error['cardsInDeck'] = "You must add at least 5 cards in your new deck.";
        if (cardsInDeck.length > 60) error['cardsInDeck'] = "Your Deck must have no more than 60 cards in it.";
        setErrors(error);
        return Object.keys(error).length === 0;
    };

    useEffect(() => {
        let cards = [];

        if(deck_by_id) {
            setName(deck_by_id.name || '')
            setDescription(deck_by_id.description || '')
            console.log(deck_by_id.cards)
            for (const card of deck_by_id.cards) {
                cards.push(card.id)
            }
            setCardsInDeck(cards)
            setOgDeck(cards)
        }
    }, [deck_by_id]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateData()) {
            const serverResponse = await dispatch(editADeck({
                owner_id: user.id,
                name,
                description,
                cardsInDeck,
                ogDeck
            }, deck_id));

            console.log("Server Response:", serverResponse); // Debugging log

            if (serverResponse && serverResponse.errors) {
                setErrors((error) => ({ ...error, ...serverResponse.errors }));
                console.log("Errors:", serverResponse.errors); // Debugging log
            } else {
                navigate(`/decks/${serverResponse.id}`);
            }
        }
    };


    const handleGoBack = async (e) => {
        navigate(`/decks/${deck_id}`);
    };

    const handleDragStart = (e, cardId) => {
        e.dataTransfer.setData("text/plain", cardId);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        if (cardsInDeck) {
            setCardsInDeck((prevCards) => [...prevCards, cardId]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFromList = (index) => {
        const updatedList = cardsInDeck.filter((_, i) => i !== index);
        setCardsInDeck(updatedList);
    };

    return isLoaded ? (
        <div>
            <div className="top-details">
                <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                    <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                </button>
            </div>
            <div className="deck-form">
                <form onSubmit={handleSubmit}>
                    <section id="title-deck">
                        <h2>Title of Deck<span className="required">*</span></h2>
                        <p>Give your deck a name!</p>
                        <input
                            style={{ color: 'black' }}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="err-msg">{errors.name}</p>}
                    </section>
                    <section id="description-deck">
                        <h2>Description<span className="required">*</span></h2>
                        <p>Provide some details about this deck!</p>
                        <input
                            style={{ color: 'black' }}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {errors.description && <p className="err-msg">{errors.description}</p>}
                    </section>
                    <section
                        id='cards-form'
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{ border: '2px dashed #ccc', padding: '10px', minHeight: '100px' }}
                    >
                        <h2>Cards in your deck</h2>
                        <div>
                            {cardsInDeck.map((cardId, index) => {
                                const card = cards[cardId];
                                return card ? (
                                    <div className="itms-deck">
                                    <p key={card.id}> {card.name}</p>
                                    <IoMdClose className="close-btn" onClick={() => removeFromList(index)}/>
                                    </div>
                                ) : null;
                            })}
                        </div>
                        {errors.cardsInDeck && <p className="err-msg">{errors.cardsInDeck}</p>}
                    </section>
                    <section className="form-bttm">
                        <button className="glow-on-hover" onClick={handleGoBack}>Cancel</button>
                        <button type="submit" className="glow-on-hover">Publish</button>
                    </section>
                </form>
            </div>
            <div className="cards-form">
                {allCards.map(card => (

                    <OpenModalMenuItem

                            itemText= {<img
                                key={card.id}
                                className="deck-form-card"
                                src={card.image.image_url}
                                alt="Card Image"
                                draggable
                                onDragStart={(e) => handleDragStart(e, card.id)}
                                style={{ cursor: 'move' }} 
                                />}
                            onItemClick={() => setShowMenu(false)}
                            modalComponent={<CardDeckModal url={card.image.image_url}/>}
                            />
                ))}
            </div>
        </div>
    ) : (
        <div id="loading">
            <h1 className='loading'>
                <span className="let1">l</span>
                <span className="let2">o</span>
                <span className="let3">a</span>
                <span className="let4">d</span>
                <span className="let5">i</span>
                <span className="let6">n</span>
                <span className="let7">g</span>
            </h1>
        </div>
    );
};

export default UpdateDeck;
