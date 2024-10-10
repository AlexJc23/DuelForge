from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comment():

    comments = {
        'comment1': {'deck_id': 1, 'owner_id': 1, 'comment': 'Amazing deck!'}
    }

    for userComment in comments.values():
        new_comment = Comment(
            owner_id=userComment['owner_id'],
            comment=userComment['comment'],
            deck_id=userComment['deck_id'],
        )
        db.session.add(new_comment)

    db.session.commit()



def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
