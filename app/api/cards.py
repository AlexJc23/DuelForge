from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, CardImage, Comment
from flask_login import current_user, login_required
from app.forms import DeckForm, CommentForm

cards_routes = Blueprint('cards', __name__)

@cards_routes.route('/')
def allCards():
    """
        GET ALL CARDS
    """
    cards = db.session.query(Card).all()
    cards_list = []

    for card in cards:
        card_dict = card.to_dict()

        card_image = db.session.query(CardImage).filter(CardImage.card_id == card.id).first().to_dict()

        card_dict['image'] = card_image

        cards_list.append(card_dict)
    return jsonify(cards_list)


@cards_routes.route('add/<int:card_id>/<int:deck_id>', methods=['POST'])
def addCardToDeck(card_id, deck_id):
    """
        Add card to deck
    """

    new_deck_card = DeckCard(deck_id=deck_id, card_id=card_id)

    db.session.add(new_deck_card)
    db.session.commit()

    return jsonify({'message': 'Card added to deck successfully!'}), 201

@cards_routes.route('/<int:card_id>/<int:deck_id>', methods=['DELETE'])
def deleteCardFromDeck(card_id, deck_id):
    """
        REMOVE A CARD FROM A DECK
    """
    deck_card = DeckCard.query.filter_by(card_id=card_id, deck_id=deck_id).first()
    if not deck_card:
        return jsonify({'error': 'Card not found in the deck.'}), 404

    db.session.delete(deck_card)
    db.session.commit()

    return jsonify({'message': 'Card removed from deck successfully!'}), 200
