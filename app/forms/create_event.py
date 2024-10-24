from flask_wtf import FlaskForm
from wtforms import StringField, DateField, FloatField
from wtforms.validators import DataRequired, ValidationError
# from datetime import datetime




# def checkStartDate(form, field):
#     start_date_str = field.data
#     if isinstance(start_date_str, datetime.date):
#         start_date = start_date_str
#     else:
#         try:
#             start_date = datetime.strptime(start_date_str, '%d/%m/%Y').date()
#         except ValueError:
#             raise ValidationError('Start date must be in the format dd/mm/yyyy.')

#     if start_date <= datetime.now().date():
#         raise ValidationError('Start date must be in the future.')

# def checkEndDate(form, field):
#     end_date_str = field.data
#     if isinstance(end_date_str, datetime.date):
#         end_date = end_date_str
#     else:
#         try:
#             end_date = datetime.strptime(end_date_str, '%d/%m/%Y').date()
#         except ValueError:
#             raise ValidationError('End date must be in the format dd/mm/yyyy.')

#     start_date_str = form.start_date.data
#     if not start_date_str:
#         raise ValidationError('Start date is required.')

#     if isinstance(start_date_str, datetime.date):
#         start_date = start_date_str
#     else:
#         try:
#             start_date = datetime.strptime(start_date_str, '%d/%m/%Y').date()
#         except ValueError:
#             raise ValidationError('Start date must be in the format dd/mm/yyyy.')

#     if end_date <= start_date:
#         raise ValidationError('End date must be after the start date.')

# Check if the price is valid
def checkPrice(form, field):
    price = field.data
    if not isinstance(price, (int, float)):
        raise ValidationError('Price must be a valid positive number.')

class EventForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired()])
    start_date = StringField('start_date', validators=[DataRequired()])
    end_date = StringField('end_date', validators=[DataRequired()])
    location = StringField('location', validators=[DataRequired()])
    price = FloatField('price', validators=[DataRequired(), checkPrice])
