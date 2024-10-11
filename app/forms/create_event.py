from flask_wtf import FlaskForm
from wtforms import StringField, DateField, FloatField
from wtforms.validators import DataRequired, ValidationError
from datetime import datetime


# Check if the start date is in the future and in a valid format
def checkStartDate(form, field):
    start_date = field.data

    # Ensure the date is in the correct format and in the future
    if start_date <= datetime.now().date():
        raise ValidationError('Start date must be in the future.')

# Check if the end date is after the start date
def checkEndDate(form, field):
    end_date = field.data
    start_date = form.start_date.data

    if end_date <= start_date:
        raise ValidationError('End date must be after the start date.')

# Check if the price is valid
def checkPrice(form, field):
    price = field.data
    if not isinstance(price, (int, float)):
        raise ValidationError('Price must be a valid positive number.')

class EventForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired()])
    start_date = DateField('start_date', format='%Y/%m/%d', validators=[DataRequired(), checkStartDate])
    end_date = DateField('end_date', format='%Y/%m/%d', validators=[DataRequired(), checkEndDate])
    location = StringField('location', validators=[DataRequired()])
    price = FloatField('price', validators=[DataRequired(), checkPrice])
