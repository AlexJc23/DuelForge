from app.models import db, EventImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_eventImage():

    eventimage_1 = EventImage(event_id=1, image_url='http://example.jpg')

    db.session.add(eventimage_1)
    db.session.commit()

def undo_eventImages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.event_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM event_images"))

    db.session.commit()
