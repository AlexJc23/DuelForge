from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comment():

    comments = {
    'comment1': { 'deck_id': 1, 'owner_id': 1, 'comment': 'Amazing deck!' },
    'comment2': { 'deck_id': 1, 'owner_id': 2, 'comment': 'Great strategy!' },
    'comment3': { 'deck_id': 1, 'owner_id': 3, 'comment': 'Very well balanced.' },
    'comment4': { 'deck_id': 2, 'owner_id': 4, 'comment': 'I love this deck!' },
    'comment5': { 'deck_id': 2, 'owner_id': 5, 'comment': 'Could use more spell cards.' },
    'comment6': { 'deck_id': 2, 'owner_id': 6, 'comment': 'Awesome combos!' },
    'comment7': { 'deck_id': 3, 'owner_id': 7, 'comment': 'A bit slow, but fun.' },
    'comment8': { 'deck_id': 3, 'owner_id': 8, 'comment': 'Nice synergy with the monsters.' },
    'comment9': { 'deck_id': 3, 'owner_id': 9, 'comment': 'Needs more defense cards.' },
    'comment10': { 'deck_id': 4, 'owner_id': 10, 'comment': 'Perfect for casual games.' },
    'comment11': { 'deck_id': 4, 'owner_id': 11, 'comment': 'Great for quick wins.' },
    'comment12': { 'deck_id': 4, 'owner_id': 12, 'comment': 'Lacks some powerful cards.' },
    'comment13': { 'deck_id': 5, 'owner_id': 13, 'comment': 'I love the variety of cards.' },
    'comment14': { 'deck_id': 5, 'owner_id': 14, 'comment': 'Very creative deck!' },
    'comment15': { 'deck_id': 5, 'owner_id': 15, 'comment': 'Could use better synergy.' }
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
