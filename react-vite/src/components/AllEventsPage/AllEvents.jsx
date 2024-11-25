import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../redux/events";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiTicket } from "react-icons/gi";
import { FaMapLocationDot } from "react-icons/fa6";
import './AllEvents.css'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Loading from "../Loading";

const AllEvents = () => {
    const events = useSelector(state => state.eventsReducer.allEvents)
    const dispatch = useDispatch()
    const allEvents = events ? Object.values(events) : [];
    const location = useLocation()
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerms, setSearchTerms] = useState("");


    const getSearchQuery = (param) => {
        const searchParams = new URLSearchParams(location.search)
        return searchParams.get(param) || '';
    };
    const searchTerm = getSearchQuery('search');
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const locationParam = getSearchQuery('location');  // Get location from query params
                await dispatch(getEvents({ event_name: searchTerm, location: locationParam }));
            } catch (err) {
                setError('Failed to load events');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [dispatch, searchTerm]);


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleGoBack = () => {
        navigate('/home');
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }

    const handleSearch = (e) => {
        e.preventDefault();

        const path = `/events?search=${encodeURIComponent(searchTerms)}`;
        navigate(path);
        setSearchTerms("");
    };

    return (
        <>
        <div className="events-container">
            <div>
                <div className="top-details">
                    <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                        <FaArrowLeftLong style={{ marginRight: '5px' }} /> Home
                    </button>
                    <li className="searchbar decks-search">
                        <form onSubmit={handleSearch}>
                        <input
                            type="textarea"
                            placeholder="Search..."
                            value={searchTerms} 
                            onChange={(e) => setSearchTerms(e.target.value)} 
                        />
                        </form>
                    </li>
                </div>
            </div>
            {allEvents.length != 0 ? (<ul className="events-list">
                {allEvents.map((successfulEvent) => (
                    <NavLink key={successfulEvent.id} className={'event-card btn-neon'} to={`/events/${successfulEvent.id}`} >
                        {successfulEvent.images[0].image_url ? <img className="event_img" src={successfulEvent.images[0].image_url}></img> : <div className="event_img">No image available</div>}
                        <div className="details-info">
                            <h5 style={{textDecoration: 'underline', height: '37px'}}>{successfulEvent.name}</h5>

                            <div style={{display: 'flex', gap: '10px', alignItems: 'center', height: '80px'}}>
                                <span><FaMapLocationDot style={{fontSize: '20px'}}/></span>
                                <p style={{overflow: 'hidden'}}> {successfulEvent.location}</p>

                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '10px', alignSelf: 'self-start', margin: ' 0 0 8px 19px', justifySelf: 'self-end'}}>
                            <span><GiTicket style={{ fontSize: '20px'}}/></span>
                            <p>${successfulEvent.price.toFixed(2)}</p>
                        </div>
                        <div style={{borderTop: '1px solid gray', paddingTop: '10px', margin: 'auto auto 10px auto', width: '100%'}} id="dates-containter">
                            <p>{formatDate(successfulEvent.start_date)} - {formatDate(successfulEvent.end_date)}</p>
                        </div>

                    </NavLink>
                ))}
            </ul>) : (<h1>No events were found...</h1>)}
        </div>
            <Footer />
        </>
    )
}


export default AllEvents;
