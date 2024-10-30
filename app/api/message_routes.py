from flask import Blueprint, jsonify, request
from app import db
from app.models import Message, Conversation, ConversationParticipant
from flask_login import current_user, login_required

chat_route = Blueprint('chat', __name__)

# Create a new conversation
@chat_route.route('/conversations', methods=['POST'])
@login_required
def create_conversation():
    participants = request.json.get('participants', [])

    # Validate participants
    if not participants or len(participants) < 2:
        return jsonify({'error': 'At least two participants are required.'}), 400

    # Create the conversation
    conversation = Conversation()
    db.session.add(conversation)
    db.session.commit()

    # Add participants to the conversation
    for user_id in participants:
        participant = ConversationParticipant(conversation_id=conversation.id, user_id=user_id)
        db.session.add(participant)

    db.session.commit()
    return jsonify({'conversation_id': conversation.id}), 201

# Get all conversations for the current user
@chat_route.route('/conversations', methods=['GET'])
@login_required
def get_conversations():
    conversations = Conversation.query.join(ConversationParticipant).filter(
        ConversationParticipant.user_id == current_user.id
    ).all()

    return jsonify([{
        'id': conversation.id,
        'created_at': conversation.created_at,
    } for conversation in conversations])

# Send a message
@chat_route.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
@login_required
def send_message(conversation_id):
    content = request.json.get('content')

    # Validate message content
    if not content:
        return jsonify({'error': 'Message content cannot be empty.'}), 400

    message = Message(conversation_id=conversation_id, sender_id=current_user.id, content=content)
    db.session.add(message)
    db.session.commit()
    return jsonify({'message_id': message.id}), 201

# Get messages for a conversation
@chat_route.route('/conversations/<int:conversation_id>/messages', methods=['GET'])
@login_required
def get_messages(conversation_id):
    messages = Message.query.filter_by(conversation_id=conversation_id).all()

    return jsonify([{
        'id': message.id,
        'content': message.content,
        'sender_id': message.sender_id,
        'created_at': message.created_at
    } for message in messages])
