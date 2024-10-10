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
