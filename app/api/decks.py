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


@decks_routes.route('/<int:deck_id>')
def deckDetails(deck_id):
    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck doesnt exist'}, 404

    deck_dict = deck_by_id.to_dict()

    # owner info
    owner_info = db.session.query(User).filter(deck_by_id.user_id == User.id).first()

    owner_dict = {
        'id': owner_info.id,
        'username': owner_info.username
    }

    # cards in deck
    cards = []
    deck_card_table = db.session.query(DeckCard).filter(deck_by_id.id == DeckCard.deck_id).all()

    for cardInfo in deck_card_table:
        cardInfo.to_dict()

        card = db.session.query(Card).filter(Card.id == cardInfo.card_id).first()
        solo_card = card.to_dict()

        cardImage = db.session.query(CardImage).filter(CardImage.card_id == card.id).first().to_dict()

        solo_card['image'] = cardImage

        cards.append(solo_card)

    deck_dict['deck_owner'] = owner_dict
    deck_dict['cards'] = cards

    return jsonify(deck_dict)
