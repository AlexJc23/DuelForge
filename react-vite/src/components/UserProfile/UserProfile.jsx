import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDecksByUserId } from "../../redux/decks";
import { getUserEventsById } from "../../redux/events";
import Footer from "../Footer/Footer";
import { NavLink, useParams } from "react-router-dom";
import { thunkGetUserProfile } from "../../redux/session";
import '.././LoggedinUserContent/LoggedinUserContent.css'




const UserProfile = () => {
    const {user_id} = useParams()

    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // State to toggle expanded view
    const [isExpandedEvent, setIsExpandedEvent] = useState(false); // State to toggle expanded view

    const decks = useSelector(state => state.decksReducer.userDecks);
    const events = useSelector(state => state.eventsReducer.userEvents);
    const profile = useSelector(state => state.session.userProfile);
    console.log(profile)
    const allDecks = decks ? Object.values(decks) : [];
    const allEvents = events ? Object.values(events) : [];



    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            await dispatch(getDecksByUserId(user_id));
            await dispatch(getUserEventsById(user_id));
            setIsLoading(false);
        };
        fetchData();
    }, [dispatch, user_id]);

    useEffect(() => {
        dispatch(thunkGetUserProfile(user_id))
    }, [dispatch, user_id])

    const toggleExpandDeck = () => {
        setIsExpanded(!isExpanded);
    };
    const toggleExpandEvent = () => {
        setIsExpandedEvent(!isExpandedEvent);
    };

    // Limit the number of decks to display based on `isExpanded`
    const decksToDisplay = isExpanded ? allDecks : allDecks.slice(0, 3); // Show only 3 decks if not expanded
    const eventsToDisplay = isExpandedEvent ? allEvents : allEvents.slice(0, 3); // Show only 3 decks if not expanded



    return isLoading ? (
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
    ) : (
        <>
            <div className="profile-body">
                <div className="user-left">
                    <div className="left-top">
                        {allDecks.length < 1 ? (
                            <div className="no-content">
                                <p>{'No decks have been created'}</p>
                            </div>
                        ) : (
                            <div className="decks-left">
                            <div className="decks-prfl">
                                <div className="decks-container-profl">
                                    {decksToDisplay.map((profile_deck) => (
                                        <NavLink key={profile_deck.id} to={`/decks/${profile_deck.id}`} className="card-prfl">
                                            {profile_deck.cards && profile_deck.cards.length > 0 && profile_deck.cards[0].images.length > 0 ? (
                                                <div className="card">
                                                    <img className="deck-img image1" src={profile_deck.cards[0].images[0].image_url} alt="deck card 1" />
                                                    {profile_deck.cards[1] && (
                                                        <img className="deck-img image2" src={profile_deck.cards[1].images[0].image_url} alt="deck card 2" />
                                                    )}
                                                    {profile_deck.cards[2] && (
                                                        <img className="deck-img image3" src={profile_deck.cards[2].images[0].image_url} alt="deck card 3" />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="no-image">No image available</div>
                                            )}
                                            <p className="profile-deck-title">{profile_deck.name}</p>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                                <button  onClick={toggleExpandDeck} hidden={allDecks.length <= 3} className="expand-button">
                                    {isExpanded ? "View Less" : "View All Decks"}
                                </button>
                                </div>
                        )}
                    </div>
                    {/* split */}
                    <div className="left-bottom">
                        {allEvents.length < 1 ? (
                            <div className="no-content">
                                <p>No events have been created.</p>
                            </div>
                        ) : (
                            <div className="events-left">
                            <div className="events-prfl">
                                <div className="events-container-profl">
                                {eventsToDisplay.map((successfulEvent) => (
                                    <NavLink key={successfulEvent.id} to={`/events/${successfulEvent.id}`}>
                                        <div className="cards">
                                            <img className="event-img" src={successfulEvent.image[0].image_url} alt={successfulEvent.name} />
                                            <div className="info">
                                                <h4 style={{color:'#00bfff', fontWeight:'800', fontSize:'1rem'}}>{successfulEvent.name}</h4>
                                                <p>{successfulEvent.description}</p>
                                                <p style={{marginTop:'20px'}}>${successfulEvent.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                                </div>
                            </div>
                                <button  onClick={toggleExpandEvent} hidden={allEvents.length <=3} className="expand-button">
                                    {isExpandedEvent ? "View Less" : "View All Events"}
                                </button>
                                </div>
                        )}
                    </div>
                </div>
                <div className="user-right">
                    <h2>{profile ? profile.username: 'No username available'}</h2>
                    {/* <div className="follows">
                        <p>Following</p>
                        <p>Followers</p>
                    </div> */}
                    <p>Created: {allDecks.length} {allDecks.length > 1 ? 'Decks' : 'Deck'}</p>
                    <p>Hosted: {allEvents.length} {allEvents.length > 1 ? 'Events' : 'Event'}</p>

                    <div className="user-bio">
                        <h3>Bio:</h3>
                        <p>{profile ? profile.bio : "No bio available"}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default UserProfile;
