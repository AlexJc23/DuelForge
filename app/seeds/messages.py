from app.models import db, Conversation, ConversationParticipant, Message, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_messages():
    # Messages for conversation 1
    message1 = Message(conversation_id=1, sender_id=1, content="Anyone ready to duel? Got some new moves.", created_at=datetime.now())
    message2 = Message(conversation_id=1, sender_id=2, content="Bring it on! My Dragon deck is unbeatable.", created_at=datetime.now())
    message3 = Message(conversation_id=1, sender_id=1, content="Guess we'll find out! Let’s set a time.", created_at=datetime.now())

    # Messages for conversation 2
    message4 = Message(conversation_id=2, sender_id=3, content="Is Blue-Eyes still a solid choice?", created_at=datetime.now())
    message5 = Message(conversation_id=2, sender_id=4, content="It has power, but new meta makes it risky.", created_at=datetime.now())
    message6 = Message(conversation_id=2, sender_id=3, content="Might give it a try regardless. Nostalgia!", created_at=datetime.now())

    # Messages for conversation 3
    message7 = Message(conversation_id=3, sender_id=5, content="Any advice on building a solid Spellcaster deck?", created_at=datetime.now())
    message8 = Message(conversation_id=3, sender_id=6, content="Definitely, focus on synergy between spells.", created_at=datetime.now())
    message9 = Message(conversation_id=3, sender_id=5, content="Appreciate it! Let’s duel soon so I can test it.", created_at=datetime.now())

    # Add all messages to the session
    db.session.add_all([message1, message2, message3, message4, message5, message6, message7, message8, message9])

    # Commit to save the messages to the database
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
