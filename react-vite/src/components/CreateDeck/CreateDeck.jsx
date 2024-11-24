import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { thunkAuthenticate } from "../../redux/session";
import { createDeck } from "../../redux/decks";
import { getAllCards } from "../../redux/cards";
import { IoMdClose } from "react-icons/io";
import CardDeckModal from "../DeckDetails/CardModal";
import './CreateDeck.css';
import Footer from "../Footer/Footer";
import OpenModalMenuItemCard from "../OpenModalMenuItemCard/OpenModalMenuItemCard";
import Loading from "../Loading/Loading";

const CreateDeck = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cardsInDeck, setCardsInDeck] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);


    useEffect(() => {
        dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllCards());
    }, [dispatch]);

    const user = useSelector((state) => state.session.user);

    if (!user) return (navigate('/home'))

    const cards = useSelector((state) => state.cardsReducer.allCards);
    const allCards = cards ? Object.values(cards) : [];

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateData()) {
            const serverResponse = await dispatch(createDeck({
                owner_id: user.id,
                name,
                description,
                cardsInDeck
            }));

            console.log("Server Response:", serverResponse); // Debugging log

            if (serverResponse && serverResponse.errors) {
                setErrors((error) => ({ ...error, ...serverResponse.errors }));
                console.log("Errors:", serverResponse.errors); // Debugging log
            } else {
                navigate(`/decks/${serverResponse.id}`);
            }
        }
    };


    const handleGoBack = () => {
        navigate(-1);
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
        <>
        <div className="details-body-decks">
            <div className="top-details">
                <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                    <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                </button>
            </div>
            <div className="create-deck">
                <div className="deck-form">
                    <form onSubmit={handleSubmit}>
                        <section className="glow-on-hover-create">
                            <h2>Title of Deck<span className="required"></span></h2>
                            <p>Give your deck a name!</p>
                            <input
                                style={{ color: 'white' }}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {errors.name && <p className="err-msg">{errors.name}</p>}
                        </section>
                        <section className="glow-on-hover-create">
                            <h2>Description<span className="required"></span></h2>
                            <p>Provide some details about this deck!</p>
                            <input
                                style={{ color: 'white' }}
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            {errors.description && <p className="err-msg">{errors.description}</p>}
                        </section>
                        <section
                            className="glow-on-hover-create-in-deck"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{height: '200px', overflow: 'scroll'}}
                        >
                            <h2> Drag cards to your deck<span className="required"></span></h2>
                            <p>Amount of cards in deck: ( {cardsInDeck.length} )</p>
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

                        <OpenModalMenuItemCard

                                itemText= {<img
                                    key={card.id}
                                    className="deck-form-card"
                                    src={card.image.image_url}
                                    alt="Card Image"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, card.id)}
                                    style={{ cursor: 'pointer' }}
                                    />}
                                onItemClick={() => setShowMenu(false)}
                                modalComponent={<CardDeckModal url={card.image.image_url}/>}
                                />
                    ))}
                </div>
            </div>
        </div>
        <Footer />
        </>
    ) : (
        <Loading />
    );
};

export default CreateDeck;
