from flask import Blueprint, jsonify, redirect, request
from app import db
from app.models import Deck, Card, DeckCard, User, CardImage, Comment, Upvote
from flask_login import current_user, login_required
from app.forms import DeckForm, CommentForm

decks_routes = Blueprint('decks', __name__)

@decks_routes.route('/')
def allDecks():
    """
    GET ALL DECKS with optional search queries
    """

    deck_name = request.args.get('deck_name', None)
    owner_name = request.args.get('owner_name', None)
    card_name = request.args.get('card_name', None)


    query = db.session.query(Deck)


    if deck_name:
        query = query.filter(Deck.name.ilike(f'%{deck_name}%'))

    decks = query.all()
    decks_list = []

    for deck in decks:
        solo_deck = deck.to_dict()

        decks_table = db.session.query(DeckCard).filter(DeckCard.deck_id == deck.id).all()



        cards = []
        for deck_card_association in decks_table:
            card = db.session.query(Card).join(CardImage, Card.id == CardImage.card_id)\
                        .filter(Card.id == deck_card_association.card_id).first()

            if card:

                if card_name and card_name.lower() not in card.name.lower():
                    continue

                card_dict = card.to_dict()

                card_images = db.session.query(CardImage).filter(CardImage.card_id == card.id).all()
                card_dict['images'] = [image.to_dict() for image in card_images]

                cards.append(card_dict)


        solo_deck['cards'] = cards

        decks_list.append(solo_deck)


    return jsonify(decks_list)


@decks_routes.route('/current')
@login_required
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
    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404

    currentUser = current_user.to_dict()

    if currentUser['id'] != deck_by_id.user_id:
        return {'error': 'Unauthorized to complete this action'}, 403

    db.session.delete(deck_by_id)
    db.session.commit()
    return {'message': 'Deck was removed successfully'}, 200

# comment section

@decks_routes.route('/<int:deck_id>/comments')
def allComments(deck_id):
    """
        Get all comments for a specific deck, ordered by newest first
    """
    deck_by_id = db.session.query(Deck).filter(Deck.id == deck_id).first()

    if not deck_by_id:
        return {'error': 'Deck does not exist'}, 404


    comments = db.session.query(Comment).filter(Comment.deck_id == deck_id).order_by(Comment.created_at.desc()).all()
    print('heyyyy ', comments)
    comments_list = []

    for comment in comments:
        comment_dict = comment.to_dict()

        user_comment = db.session.query(User).filter(comment.owner_id == User.id).first()
        user_likes = db.session.query(Upvote).filter(Upvote.id == comment.id).all()

        user_info = {
            'username': user_comment.username,
            'image_url': user_comment.image_url,
            'user_id': user_comment.id
        }
        comment_dict['likes'] = len(user_likes)
        comment_dict['comment_owner'] = user_info

        comments_list.append(comment_dict)
    print('ordered? ', comments_list[0])
    return jsonify(comments_list)

@decks_routes.route('/<int:deck_id>/comments', methods=['POST'])
@login_required
def createComment(deck_id):
    """"
        Create a comment
    """

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

@decks_routes.route('/comment/<int:comment_id>', methods=['PUT'])
@login_required
def editComment(comment_id):
    """
        Edit a comment
    """
    try:
        comment_by_id = db.session.query(Comment).filter(Comment.id == comment_id).first()

        if not comment_by_id:
            return {'error': 'Comment does not exist'}, 404

        logged_in_user = current_user.to_dict()

        if comment_by_id.owner_id != logged_in_user['id']:
            return {'errors': 'Unauthorized to edit this comment'}, 403

        data = request.get_json()

        if 'comment' in data:
            comment_by_id.comment = data['comment']
            db.session.commit()

        return jsonify(comment_by_id.to_dict()), 200

    except Exception as e:
        print(f"Error editing comment: {e}")
        return {'error': 'Internal server error'}, 500


@decks_routes.route('/comments/<int:comment_id>', methods=['DELETE'])
@login_required
def removeComment(comment_id):
    """
    Remove a comment
    """
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

@decks_routes.route('/user/<int:user_id>')
def decksWithUserId(user_id):
    """
    GET ALL DECKS for the user_id that they have created.
    """
    # Retrieve the user and check if they exist
    user = db.session.query(User).filter(User.id == user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_dict = user.to_dict()
    # Query all decks created by this user
    decks = db.session.query(Deck).filter(Deck.user_id == user_id).all()

    decks_list = []

    for deck in decks:
        # Convert each deck to a dictionary and prepare cards list
        solo_deck = deck.to_dict()

        # Query deck-card associations for the current deck
        deck_cards = db.session.query(DeckCard).filter(DeckCard.deck_id == deck.id).all()

        cards = []
        for deck_card in deck_cards:
            # Retrieve the card and its images in one go
            card = db.session.query(Card).join(CardImage, Card.id == CardImage.card_id)\
                         .filter(Card.id == deck_card.card_id).first()
            if card:
                card_dict = card.to_dict()
                card_images = db.session.query(CardImage).filter(CardImage.card_id == card.id).all()
                # Add images to the card dictionary
                card_dict['images'] = [image.to_dict() for image in card_images]
                cards.append(card_dict)

        # Add user, cards, and deck information to the deck dictionary
        solo_deck['deck_owner'] = user_dict
        solo_deck['cards'] = cards
        decks_list.append(solo_deck)

    return jsonify(decks_list)
