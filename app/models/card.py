from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Card(db.Model):
    __tablename__ = 'cards'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('decks.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    attack = db.Column(db.Integer, nullable=False)
    defense = db.Column(db.Integer, nullable=False)
    level = db.Column(db.Integer, nullable=False)
    race = db.Column(db.String(20), nullable=False)
    attribute = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(), nullable=False)


    deck = db.relationship('Deck', back_populates='cards')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'attack': self.attack,
            'defense': self.defense,
            'level': self.level,
            'race': self.race,
            'attribute': self.attribute,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
