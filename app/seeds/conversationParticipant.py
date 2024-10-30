from app.models import db, Conversation, ConversationParticipant, Message, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_conversation_participants():
    # Add participants to conversation 1
    participant1 = ConversationParticipant(conversation_id=1, user_id=1)
    participant2 = ConversationParticipant(conversation_id=1, user_id=2)

    # Add participants to conversation 2
    participant3 = ConversationParticipant(conversation_id=2, user_id=3)
    participant4 = ConversationParticipant(conversation_id=2, user_id=4)

    # Add participants to conversation 3
    participant5 = ConversationParticipant(conversation_id=3, user_id=5)
    participant6 = ConversationParticipant(conversation_id=3, user_id=6)

    # Add participants to the session
    db.session.add_all([participant1, participant2, participant3, participant4, participant5, participant6])

    # Commit to save the participants to the database
    db.session.commit()



def undo_conversation_participants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.conversation_participants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM conversation_participants"))

    db.session.commit()
