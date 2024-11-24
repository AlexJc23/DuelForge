// ------------------------- Imports -------------------------
import { csrfFetch } from "./csrf";

// ------------------------- Action Types -------------------------
const ALL_COMMENTS = 'session/allComments';
const ADD_COMMENT = 'session/addComment';
const EDIT_COMMENT = 'session/editComment';
const DELETE_COMMENT = 'session/deleteComment';
const LIKE_COMMENT = 'session/likeComment';

// ------------------------- Action Creators -------------------------

// Action to load all comments
const loadComments = (comments) => ({
    type: ALL_COMMENTS,
    comments
});

// Action to create a comment
const addComment = (comments) => ({
    type: ADD_COMMENT,
    comments
});

// Action to edit a comment
const updateComment = (comment) => ({
    type: EDIT_COMMENT,
    comment
});

// Action to delete a comment
const deleteComment = (comment_id) => ({
    type: DELETE_COMMENT,
    comment_id
});

// Action to like a comment
const likeComment = (comment) => ({
    type: LIKE_COMMENT,
    comment,
});

// ------------------------- Thunks -------------------------

// Thunk to get comments for a specific deck
export const getComments = (deck_id) => async (dispatch) => {
    let res = await csrfFetch(`/api/decks/${deck_id}/comments`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadComments(data)); // Dispatch with data
        return data;
    }
    return res;
};

// Thunk to add a comment
export const createComment = (comment, deck_id) => async (dispatch) => {
    let res;
    let newComment = {
        deck_id: deck_id,
        comment: comment
    };

    try {
        res = await csrfFetch(`/api/decks/${deck_id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment)
        });
    } catch (error) {
        return error.json();
    }

    const data = await res.json();
    dispatch(addComment(data));
    return res;
};

// Thunk to edit an existing comment
export const editComment = (updatedCommentData, commentId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/decks/comment/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCommentData),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(updateComment(data));
            return data;
        } else {
            const error = await response.json();
            console.error('Error response:', error); // Log the error for more details
            return error;
        }
    } catch (err) {
        console.error('Error editing comment:', err);
    }
};

// Thunk to delete a comment
export const removeComment = (comment_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/decks/comments/${comment_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteComment(comment_id));
        return res;
    }
};

// ------------------------- Initial State -------------------------
const initialState = { allComments: {} };

// ------------------------- Reducer -------------------------

function commentReducer(state = initialState, action) {
    switch (action.type) {
        case ALL_COMMENTS: {
            const allComments = {};
            action.comments.forEach((comment) => {
                allComments[comment.id] = comment;
            });
            return {
                ...state,
                allComments,
            };
        }
        case ADD_COMMENT: {
            const newComment = action.comments;
            return {
                ...state,
                allComments: {
                    ...state.allComments,
                    [newComment.id]: newComment,
                },
            };
        }
        case EDIT_COMMENT: {
            const updatedComment = action.comment;
            return {
                ...state,
                allComments: {
                    ...state.allComments,
                    [updatedComment.id]: {
                        ...state.allComments[updatedComment.id],
                        ...updatedComment,
                    },
                },
            };
        }
        case DELETE_COMMENT: {
            const { [action.comment_id]: _, ...remainingComments } = state.allComments;
            return {
                ...state,
                allComments: remainingComments,
            };
        }
        default:
            return state;
    }
}

// ------------------------- Default Export -------------------------
export default commentReducer;
