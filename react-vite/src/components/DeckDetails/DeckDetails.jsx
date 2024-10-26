import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOneDeck } from "../../redux/decks";
import { getComments } from "../../redux/comments";
import { FaArrowLeftLong } from "react-icons/fa6";
import DeckNotFound from "./Decknotfound";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CardModal from "./CardModal";
import './Deckdetails.css';
import DeleteDeckModal from "../DeleteDeckModal/DeleteDeckModal";

const DeckDetails = () => {
    const { deck_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const deckDetails = useSelector((state) => state.decksReducer.deckDetail.deck);
    const user = useSelector((state) => state.session.user);


    const handleGoBack = () => {
        navigate(-1);
    };

    const deckCards = deckDetails?.cards || [];

    useEffect(() => {
    const fetchData = async () => {
        try {
            await dispatch(getOneDeck(deck_id));
            await dispatch(getComments(deck_id));
        } catch (error) {
            console.error("Error fetching deck details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, [dispatch, deck_id]);


if (isLoading) {
    return (
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
}

const handleEditBtn = () => {
    navigate(`/decks/${deck_id}/update`);
};


if (!deckDetails) {
    return <DeckNotFound />;
}


    return (
        <div className="details-body">
            <div>
                <div className="top-details">
                    <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                        <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                    </button>
                    <div style={{display:'flex', gap: '9px', justifyContent: 'center'}}>
                    <button className="glow-on-hover" onClick={handleEditBtn} style={{margin: '0 0 20px 0'}} hidden={(!user || user.id !== deckDetails.deck_owner.id)}>
                        Edit
                    </button>
                    <div hidden={(!user || user.id !== deckDetails.deck_owner.id)}>
                        <OpenModalButton
                            buttonText={"Delete"}
                            modalComponent={<DeleteDeckModal deck_id={deckDetails.id}/>}
                            />
                    </div>
                    </div>
                </div>
            </div>
            <div className="lower-details">
                <div className="details-left">
                    {deckCards.length > 0 ? (
                        deckCards.map((card) => (

                            <OpenModalMenuItem
                            itemText= {<img key={card.id} className="details-card" src={card.image.image_url} alt="Card Image" />}
                            onItemClick={() => setShowMenu(false)}
                            modalComponent={<CardModal url={card.image.image_url}/>}
                            />
                        ))
                    ) : (
                        <div className="no-image">No image available</div>
                    )}
                </div>

                <div className="details-right">
                        <div className="details-upperright">
                            <h5>owner: {deckDetails.deck_owner.username}</h5>
                            <h3 style={{fontWeight: '800'}}>{deckDetails.name}</h3>

                            <p style={{width: '240px'}}>{deckDetails.description}</p>

                            <p>Cards in deck: {deckCards.length}</p>
                        </div>
                        <div className="details-lowerright">
                            <h3>Comments feature coming soon!</h3>
                        </div>

                </div>
            </div>
        </div>
    );
};

export default DeckDetails;
