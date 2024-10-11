from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
import re


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def CheckUrlImage(form, field):
    image_url = field.data
    # Regular expression to check for valid image extensions
    valid_extensions = ('.jpg', '.jpeg', '.png')
    if not any(image_url.endswith(ext) for ext in valid_extensions):
        raise ValidationError('Image URL must be in .jpg, .jpeg, or .png format.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    first_name = StringField('first_name', validators=[DataRequired()])
    last_name = StringField('last_name', validators=[DataRequired()])
    image_url = StringField('image_url', validators=[CheckUrlImage])
    password = StringField('password', validators=[DataRequired()])
