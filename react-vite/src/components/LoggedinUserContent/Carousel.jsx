import { useState } from "react";
import { NavLink } from "react-router-dom";
// import './LoggedinUserContent.css'

const DeckCarousel = ({ decks }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleItems = 2; // Set how many decks to show at once

    const nextSlide = () => {
        if (currentIndex < decks.length - visibleItems) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <button className='next-prev' onClick={prevSlide} disabled={currentIndex === 0}>Prev</button>
            <div style={{ display: "flex", overflow: "hidden", gap: '20px' }}>
                {decks.slice(currentIndex, currentIndex + visibleItems).map((profile_deck) => (
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
            <button  className="next-prev" onClick={nextSlide} disabled={currentIndex >= decks.length - visibleItems}>Next</button>
        </div>
    );
};

export default DeckCarousel;
