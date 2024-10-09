from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Event(db.Model):
    __tablename__ = 'events'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)  # Updated
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)  # Updated

    owner = db.relationship('User', back_populates='events')
    event_image = db.relationship('EventImage', back_populates='events', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'location': self.location,
            'price': self.price,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
