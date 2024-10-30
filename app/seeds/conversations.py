from app.models import db, Conversation, ConversationParticipant, Message, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime




def seed_conversations():
    # Create individual conversation instances
    conversation1 = Conversation()
    conversation2 = Conversation()
    conversation3 = Conversation()

    # Add conversations to the session
    db.session.add(conversation1)
    db.session.add(conversation2)
    db.session.add(conversation3)

    # Commit to save the conversations to the database
    db.session.commit()




def undo_conversations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.conversations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM conversations"))

    db.session.commit()
