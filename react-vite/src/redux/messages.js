import { csrfFetch } from './csrf';

const LOAD_CONVERSATIONS = 'session/loadConversations';
const LOAD_MESSAGES = 'session/loadMessages';
const ADD_MESSAGE = 'session/addMessage';
const DELETE_MESSAGE = 'session/deleteMessage';




// Load conversations
const loadConversations = (conversations) => ({
    type: LOAD_CONVERSATIONS,
    conversations,
});

// Load messages for a specific conversation
const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    messages,
});

// Add a message
const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message,
});

// Delete a message
const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    messageId,
});

// Fetch all conversations
export const getConversations = () => async (dispatch) => {
    const res = await csrfFetch('/api/chat/conversations');
    if (res.ok) {
        const data = await res.json();
        dispatch(loadConversations(data));
    }
    return res
};

// Fetch messages for a specific conversation
export const getMessages = (conversationId) => async (dispatch) => {
    const res = await csrfFetch(`/api/chat/conversations/${conversationId}/messages`);
    if (res.ok) {
        const data = await res.json();
        dispatch(loadMessages(data));
    }
};

// Send a new message
export const createMessage = (conversationId, content) => async (dispatch) => {
    const res = await csrfFetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addMessage(data));
    }
};

// Delete a message
export const removeMessage = (messageId) => async (dispatch) => {
    const res = await csrfFetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(deleteMessage(messageId));
    }
};



const initialState = {
    conversations: {},
    messages: {},
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CONVERSATIONS: {
            const conversations = {};
            action.conversations.forEach((conv) => {
                conversations[conv.id] = conv;
            });
            return { ...state, conversations };
        }
        case LOAD_MESSAGES: {
            const messages = {};
            action.messages.forEach((msg) => {
                messages[msg.id] = msg;
            });
            return { ...state, messages };
        }
        case ADD_MESSAGE: {
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.message.id]: action.message,
                },
            };
        }
        case DELETE_MESSAGE: {
            const { [action.messageId]: removedMessage, ...remainingMessages } = state.messages;
            return {
                ...state,
                messages: remainingMessages,
            };
        }
        default:
            return state;
    }
};

export default messageReducer;
