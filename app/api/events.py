from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, Event, EventImage, CardImage
from flask_login import current_user, login_required
from app.forms import EventForm, CreateEventImageForm

event_routes = Blueprint('events', __name__)


@event_routes.route('/')
def allEvents():
    """
    GET ALL EVENTS with optional search queries
    """
    # Get search parameters from query string
    event_name = request.args.get('event_name', None)
    owner_name = request.args.get('owner_name', None)
    location = request.args.get('location', None)

    # Start with querying all events
    query = db.session.query(Event)

    # Filter events by event name if provided
    if event_name:
        query = query.filter(Event.name.ilike(f'%{event_name}%'))

    # Filter events by location if provided
    if location:
        query = query.filter(Event.location.ilike(f'%{location}%'))
        print(f"Filtering by location: {location}")  # Debug: log location filter

    events = query.all()

    if not events:
        print("No events found with the applied filters.")  # Debug: log if no events found

    events_list = []

    for event in events:
        event_dict = event.to_dict()

        # Query the images associated with the event
        event_images = db.session.query(EventImage).filter(event.id == EventImage.event_id).all()
        image_dict = [image.to_dict() for image in event_images]
        event_dict['images'] = image_dict

        # Query the event owner
        user = db.session.query(User).filter(event.owner_id == User.id).first().to_dict()

        # If owner_name is provided, filter by owner's username
        if owner_name and owner_name.lower() not in user['username'].lower():
            continue  # Skip this event if owner doesn't match the search

        event_dict['event_owner'] = user
        events_list.append(event_dict)

    return jsonify(events_list)



@event_routes.route('/current')
def userEvents():
    """
        GET ALL EVENTS
    """
    logged_in_user = current_user.to_dict()

    events = db.session.query(Event).filter(logged_in_user['id'] == Event.owner_id).all()

    events_list = []

    for event in events:
        event_dict = event.to_dict()

        # corresponding images to event
        event_image = db.session.query(EventImage).filter(event.id == EventImage.event_id).all()
        image_dict = [image.to_dict() for image in event_image]
        event_dict['image'] = image_dict

        # owner info
        user = db.session.query(User).filter(event.owner_id == User.id).first().to_dict()
        event_dict['event_owner'] = user
        events_list.append(event_dict)

    return jsonify(events_list)

@event_routes.route('/<int:event_id>')
def eventDetails(event_id):
    event_fetch = db.session.query(Event).filter(Event.id == event_id).first()

    if not event_fetch:
        return {'error': 'Event does not exist'}, 404

    event_dict = event_fetch.to_dict()

    event_img_fetch = db.session.query(EventImage).filter(EventImage.event_id == event_id).first()

    event_img = None

    if not event_img_fetch:
        event_img = []
    else:
        event_img = event_img_fetch.to_dict()


    event_dict['image'] = event_img

    event_owner_fetch = db.session.query(User).filter(User.id == event_fetch.owner_id).first()
    event_owner_dict = {
        'id': event_owner_fetch.id,
        'username': event_owner_fetch.username
    }

    event_dict['event_owner'] = event_owner_dict

    return jsonify(event_dict)

@event_routes.route('/', methods=['POST'])
@login_required
def createEvent():
    """
        Create an event
    """
    currentUser = current_user.to_dict()

    form = EventForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        event = Event(
            owner_id=currentUser['id'],
            name=form.data['name'],
            description=form.data['description'],
            start_date=form.data['start_date'],
            end_date=form.data['end_date'],
            location=form.data['location'],
            price=form.data['price']
        )

        db.session.add(event)
        db.session.commit()
        new_event = event.to_dict()

        return jsonify(new_event)
    return form.errors, 400


@event_routes.route('/<int:event_id>', methods=['PUT'])
@login_required
def editEvent(event_id):
    """
        Edit an event
    """
    loggedin_user = current_user.to_dict()

    event_by_id = db.session.query(Event).filter(Event.id == event_id).first()

    if not event_by_id:
        return {'errors': 'Event does not exist'}, 404

    if event_by_id.owner_id != loggedin_user['id']:
        return {'errors': 'Unauthorized to edit this deck'}, 403

    form = EventForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if form.data.get('name'):
            event_by_id.name = form.data['name']
        if form.data.get('description'):
            event_by_id.description = form.data['description']
        if form.data.get('start_date'):
            event_by_id.start_date = form.data['start_date']
        if form.data.get('end_date'):
            event_by_id.end_date = form.data['end_date']
        if form.data.get('location'):
            event_by_id.location = form.data['location']
        if form.data.get('price'):
            event_by_id.price = form.data['price']

        db.session.commit()

        updated_event = event_by_id.to_dict()

        return jsonify(updated_event)
    return form.errors

@event_routes.route('/<int:event_id>', methods=['DELETE'])
@login_required
def removeEvent(event_id):

    loggedin_user = current_user.to_dict()

    event_by_id = db.session.query(Event).filter(event_id == Event.id).first()

    if not event_by_id:
        return {'error': 'Event does not exist.'}, 404


    if event_by_id.owner_id != loggedin_user['id']:
        return {'errors': 'Unauthorized to edit this deck'}, 403
    else:
        db.session.delete(event_by_id)
        db.session.commit()

        return {'message': 'Event deleted successfully.'}

@event_routes.route('/<int:event_id>/images', methods=['POST'])
@login_required
def add_image_to_event(event_id):
    logged_in_user = current_user.to_dict()

    event_by_id = db.session.query(Event).filter(Event.id == event_id).first()

    if not event_by_id:
        return {'errors': 'Event does not exist'}, 404

    if event_by_id.owner_id != logged_in_user['id']:
        return {'errors': 'Unauthorized'}, 403

    form = CreateEventImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        print("Form data:", form.data)  # Debugging log
        image_url = form.data.get('image_url')

        if not image_url:
            return {'error': 'image_url is required'}, 400

        image = EventImage(
            event_id=event_id,
            image_url=image_url
        )
        print("Adding image:", image)  # Debugging log

        db.session.add(image)
        db.session.commit()
        new_image = image.to_dict()

        return jsonify(new_image), 201
    else:
        print("Form errors:", form.errors)  # Debugging log
        return form.errors, 400
