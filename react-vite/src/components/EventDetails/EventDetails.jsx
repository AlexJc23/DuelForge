import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOneEvent } from "../../redux/events";
import EventNotFound from "./EventNotFound";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoTicketOutline } from "react-icons/io5";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import DeleteEventModal from "../DeleteEventModal/DeleteEventModal";
import './EventDetails.css';
import LoadMap from "./LoadMap";


const EventDetails = () => {
    const { event_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.session.user);
    const eventDetails = useSelector((state) => state.eventsReducer.eventDetail.event);

    // State for coordinates
    console.log('this one   ',eventDetails)

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            await dispatch(getOneEvent(event_id));
            setIsLoading(false);
        };

        fetchEventDetails();
    }, [dispatch, event_id]);

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

    if (!eventDetails) {
        return <EventNotFound />;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }
    const handleEditBtn = () => {
        navigate(`/events/${eventDetails.id}/update`);
    };



    return (
        <div className="event-details-body">
            <div className="top-details">
                <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                    <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                </button>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                    <button onClick={handleEditBtn} className="glow-on-hover" style={{ margin: '0 10px 20px 0' }} hidden={(!user || user.id !== eventDetails.event_owner.id)}>
                        Edit
                    </button>
                    <div hidden={(!user || user.id !== eventDetails.event_owner.id)}>
                        <OpenModalButton
                            buttonText={"Delete"}
                            modalComponent={<DeleteEventModal event_id={eventDetails.id}/>}
                            />
                    </div>
                </div>
            </div>
            <div className="event-details-top">
                {eventDetails.image && eventDetails.image.image_url ? (
                    <img className="event-details-img" src={eventDetails.image.image_url} alt="event" />
                ) : (
                    <img className="event-details-img" alt="No event image available" />
                )}
            </div>
            <div className="event-details-btm">
                <div className="details-btm-left">
                    <h3>{eventDetails.name}</h3>
                    <p> {eventDetails.description}</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '13px'}}>
                        <p  style={{fontSize: '25px'}}><FaMapLocationDot /></p>
                        <p> {eventDetails.location}</p>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: '13px'}}>
                        <p><BsCalendarDateFill style={{fontSize: '25px'}}/></p>
                        <p> {formatDate(eventDetails.start_date)} - {formatDate(eventDetails.end_date)}</p>
                    </div>


                    <div style={{display: 'flex', alignItems: 'center', gap: '13px'}}>
                        <p><IoTicketOutline style={{fontSize: '25px'}}/></p>
                        <p>${eventDetails.price.toFixed(2)}</p>
                    </div>

                    <h5 style={{borderTop: '1px solid gray', paddingTop: '10px', margin: 'auto auto 10px 0', width: '90%', color: '#00bfff'}}>Host: {eventDetails.event_owner.username}</h5>
                </div>
                <div className="details-btm-rt">
                    <LoadMap id='map' address={eventDetails.location}/>
                </div>
            </div>

        </div>
    );
};

export default EventDetails;
