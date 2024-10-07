from flask.cli import AppGroup
from .users import seed_users, undo_users
from .cards import seed_cards, seed_card_images, undo_cards, undo_card_images
from .comments import seed_comment, undo_comments
from .decks import seed_deck, undo_decks
from .event_images import seed_eventImage, undo_eventImages
from .events import seed_events, undo_events

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_events()
        undo_card_images()
        undo_comments()
        undo_decks()
        undo_eventImages()
        undo_cards()
    seed_users()
    seed_events()
    seed_eventImage()
    seed_card_images()
    seed_deck()
    seed_cards()
    seed_comment()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_card_images()
    undo_cards()
    undo_comments()
    undo_decks()
    undo_eventImages()
    undo_events()
    # Add other undo functions here
