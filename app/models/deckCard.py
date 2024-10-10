from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class DeckCard(db.Model):
    __tablename__ = 'deck_cards'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('cards.id'), ondelete='CASCADE'), nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('decks.id'), ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)

    cards = db.relationship('Card', back_populates='deck_cards')
    decks = db.relationship('Deck', back_populates='deck_cards')

    def to_dict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'deck_id': self.deck_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
