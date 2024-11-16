import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const USER_PROFILE = 'session/setUserProfile';
const REMOVE_PROFILE = 'session/removeProfile'
const UPDATE_PROFILE = 'session/updateUserProfile';


const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const userById = (profile) => ({
  type: USER_PROFILE,
  payload: profile
});

// remove account from db
const removeUserFromDb = (user_id) => ({
  type: REMOVE_PROFILE,
  user_id
})

const updateUserProfile = (profile) => ({
  type: UPDATE_PROFILE,
  payload: profile,
});

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkGetUserProfile = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/profile/${id}`);

  if (response.ok) {
      const data = await response.json();
      dispatch(userById(data));
      return data;
  } else {
      return { error: "Failed to load user profile" };
  }
};

// update user info
export const thunkUpdateUserProfile = (updatedData, id) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    const updatedProfile = await response.json();
    dispatch(updateUserProfile(updatedProfile));
    return updatedProfile;
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: 'Something went wrong. Please try again' };
  }
};


// remove user from db
export const thunkDeleteAccount = (user_id, password) => async (dispatch) => {
  const response = await fetch(`/api/users/${user_id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (response.ok) {
    dispatch(removeUser())
    dispatch(removeUserFromDb(user_id));
  } else if (!response.ok) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: 'Something went wrong. Please try again' };
  }
};


const initialState = { user: null, userProfile: null };

function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        case USER_PROFILE:
            return { ...state, userProfile: action.payload };
        case REMOVE_PROFILE:
            return { ...state, userProfile: null, user: null };
        case UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload }, // Update logged-in user data
                userProfile: { ...state.userProfile, ...action.payload }, // Update profile data
            };
        default:
          return state;
    }
}


export default sessionReducer;
