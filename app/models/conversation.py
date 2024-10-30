from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin

class Conversation(db.Model, UserMixin):
    __tablename__ = 'conversations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)

    participants = db.relationship('User', secondary='conversation_participants', back_populates='conversations')
    messages = db.relationship('Message', back_populates='conversation')

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
