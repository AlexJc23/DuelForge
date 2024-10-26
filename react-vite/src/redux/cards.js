import { csrfFetch } from "./csrf";

const ALL_CARDS = 'session/allCards';
const ADD_CARD = 'session/addCard';
const REMOVE_CARD_FROM_DECK = 'session/removeCardFromDeck';

const loadCards = (cards) => ({
    type: ALL_CARDS,
    cards
});

const addACard = (card) => ({
    type: ADD_CARD,
    card
});

const removeCard = (card_id, deck_id) => ({
    type: REMOVE_CARD_FROM_DECK,
    card_id,
    deck_id
});

export const getAllCards = () => async (dispatch) => {
    const res = await csrfFetch(`/api/cards`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadCards(data));
        return data;
    }
    return res;
};

export const addCardToDeck = (card, deck_id) => async (dispatch) => {
    const cardDeck = {
        deck_id: deck_id,
        card_id: card.id,
    };

    try {
        const res = await csrfFetch(`/api/add/${card.id}/${deck_id}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardDeck),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to add card');
        }

        dispatch(addACard(card));
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};

export const removeCardFromDeck = (card_id, deck_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/cards/${card_id}/${deck_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeCard(card_id, deck_id));
    } else {
        const errorData = await res.json();
        console.error(errorData);
    }
};
const initialState = { allCards: {}, deckCards: [] };

function cardsReducer(state = initialState, action) {
    switch (action.type) {
        case ALL_CARDS: {
            const allCards = {};
            action.cards.forEach((card) => {
                allCards[card.id] = card;
            });
            return {
                ...state,
                allCards
            };
        }
        case ADD_CARD: {
            const newCard = action.card;
            return {
                ...state,
                allCards: {
                    ...state.allCards,
                    [newCard.id]: newCard,
                },
            };
        }
        case REMOVE_CARD_FROM_DECK: {
            const { card_id } = action;
            return {
                ...state,
                deckCards: state.deckCards.filter(card => card.id !== card_id),
            };
        }
        default:
            return state;
    }
}



export default cardsReducer;
