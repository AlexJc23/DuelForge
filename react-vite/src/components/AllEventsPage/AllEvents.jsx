import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../redux/events";

const AllEvents = () => {
    const events = useSelector(state => state.eventsReducer.allEvents)
    const dispatch = useDispatch()

    console.log(events)
    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])

    return (
        <>
            <h1>Under Construction...</h1>
        </>
    )
}


export default AllEvents;
