import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDecks } from "../../redux/decks";
import { NavLink } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import './HomePage.css';
import { getEvents } from "../../redux/events";

const HomePage = () => {
    const dispatch = useDispatch();
    const decks = useSelector(state => state.decksReducer.allDecks);
    const allDecks = decks ? Object.values(decks) : [];

    const events = useSelector(state => state.eventsReducer.allEvents)
    const allEvents = events ? Object.values(events) : [];


    // Function to get random decks
    const getRandomStuff = (decksArray, numberOfDecks = 4) => {
        const copyDecksArray = [...decksArray];
        for (let i = copyDecksArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copyDecksArray[i], copyDecksArray[j]] = [copyDecksArray[j], copyDecksArray[i]];
        }
        return copyDecksArray.slice(0, numberOfDecks);
    };

    // Get 3 random decks
    const randomDecks = getRandomStuff(allDecks);
    const randomEvents = getRandomStuff(allEvents)
    console.log(randomEvents)

    // Dispatch action to fetch decks on component mount
    useEffect(() => {
        dispatch(getDecks());
        dispatch(getEvents())
    }, [dispatch]);

    // loading screen
    if (!allDecks.length) return (<div id="loading"><h1 className='loading'>
        <span class="let1">l</span>
        <span class="let2">o</span>
        <span class="let3">a</span>
        <span class="let4">d</span>
        <span class="let5">i</span>
        <span class="let6">n</span>
        <span class="let7">g</span>
    </h1></div>);

    return (
        <div className="home-content">
            <div className="deck-featured">
                <h3 >Featured Decks <span className="featured-line" ></span></h3>
                <ul className="stuff">
                    {randomDecks.map((successfulDeck) => (
                        <NavLink key={successfulDeck.id} to={`/decks/${successfulDeck.id}`} className="bubbles">
                            {successfulDeck.cards && successfulDeck.cards.length > 0 && successfulDeck.cards[0].images.length > 0 ? (
                                <div className="card">
                                    {/* Displaying overlapping deck images */}
                                    <img className="deck-img image1" src={successfulDeck.cards[0].images[0].image_url} alt="deck card 1" />
                                    {successfulDeck.cards[1] && (
                                        <img className="deck-img image2" src={successfulDeck.cards[1].images[0].image_url} alt="deck card 2" />
                                    )}
                                    {successfulDeck.cards[2] && (
                                        <img className="deck-img image3" src={successfulDeck.cards[2].images[0].image_url} alt="deck card 3" />
                                    )}
                                </div>
                            ) : (
                                <div className="no-image">No image available</div>
                            )}
                            <p style={{marginTop: '19px', marginLeft: '16px'}}>{successfulDeck.name}</p>
                        </NavLink>
                    ))}
                    <div style={{}} class="glow-on-hover">
                    <NavLink to={'/decks'} class="view-btn">View all Decks <FaArrowRight/></NavLink>

                    </div>
                </ul>
            </div>
            <div className="event-featured">
                <h3 >Featured Decks <span className="featured-line" ></span></h3>

            </div>
        </div>
    );
};

export default HomePage;
