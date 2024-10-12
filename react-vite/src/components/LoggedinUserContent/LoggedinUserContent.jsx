import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUserDeck } from "../../redux/decks";


const LoggedinUserContent = () => {

    const decks = useSelector(state => state)
    console.log(decks)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loggedInUserDeck())
    }, [dispatch])

    return (
        <>
        <h1>This will be your page if youre logged in bro</h1>
        </>
    )
}

export default LoggedinUserContent;
