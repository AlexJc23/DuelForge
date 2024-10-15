import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneDeck } from "../../redux/decks";
import { getComments } from "../../redux/comments";


const DeckDetails = () => {
    const {deck_id} = useParams()

    const deckDetails = useSelector((state) => state.decksReducer.deckDetail.deck)
    const comments = useSelector(state => state.commentReducer)
    console.log(comments)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOneDeck(deck_id))
        dispatch(getComments(deck_id))
    }, [dispatch, deck_id])

    return (
        <div className="details-body">
            <div>
                <div>
                    <button onClick={handleGoBack}><FaArrowLeftLong style={{marginRight: '5px'}}/> Back to Listings</button>
                </div>
            </div>
        </div>
    )
}

export default DeckDetails;
