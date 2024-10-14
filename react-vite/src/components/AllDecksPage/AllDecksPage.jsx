import { getDecks } from "../../redux/decks"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';


const AllDecksPage = () => {
    const decks = useSelector(state => state.decksReducer.allDecks)
    console.log(decks)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getDecks())
    },[dispatch])

    return (
        <>
        <h1>Hello World! Future Decks pages</h1>
        </>
    )
}

export default AllDecksPage
