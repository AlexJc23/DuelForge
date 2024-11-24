import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUserDeck } from "../../redux/decks";
import { loggedInUserEvent } from "../../redux/events";
import Footer from "../Footer/Footer";
import { NavLink } from "react-router-dom";

import './LoggedinUserContent.css';
import DeleteUserAccountModal from "./DeleteUserAccntModal";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { thunkUpdateUserProfile } from "../../redux/session";  // Make sure your thunk updates the bio in the Redux store
import OpenModalMenuItemDeleteAccnt from "../OpenModalMenuItemCard/OpenModalMenuItemDeleteAccnt";
import Loading from "../Loading/Loading";

const LoggedinUserContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandedEvent, setIsExpandedEvent] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState('');
    const [error, setError] = useState({});

    const decks = useSelector(state => state.decksReducer.userDecks);
    const events = useSelector(state => state.eventsReducer.userEvents);
    const currentUser = useSelector(state => state.session.user);

    const allDecks = decks ? Object.values(decks) : [];
    const allEvents = events ? Object.values(events) : [];

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await dispatch(loggedInUserDeck());
            await dispatch(loggedInUserEvent());
            setIsLoading(false);
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        setBio(currentUser.bio || '');
    }, [currentUser])

    const toggleExpandDeck = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleExpandEvent = () => {
        setIsExpandedEvent(!isExpandedEvent);
    };

    const decksToDisplay = isExpanded ? allDecks : allDecks.slice(0, 3);
    const eventsToDisplay = isExpandedEvent ? allEvents : allEvents.slice(0, 3);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serverResponse = await dispatch(
            thunkUpdateUserProfile({ bio }, currentUser.id)
        );

        if (serverResponse && serverResponse.errors) {
            setError({ ...serverResponse.errors });
        } else {
            setEditingBio(false);

            setBio(bio);
        }
    };

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <div className="profile-body">
                <div className="user-left">
                    <div className="left-top">
                        {allDecks.length < 1 ? (
                            <div className="no-content">
                                <p>Oh no! You currently do not have any decks.</p>
                                <p>Once you create a deck, you will see it here!</p>
                                <NavLink className="creation-btn" to="/decks/create">Create A Deck!</NavLink>
                            </div>
                        ) : (
                            <div className="decks-left">
                                <div className="decks-prfl">
                                    <div className="decks-container-profl">
                                        {decksToDisplay.map(profile_deck => (
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
                                <button onClick={toggleExpandDeck} hidden={allDecks.length <= 3} className="expand-button">
                                    {isExpanded ? "View Less" : "View All Decks"}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="left-bottom">
                        {allEvents.length < 1 ? (
                            <div className="no-content">
                                <p>Oh no! You currently do not have any events.</p>
                                <p>Once you host an event, you will see it here!</p>
                                <NavLink className="creation-btn" to="/events/create">Create an Event!</NavLink>
                            </div>
                        ) : (
                            <div className="events-left">
                                <div className="events-prfl">
                                    <div className="events-container-profl">
                                        {eventsToDisplay.map(successfulEvent => (
                                            <NavLink key={successfulEvent.id} to={`/events/${successfulEvent.id}`}>
                                                <div className="cards">
                                                    <img className="event-img" src={successfulEvent.image[0].image_url} alt={successfulEvent.name} />
                                                    <div className="info">
                                                        <h4 style={{ color: '#00bfff', fontWeight: '800', fontSize: '1rem' }}>{successfulEvent.name}</h4>
                                                        <p>{successfulEvent.description}</p>
                                                        <p style={{ marginTop: '20px' }}>${successfulEvent.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={toggleExpandEvent}  hidden={allEvents.length <= 3} className="expand-button">
                                    {isExpandedEvent ? "View Less" : "View All Events"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="user-right">
                    <h2>{currentUser.username}</h2>
                    <div className="follows">
                        <p>Following</p>
                        <p>Followers</p>
                    </div>
                    <p>Created: {allDecks.length} {allDecks.length > 1 ? 'Decks' : 'Deck'}</p>
                    <p>Hosted: {allEvents.length} {allEvents.length > 1 ? 'Events' : 'Event'}</p>
                    <div className="user-bio">
                        <h3>Bio <span><MdOutlineModeEditOutline onClick={() => setEditingBio(true)} /></span></h3>
                        {!editingBio ? (
                            <div>
                                {bio ? <p>{bio}</p> : ''}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell the world about yourself...."
                                    />
                                </label>
                                {error.bio && <div className="error">{error.bio}</div>}
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingBio(false)}>Cancel</button>
                            </form>
                        )}
                    </div>
                    <OpenModalMenuItemDeleteAccnt
                        itemText="DELETE ACCNT"
                        onItemClick={() => setShowMenu(false)}
                        modalComponent={<DeleteUserAccountModal user_id={currentUser.id} />}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoggedinUserContent;
