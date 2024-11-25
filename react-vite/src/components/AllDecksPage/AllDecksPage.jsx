import { getDecks } from "../../redux/decks";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import Loading from '.././Loading'
import './AllDecksPage.css'
import Footer from "../Footer/Footer";


const AllDecksPage = () => {
    const dispatch = useDispatch();
    const decks = useSelector(state => state.decksReducer.allDecks);
    const allDecks = decks ? Object.values(decks) : [];
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const [searchTerms, setSearchTerms] = useState("");


    const getSearchQuery = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param) || '';
    };

    const searchTerm = getSearchQuery('search');

    useEffect(() => {
        const fetchDecks = async () => {
            setIsLoading(true);
            try {
                await dispatch(getDecks({ deck_name: searchTerm }));
            } catch (err) {
                setError('Failed to load decks.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDecks();
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

    const handleSearch = (e) => {
        e.preventDefault();
        // Update the query string with the search term
        const path = `/decks?search=${encodeURIComponent(searchTerms)}`;
        navigate(path);
        setSearchTerms(""); // Clear the search input
    };
    return (
        <>
        <div  className="decks-container">
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
            <ul className="decks-list">
                {allDecks.map((successfulDeck) => (
                    <NavLink key={successfulDeck.id} to={`/decks/${successfulDeck.id}`} className="deck-card">
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
                        <p style={{textAlign: 'center',marginTop: '19px', marginLeft: '40px', width:'38px', color: 'white'}}>{successfulDeck.name}</p>
                    </NavLink>
                ))}
            </ul>
        </div>
        <Footer />
        </>
    );
}

export default AllDecksPage;
