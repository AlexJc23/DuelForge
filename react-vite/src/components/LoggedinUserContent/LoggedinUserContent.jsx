import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUserDeck } from "../../redux/decks";
import { loggedInUserEvent } from "../../redux/events";


const LoggedinUserContent = () => {

    const decks = useSelector(state => state)
    const events = useSelector(state => state)
    console.log('ooooooo', events)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loggedInUserDeck())
        dispatch(loggedInUserEvent())
    }, [dispatch])

    return (
        <>
        <h1>This will be your page if youre logged in bro</h1>
        </>
    )
}

export default LoggedinUserContent;
