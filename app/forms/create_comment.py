from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from better_profanity import profanity

def checkProfanity(form, field):
    # Check for profanity in the input
    comment = field.data
    if profanity.contains_profanity(comment):  # Returns True if profanity is detected
        raise ValidationError('Your input contains profanity. Please remove it.')

class CommentForm(FlaskForm):
    comment = StringField('Comment', validators=[DataRequired(), checkProfanity])
