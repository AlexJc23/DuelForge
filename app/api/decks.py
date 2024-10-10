from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, CardImage
from flask_login import current_user, login_required
# create "create product form" and import it
# from app.forms import

decks_routes = Blueprint('decks', __name__)

@decks_routes.route('/')
def allDecks():
    """
    GET ALL DECKS
    """
    decks = db.session.query(Deck).all()
    decks_list = []

    for deck in decks:
        solo_deck = deck.to_dict()


        decks_table = db.session.query(DeckCard).filter(DeckCard.deck_id == deck.id).all()


        user = db.session.query(User).filter(User.id == deck.user_id).first().to_dict()

        cards = []
        for deck_card_association in decks_table:

            card = db.session.query(Card).join(CardImage, Card.id == CardImage.card_id)\
                        .filter(Card.id == deck_card_association.card_id).first()

            if card:

                card_dict = card.to_dict()


                card_images = db.session.query(CardImage).filter(CardImage.card_id == card.id).all()
                card_dict['images'] = [image.to_dict() for image in card_images]


                cards.append(card_dict)


        solo_deck['deck_owner'] = user
        solo_deck['cards'] = cards

        decks_list.append(solo_deck)

    return jsonify(decks_list)
