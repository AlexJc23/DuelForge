
import { csrfFetch } from "./csrf";

const ALL_EVENTS = 'session/allEvents';
const ONE_EVENT = 'session/oneEvents';
const CURRENTUSER_EVENTS = 'session/currentuserEvents';
const ADD_EVENT = 'session/addEvent';
const EDIT_EVENT = 'session/editEvent';
const DELETE_EVENT = 'session/deleteEvent'



// load all events
const loadEvent = (events) => ({
    type: ALL_EVENTS,
    events
})

// load one event by id
const loadOneEvent =(event) => ({
    type: ONE_EVENT,
    event
})

// current logged in user events
const loadUserEvents = (events) => ({
    type: CURRENTUSER_EVENTS,
    events
})


// add a event
const addEvent = (event) => ({
    type:ADD_EVENT,
    event
})

// Edit a event
const updateEvent = (event) => {
    type: EDIT_EVENT,
    event
}

// remove a event
const removeEvent = (event_id) => ({
    type: DELETE_EVENT,
    event_id
})

// get all events
export const getEvents = () => async (dispatch) => {
    const res = await csrfFetch('/api/events');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadEvent(data));
        return data
    };
    return res;
};


// get one event details
export const getOneEvent = (event_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${event_id}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadOneEvent(data))
        return data
    }
    return res
}


// get current loggedin user events
export const loggedInUserEvent = () =>  async (dispatch) => {
    const res = await csrfFetch('/api/events/current');

    if (res.ok) {
        const data = await res.json()

        dispatch(loadUserEvents(data));
        return data
    }
    return res
}

// add event
export const createEvent = (event) => async (dispatch) => {
    let res;
    let newEvent = {
        owner_id: event.owner_id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        price: event.price
    }

    try {
        res = await csrfFetch('/api/events/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newEvent)
        });
    } catch (error) {
        return error.json();
    }

    const data = await res.json();

    dispatch(addEvent(data));
    return res;
}

// Edit a event by id
export const EditAEvent = (event, event_id) => async (dispatch) => {
    let res;

    let updatedEvent = {
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        price: event.price
    };

    try {
        res = await csrfFetch(`/api/events/${event_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent)
        });
    } catch (error) {
        return await error.json()
    }

    if (res.ok) {
        const editAEvent = await res.json();
        dispatch(updateEvent(editAEvent))
        return editAEvent;
    }
    return res
}


export const deleteEvent = (event_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/events${event_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeEvent(event_id))


        await dispatch(loadUserEvents())
        return res
    }
}


const initialState = {allEvents: {}, eventDetail: {}, userEvents: {}}

function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case ALL_EVENTS: {
            const allEvents = {};
            action.events.forEach((event) => {
                allEvents[event.id] = event
            });
            return {
                ...state,
                allEvents,
            };
        }
        case ONE_EVENT: {
            const eventDetail = action
            return {
                ...state,
                eventDetail
            }
        }
        case CURRENTUSER_EVENTS: {
            const userEvents = {};
            action.events.forEach((event) => {
                userEvents[event.id] = event
            });
            return {
                ...state,
                userEvents
            }
        }
        case ADD_EVENT:
            const newEvent = action.payload;
            return {
                ...state,
                allEvents: {
                    ...state.allEvents,
                    [newevent.id]: newEvent
                }
            }
        case DELETE_EVENT: {
            const new_state = structuredClone(state)
            delete new_state.allEvents[action.event_id]
            return new_state
        }

        default:
            return state
    }
}

export default eventsReducer;
