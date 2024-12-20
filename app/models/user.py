from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    bio = db.Column(db.String(1000), nullable=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now, nullable=False)

    comments = db.relationship('Comment', back_populates='user', cascade="all, delete-orphan")
    events = db.relationship('Event', back_populates='user', cascade="all, delete-orphan")
    decks = db.relationship('Deck', back_populates='user', cascade="all, delete-orphan")
    upvotes = db.relationship('Upvote', back_populates='user', cascade='all, delete-orphan')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'bio': self.bio,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
