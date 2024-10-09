from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Card(db.Model):
    __tablename__ = 'cards'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('decks.id'), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100))
    type = db.Column(db.String(50))
    description = db.Column(db.String(500))
    attack = db.Column(db.Integer, nullable=False, default=0)
    defense = db.Column(db.Integer, nullable=False, default=0)
    level = db.Column(db.Integer, nullable=False, default=0)
    race = db.Column(db.String(50),)
    attribute = db.Column(db.String(50))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(), nullable=False)


    deck = db.relationship('Deck', back_populates='cards')
    card_image = db.relationship('CardImage', back_populates='cards', cascade="all, delete-orphan")

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
