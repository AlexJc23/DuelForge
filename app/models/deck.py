from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Deck(db.Model):
    __tablename__ = 'decks'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(400), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    users = db.relationship('User', back_populates='decks')
    comments = db.relationship('Comment', back_populates='decks', cascade="all, delete-orphan")
    cards = db.relationship('Card', back_populates='decks')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
