from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class EventImage(db.Model):
    __tablename__ = 'event_images'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('events.id'), ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(400), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    events = db.relationship('Event', back_populates='event_images')

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
