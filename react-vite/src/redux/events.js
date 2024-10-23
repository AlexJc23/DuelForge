
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
const addEvent = (payload) => ({
    type:ADD_EVENT,
    payload
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
export const getEvents = (searchParams = {}) => async (dispatch) => {
    // Destructure the search params
    const { event_name, owner_name, location} = searchParams;

    const query = new URLSearchParams();

    if(event_name) query.append('event_name', event_name);
    if(owner_name) query.append('owner_name', owner_name);
    if(location) query.append('location', location)

    const res = await csrfFetch(`/api/events?${query.toString()}`)
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

    let res, data;

    let newEvent = {
        owner_id: event.owner_id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        price: event.price
    };

    try {
        // Create the event
        res = await csrfFetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (!res.ok) {
            const errorData = await res.json();

            throw new Error("Failed to create event");
        }

        // Parse response
        data = await res.json();
        if (!data || !data.id) {
            console.error("Error: 'data' is undefined or missing 'id'. Response:", data);
            return { error: "Event creation failed." };
        }

    } catch (error) {

        return { error: error.message };
    }



    // If event was created, attempt to add the image
    let image = {
        event_id: data.id,
        image_url: event.imageUrl
    };


    try {
        console.log('hhhhhh ', data.id)
        const imageRes = await csrfFetch(`/api/events/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(image)
        });
        console.log(imageRes)
        if (!imageRes.ok) {
            const errorData = await imageRes.json();
            throw new Error("Failed to add image");
        }
    } catch (error) {
        return { error: error.message };
    }

    // Dispatch the new event to the store
    dispatch(addEvent(data));

    return data;
};


// Edit a event by id
export const editAEvent = (event, event_id) => async (dispatch) => {
    let res;
    console.log(event_id)
    console.log(event)
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
    const res = await csrfFetch(`/api/events/${event_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeEvent(event_id))


        await dispatch(loadEvent())
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
                    [newEvent.id]: newEvent
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
