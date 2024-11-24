from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('decks.id'), ondelete='CASCADE'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    comment = db.Column(db.String(255), nullable=False)
    like = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user = db.relationship('User', back_populates='comments')
    decks = db.relationship('Deck', back_populates='comments')
    upvotes = db.relationship('Upvote', back_populates='comment', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'deck_id': self.deck_id,
            'like': self.like,
            'owner_id': self.owner_id,
            'comment': self.comment,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
