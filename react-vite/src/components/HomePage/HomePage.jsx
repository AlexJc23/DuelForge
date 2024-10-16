import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDecks } from "../../redux/decks";
import { NavLink } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import './HomePage.css';
import { getEvents } from "../../redux/events";

const HomePage = () => {
    const decks = useSelector(state => state.decksReducer.allDecks);
    const allDecks = decks ? Object.values(decks) : [];

    const events = useSelector(state => state.eventsReducer.allEvents)
    const allEvents = events ? Object.values(events) : [];

    const dispatch = useDispatch();

    // Function to get random decks
    const getRandomStuff = (decksArray, numberOfDecks) => {
        const copyDecksArray = [...decksArray];
        for (let i = copyDecksArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copyDecksArray[i], copyDecksArray[j]] = [copyDecksArray[j], copyDecksArray[i]];
        }
        return copyDecksArray.slice(0, numberOfDecks);
    };

    // Get 3 random decks
    const randomDecks = getRandomStuff(allDecks, 4);
    const randomEvents = getRandomStuff(allEvents, 3)
    console.log(randomEvents)

    // Dispatch action to fetch decks on component mount
    useEffect(() => {
        dispatch(getDecks());
        dispatch(getEvents())
    }, [dispatch]);




    return allDecks.length === 0 ? (<div id="loading"><h1 className='loading'>
                <span class="let1">l</span>
                <span class="let2">o</span>
                <span class="let3">a</span>
                <span class="let4">d</span>
                <span class="let5">i</span>
                <span class="let6">n</span>
                <span class="let7">g</span>
            </h1></div>): (
        <div className="home-content">
            <div className="deck-featured">
                <h3 >Featured Decks <span className="featured-line" ></span></h3>
                <ul className="stuff">
                    {randomDecks.map((successfulDeck) => (
                        <NavLink key={successfulDeck.id} to={`/decks/${successfulDeck.id}`} className="bubbles">
                            {successfulDeck.cards && successfulDeck.cards.length > 0 && successfulDeck.cards[0].images.length > 0 ? (
                                <div className="card">
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
                    <div  class="glow-on-hover2">
                    <NavLink style={{width:'400px', height:'150px'}} to={'/decks'} class="glow-on-hover2">All Decks <FaArrowRight/></NavLink>

                    </div>
                </ul>
            </div>
            <div className="event-featured">
                <h3>Featured Events <span className="featured-line"></span></h3>
                <div className="event-cards">
                    {randomEvents.map((successfulEvent) => (
                        <NavLink key={successfulEvent.id} to={`/events/${successfulEvent.id}`}>
                            <div className="cards">
                                <img className="event-img" src={successfulEvent.images[0].image_url} alt={successfulEvent.name} />
                                <div className="info">
                                    <h4 style={{color:'#00bfff', fontWeight:'800', fontSize:'1rem'}}>{successfulEvent.name}</h4>
                                    <p>{successfulEvent.description}</p>
                                    <p style={{marginTop:'20px'}}>${successfulEvent.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                    <div class="glow-on-hover2">
                    <NavLink class="glow-on-hover2" style={{ width:'400px', height:'150px'}} to={'/decks'}>All Events <FaArrowRight /></NavLink>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
