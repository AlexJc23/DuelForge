
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
const updateEvent = (event) => ({
    type: EDIT_EVENT,
    event
})

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

        res = await csrfFetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (!res.ok) {
            const errorData = await res.json();

            throw new Error("Failed to create event");
        }


        data = await res.json();

    } catch (error) {
        return { error: error.message };
    }




    let image = {
        event_id: data.id,
        image_url: event.imageUrl
    };


    try {

        const imageRes = await csrfFetch(`/api/events/${data.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(image)
        });

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
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('/');
        return `${month}/${day}/${year}`;
    };
    let res;
    const updatedEvent = {

        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        price: event.price
    };

    console.log('yeelllll ',updatedEvent)
    try {
        res = await csrfFetch(`/api/events/${event_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent)
        });

        if (!res.ok) throw res;


        const updatedEventData = await res.json();
        dispatch(updateEvent(updatedEventData));

        let image = {
            image_url: event.imageUrl,
            event_id: event_id
        }

        if (event.imageUrl) {
            const imageUpdateResponse = await csrfFetch(`/api/events/${event_id}/images`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(image)
            });

            if (!imageUpdateResponse.ok) {
                const imageErrorData = await imageUpdateResponse.json();
                return { error: imageErrorData.errors || "Failed to update image." };
            }
        }

        return updatedEventData;

    } catch (error) {
        try {
            const errorData = await error.json();
            console.error("Error updating event:", errorData);
            return { error: errorData.errors || "Failed to update event." };
        } catch (jsonError) {
            // If the error response is not JSON, log the full response
            console.error("Non-JSON error response:", error);
            return { error: "Unexpected error. Please try again later." };
        }
    }
}



export const deleteEvent = (event_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${event_id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeEvent(event_id))

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
            case EDIT_EVENT: {
                const updatedEvent = action.event;
                return {
                    ...state,
                    allEvents: {
                        ...state.allEvents,
                        [updatedEvent.id]: updatedEvent
                    },
                    currEvent: {
                        ...state.currEvent,
                        ...updatedEvent
                    },
                };
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
