import requests
from app.models import db, Card, CardImage, environment, SCHEMA
from sqlalchemy.sql import text

def fetch_card_data():
    response = requests.get("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    if response.status_code == 200:
        return response.json()["data"]
    else:
        print("Failed to fetch data from API")
        return []

def seed_cards():
    cards_data = fetch_card_data()

    for index, card_data in enumerate(cards_data):
        if index >= 500:  # Stop after 500 iterations
            break
        card = Card(
            id=card_data["id"],
            deck_id=0,
            name=card_data["name"],
            type=card_data["type"],
            description=card_data["desc"],
            attack=card_data.get("atk", 0),  # Default to zero if 'atk' doesn't exist
            defense=card_data.get("def", 0),
            level=card_data.get("level", 0),
            race=card_data.get("race", ""),
            attribute=card_data.get("attribute", ""),
        )
        db.session.add(card)

    db.session.commit()


def seed_card_images():
    cards_data = fetch_card_data()

    for index, card_data in enumerate(cards_data):
        if index >= 500:  # Stop after 500 iterations
            break
        for img_data in card_data.get("card_images", []):
            card_image = CardImage(
                card_id=card_data["id"],
                image_url=img_data["image_url"],
            )
            db.session.add(card_image)

    db.session.commit()


def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))

    db.session.commit()

def undo_card_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.card_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM card_images"))

    db.session.commit()
