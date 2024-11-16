from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from werkzeug.security import check_password_hash
from app.models import User
from app import db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}



@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('profile/<int:id>')
def userProfile(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    user_dict = {
        'bio': user.bio,
        'username': user.username,

    }

    return user_dict


@user_routes.route('/update/<int:id>', methods=['PUT'])
@login_required
def updateProfile(id):
    logged_in_user = current_user.to_dict()

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if logged_in_user['id'] != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    # Update the user's profile
    if 'bio' in data:
        user.bio = data['bio']

    # Commit the changes to the database
    db.session.commit()

    # Return the updated user data
    return jsonify(user.to_dict()), 200


@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def remove(id):

    logged_in_user = current_user.to_dict()


    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404


    if logged_in_user['id'] != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Get the password from the request data
    data = request.get_json()
    password = data.get('password')

    # Verify the password
    if not password or not check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401

    # Proceed with deletion if password is correct
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User account deleted successfully"}), 200
