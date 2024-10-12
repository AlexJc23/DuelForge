import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneDeck } from "../../redux/decks";


const DeckDetails = () => {
    const {deck_id} = useParams()

    const deckDetails = useSelector((state) => state.decksReducer.deckDetail.deck)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOneDeck(deck_id))
    }, [dispatch, deck_id])

    return (
        <>
        <h1>Hello! Deck details is coming soon</h1>
        </>
    )
}

export default DeckDetails;
