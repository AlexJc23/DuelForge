from app.models import db, DeckCard, environment, SCHEMA
from sqlalchemy.sql import text

def seed_cardDeck():

    cards = {
        'deckCard1': {'deck_id': 1, 'card_id': 31975743}
    }

    for card in cards.values():
        newCard = DeckCard(
            card_id=card['card_id'],
            deck_id=card['deck_id'],
        )
        db.session.add(newCard)

    db.session.commit()



def undo_cardDeck():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.deck_cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM deck_cards"))

    db.session.commit()
