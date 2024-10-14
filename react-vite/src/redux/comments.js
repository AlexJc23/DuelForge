import { csrfFetch } from "./csrf";

const ALL_COMMENTS = 'session/allComments';
const ADD_COMMENT = 'session/addComment';
const EDIT_COMMENT = 'session/editComment'
const DELETE_COMMENT = 'session/deleteComment'

// Action to load comments
const loadComments = (comments) => ({
    type: ALL_COMMENTS,
    comments
});

// Action to create a comment
const addComment = (comments) => ({
    type: ADD_COMMENT,
    comments
})

const updateComment = (comment) => ({
    type: EDIT_COMMENT,
    comment
})

const deleteComment = (comment_id) => ({
    type: DELETE_COMMENT,
    comment_id
})

// Thunk to get comments for a specific deck_id
export const getComments = (deck_id) => async (dispatch) => {
    let res = await csrfFetch(`/api/decks/${deck_id}/comments`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadComments(data)); // Dispatch with data
        return data;
    }
    return res;
};


//  Thunk to add comment
export const createComment = (comment) => async (dispatch) => {
    let res;
    let newComment = {
        deck_id: comment.deck_id,
        owner_id: comment.owner_id,
        comment: comment.comment
    }

    try {
        res = await csrfFetch(`/api/decks/${comment.deck_id}/comments`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newComment)
        });
    } catch (error) {
        return error.json()
    }

    const data = await res.json()

    dispatch(addComment(data));
    return res;
}

export const editComment = (comment, comment_id) => async (dispatch) => {
    let res;

    let updatedComment = {
        comment: comment.comment
    };

    try {
        res = await csrfFetch(`/api/decks/${comment.deck_id}/comments/${comment_id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedComment)
        });
    } catch (error) {
        return await error.json()
    }

    if (res.ok) {
        const editAComment = await res.json()
        dispatch(updateComment(editAComment))
        return editAComment
    }
    return res
}

export const removeComment = (comment_id, deck_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/decks/${deck_id}/comments/${comment_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteComment(comment_id))

        await dispatch(loadComments(deck_id))
        return res
    }
}

const initialState = { allComments: {} };

// Reducer for comments
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
        case ADD_COMMENT:
        const newComment = action.payload;
        return {
            ...state,
            allComments: {
                ...state.allComments,
                [newComment.id]: newComment
            }
        }
        case EDIT_COMMENT:
            const updatedComment = action.payload;
            return {
                ...state,
                allComments: {
                    ...state.allComments,
                    [updatedComment.id]:updatedComment
                }
            }
            case DELETE_COMMENT: {
                const new_state = structuredClone(state)
                delete new_state.allComments[action.comment_id]
                return new_state
            }
        default:
            return state;
    }
}

export default commentReducer;
