from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class CardImage(db.Model):
    __tablename__ = 'card_images'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('cards.id'), ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)

    cards = db.relationship('Card', back_populates='card_images')

    def to_dict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
