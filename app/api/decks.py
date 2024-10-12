from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, CardImage, Comment
from flask_login import current_user, login_required
from app.forms import DeckForm, CommentForm

decks_routes = Blueprint('decks', __name__)

@decks_routes.route('/')
def allDecks():
    """
    GET ALL DECKS with optional search queries
    """
    # Get search parameters from query string
    deck_name = request.args.get('deck_name', None)
    owner_name = request.args.get('owner_name', None)
    card_name = request.args.get('card_name', None)

    # Start with querying all decks
    query = db.session.query(Deck)

    # Filter decks by deck name if provided
    if deck_name:
        query = query.filter(Deck.name.ilike(f'%{deck_name}%'))

    decks = query.all()
    decks_list = []

    for deck in decks:
        solo_deck = deck.to_dict()

        # Query the cards associated with the deck
        decks_table = db.session.query(DeckCard).filter(DeckCard.deck_id == deck.id).all()

        # Query the deck owner
        user = db.session.query(User).filter(User.id == deck.user_id).first().to_dict()

        # If owner_name is provided, filter by owner
        if owner_name and owner_name.lower() not in user['username'].lower():
            continue  # Skip this deck if owner doesn't match the search

        cards = []
        for deck_card_association in decks_table:
            card = db.session.query(Card).join(CardImage, Card.id == CardImage.card_id)\
                        .filter(Card.id == deck_card_association.card_id).first()

            if card:

                # If card_name is provided, filter by card name
                if card_name and card_name.lower() not in card.name.lower():
                    continue  # Skip if the card doesn't match the search

                card_dict = card.to_dict()

                # Get all images for the card
                card_images = db.session.query(CardImage).filter(CardImage.card_id == card.id).all()
                card_dict['images'] = [image.to_dict() for image in card_images]

                cards.append(card_dict)

        solo_deck['deck_owner'] = user
        solo_deck['cards'] = cards

        decks_list.append(solo_deck)

    return jsonify(decks_list)


@decks_routes.route('/current')
def userDecks():
    """
    GET ALL DECKS for the current user that he has made
    """
    logged_in_user = current_user.to_dict()

    decks = db.session.query(Deck).filter(logged_in_user['id'] == Deck.user_id).all()
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
    """
        GET DECK DETAILS
    """
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


@decks_routes.route('/', methods=['POST'])
@login_required
def createDeck():
    """"
        CREATE A DECK WITH LOGIN REQUIRED
    """
    currentUser = current_user.to_dict()

    form = DeckForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        deck = Deck(
            user_id = currentUser['id'],
            name = form.data['name'],
            description = form.data['description']
        )

        db.session.add(deck)
        db.session.commit()
        new_deck = deck.to_dict()
        return jsonify(new_deck)
    return form.errors, 400


@decks_routes.route('/<int:deck_id>', methods=['PUT'])
@login_required
def editDeck(deck_id):
    """"
        Edit a deck
    """
    currentUser = current_user.to_dict()

    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'errors': 'Deck does not exist'}, 404

    if deck_by_id.user_id != currentUser['id']:
        return {'errors': 'Unauthorized to edit this deck'}, 403

    form = DeckForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if form.data.get('name'):
            deck_by_id.name = form.data['name']
        if form.data.get('description'):
            deck_by_id.description = form.data['description']

        db.session.commit()

        updated_deck = deck_by_id.to_dict()

        return jsonify(updated_deck)
    return form.errors

@decks_routes.route('/<int:deck_id>', methods=['DELETE'])
@login_required
def removeDeck(deck_id):
    currentUser = current_user.to_dict()

    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    if currentUser['id'] != deck_by_id.user_id:
        return {'error': 'Unauthorized to complete this action'}, 403
    else:
        db.session.delete(deck_by_id)
        db.session.commit()
        return {'message': 'Deck was removed successfully'}, 200



# comment section

@decks_routes.route('/<int:deck_id>/comments')
def allComments(deck_id):
    """
        Get all comments for speciifc deck
    """
    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()


    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    comments = db.session.query(Comment).all()

    comments_list = []

    for comment in comments:
        comment_dict = comment.to_dict()

        user_comment = db.session.query(User).filter(comment.owner_id == User.id).first()

        user_info = {
            'username': user_comment.username,
            'image_url': user_comment.image_url
        }
        comment_dict['comment_owner'] = user_info

        comments_list.append(comment_dict)

    return jsonify(comments_list)

@decks_routes.route('/<int:deck_id>/comments', methods=['POST'])
@login_required
def createComment(deck_id):

    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    logged_in_user = current_user.to_dict()

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment = Comment(
            deck_id=deck_id,
            owner_id=logged_in_user['id'],
            comment=form.data['comment']
        )
        db.session.add(comment)
        db.session.commit()

        new_comment = comment.to_dict()

        return jsonify(new_comment)
    return form.errors, 400

@decks_routes.route('/<int:deck_id>/comments/<int:comment_id>', methods=['PUT'])
@login_required
def editComment(deck_id, comment_id):

    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    comment_by_id = db.session.query(Comment).filter(Comment.id == comment_id).first()

    if not comment_by_id:
        return {'error': 'Comment does not exist'}, 404

    logged_in_user = current_user.to_dict()

    if comment_by_id.owner_id != logged_in_user['id']:
        return {'errors': 'Unauthorized to edit this deck'}, 403

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if form.data.get('comment'):
            comment_by_id.comment = form.data['comment']

        db.session.commit()

        updated_comment = comment_by_id.to_dict()

        return jsonify(updated_comment)
    return form.errors


@decks_routes.route('/<int:deck_id>/comments/<int:comment_id>', methods=['DELETE'])
@login_required
def removeComment(deck_id, comment_id):

    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    comment_by_id = db.session.query(Comment).filter(Comment.id == comment_id).first()

    if not comment_by_id:
        return {'error': 'Comment does not exist'}, 404

    logged_in_user = current_user.to_dict()

    if comment_by_id.owner_id != logged_in_user['id']:
        return {'errors': 'Unauthorized to edit this deck'}, 403
    else:
        db.session.delete(comment_by_id)
        db.session.commit()

        return {'message': "Comment deleted successfully."}
