from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, Event, EventImage, CardImage
from flask_login import current_user, login_required


event_routes = Blueprint('events', __name__)


@event_routes.route('/')
def allEvents():
    """
        GET ALL EVENTS
    """
    events = db.session.query(Event).all()

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
