
import { csrfFetch } from "./csrf";

const ALL_DECKS = 'session/allDecks';
const ONE_DECK = 'session/oneDeck';
const CURRENTUSER_DECKS = 'session/currentuserDecks';
const ADD_DECK = 'session/addDeck';
const EDIT_DECK = 'session/editDeck';
const DELETE_DECK = 'session/deleteDeck'
const USER_DECKS = 'session/userDecks';







// load all decks
const loadDecks = (decks) => ({
    type: ALL_DECKS,
    decks
})

// load one deck by id
const loadOneDeck =(deck) => ({
    type: ONE_DECK,
    deck
})

// current logged in user decks
const loadUserDecks = (decks) => ({
    type: CURRENTUSER_DECKS,
    decks
})

// load decks for a specific user
const fetchUserDecks = (decks) => ({
    type: USER_DECKS,
    decks
});

// add a deck
const addDeck = (deck) => ({
    type:ADD_DECK,
    deck
})

// Edit a deck
const updateDeck = (deck) => ({
    type: EDIT_DECK,
    deck
})

// remove a deck
const removeDeck = (deck_id) => ({
    type: DELETE_DECK,
    deck_id
})





// get all decks with optional search queries
export const getDecks = (searchParams = {}) => async (dispatch) => {
    // Destructure the search parameters
    const { deck_name, owner_name, card_name } = searchParams;

    // Build query string
    const query = new URLSearchParams();
    if (deck_name) query.append("deck_name", deck_name);
    if (owner_name) query.append("owner_name", owner_name);
    if (card_name) query.append("card_name", card_name);

    // Make the request with query parameters
    const res = await csrfFetch(`/api/decks?${query.toString()}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadDecks(data)); // Dispatch the action to load decks
        return data;
    }
    return res;
};



// get one deck details
export const getOneDeck = (deck_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/decks/${deck_id}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadOneDeck(data))
        return data
    }
    return res
}


// get current loggedin user decks
export const loggedInUserDeck = () =>  async (dispatch) => {
    const res = await csrfFetch('/api/decks/current');

    if (res.ok) {
        const data = await res.json()

        dispatch(loadUserDecks(data));
        return data
    }
    return res
}

// get decks by user_id
export const getDecksByUserId = (user_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/decks/user/${user_id}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(fetchUserDecks(data));
        return data;
    }
    return res;
};

// add deck
export const createDeck = (deck) => async (dispatch) => {
    let res;
    let newDeck = {
        user_id: deck.user_id,
        name: deck.name,
        description: deck.description
    }

    try {
        res = await csrfFetch('/api/decks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newDeck)
        });
    } catch (error) {
        if (error.json) {
            return error.json();  // Safely handle errors that have JSON response
        } else {
            return { error: "An unexpected error occurred" };
        }
    }

    const data = await res.json();

        for (const cardId of deck.cardsInDeck) {
            let cardDeck = {
                card_id: cardId,
                deck_id: data.id
            };
            console.log(cardDeck)
            try {
                await csrfFetch(`/api/cards/add/${cardId}/${data.id}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(cardDeck)
                });
            } catch (error) {
                return error;
            }

        }

    dispatch(addDeck(data));
    return data;
};


// Edit a deck by id
export const editADeck = (deck, deck_id) => async (dispatch) => {
    let res;

    const updatedDeck = {
        name: deck.name,
        description: deck.description
    };

    try {
        res = await csrfFetch(`/api/decks/${deck_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDeck)
        });

        // Check if the response is okay before parsing
        if (!res.ok) {
            const errorData = await res.json(); // Read the error response once
            return { errors: errorData }; // Return error for handling
        }

        const data = await res.json(); // Read the response body once

        // Remove old cards from the deck
        if ( deck.ogDeck ) {
            for (const cardId of deck.ogDeck) {
                try {
                    await csrfFetch(`/api/cards/${cardId}/${data.id}`, {
                        method: 'DELETE',
                    });
                } catch (error) {
                    console.error("Error deleting card:", error);
                    return { errors: "Failed to delete some cards." };
                }
            }
        }


        // Add new cards to the deck

        for (const cardId of deck.cardsInDeck) {
            const cardDeck = {
                card_id: cardId,
                deck_id: data.id
            };

            try {
                await csrfFetch(`/api/cards/add/${cardId}/${data.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cardDeck)
                });
            } catch (error) {
                console.error("Error adding card:", error);
                return { errors: "Failed to add some cards." };
            }
        }

        dispatch(updateDeck(data));
        return data;

    } catch (error) {

        console.error("Error updating deck:", error);
        return { errors: "An unexpected error occurred." };
    }
};


export const deleteDeck = (deck_id) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/decks/${deck_id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            dispatch(removeDeck(deck_id));
            return res; // Return response for any further handling if needed
        } else {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to delete deck');
        }
    } catch (error) {
        console.error('Error deleting deck:', error);
        return { error: error.message }; // Return error message for handling in the modal
    }
};







const initialState = {allDecks: {}, deckDetail: {}, userDecks: {}}

function decksReducer(state = initialState, action) {
    switch (action.type) {
        case ALL_DECKS: {
            const allDecks = {};
            action.decks.forEach((deck) => {
                allDecks[deck.id] = deck
            });
            return {
                ...state,
                allDecks,
            };
        }
        case ONE_DECK: {
            const deckDetail = action
            return {
                ...state,
                deckDetail
            }
        }
        case CURRENTUSER_DECKS: {
            const userDecks = {};
            action.decks.forEach((deck) => {
                userDecks[deck.id] = deck
            });
            return {
                ...state,
                userDecks
            }
        }
        case USER_DECKS: {
            const userDecks = {};
            action.decks.forEach((deck) => {
                userDecks[deck.id] = deck;
            });
            return {
                ...state,
                userDecks
            };
        }
        case ADD_DECK: {
            const newDeck = action.deck;
            return {
                ...state,
                allDecks: {
                    ...state.allDecks,
                    [newDeck.id]: newDeck
                }
            }
        }

        case EDIT_DECK: {
            const updatedDeck = action.deck;  // Use action.deck
            return {
                ...state,
                allDecks: {
                    ...state.allDecks,
                    [updatedDeck.id]: updatedDeck
                }
            }
        }
        case DELETE_DECK: {
            const { [action.deck_id]: removedDeck, ...remainingDecks } = state.allDecks;
            return {
                ...state,
                allDecks: remainingDecks,
            };
        }

        default:
            return state
    }
}

export default decksReducer;
