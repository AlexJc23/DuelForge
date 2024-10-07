from app.models import db, Deck, environment, SCHEMA
from sqlalchemy.sql import text


def seed_deck():
    decks = {
    'deck1': {'user_id': 1, 'name': 'Dino Rampage', 'description': 'A fierce dinosaur-themed deck that overwhelms opponents with high ATK monsters.'},
    'deck2': {'user_id': 2, 'name': 'Spellcaster Domination', 'description': 'Master the field with powerful spellcasters and strategic spells.'},
    'deck3': {'user_id': 3, 'name': 'Elemental Heroes Unite', 'description': 'An Elemental Hero deck that focuses on fusion and combination for spectacular plays.'},
    'deck4': {'user_id': 4, 'name': 'Dragon Ruler', 'description': 'A deck that unleashes the power of dragons to dominate the battlefield.'},
    'deck5': {'user_id': 5, 'name': 'Zoodiac Rampage', 'description': 'Utilizes the Zoodiac archetype to create overwhelming XYZ summons.'},
    'deck6': {'user_id': 6, 'name': 'Burning Abyss', 'description': 'A deck that revolves around the Burning Abyss monsters for continuous effects.'},
    'deck7': {'user_id': 7, 'name': 'Ninja Arts', 'description': 'A stealthy deck using ninjas to ambush and outsmart opponents.'},
    'deck8': {'user_id': 8, 'name': 'Aromage Garden', 'description': 'A plant-based deck that focuses on healing and field control.'},
    'deck9': {'user_id': 9, 'name': 'Cyber Dragon Onslaught', 'description': 'Utilizes Cyber Dragons to overpower foes with high attack.'},
    'deck10': {'user_id': 10, 'name': 'Pendulum Power', 'description': 'A Pendulum deck that harnesses the power of pendulum summoning.'},
    'deck11': {'user_id': 11, 'name': 'Shaddoll Fusion', 'description': 'Combines fusion mechanics with the Shaddoll archetype for powerful effects.'},
    'deck12': {'user_id': 12, 'name': 'Infernoid Annihilation', 'description': 'An Infernoid deck that banishes cards and controls the field.'},
    'deck13': {'user_id': 13, 'name': 'Orcust Symphony', 'description': 'A dark orchestra-themed deck that combines fusion and effects for lethal combos.'},
    'deck14': {'user_id': 14, 'name': 'Salamangreat Blaze', 'description': 'Utilizes Salamangreat monsters for repeated summons and field control.'},
    'deck15': {'user_id': 15, 'name': 'Time Thief Adventure', 'description': 'Time Thief deck that manipulates turns for tactical advantage.'},
    'deck16': {'user_id': 16, 'name': 'Rokket Revolution', 'description': 'Utilizes Rokket monsters for quick summoning and field advantage.'},
    'deck17': {'user_id': 17, 'name': 'Vampire Control', 'description': 'Vampire-themed deck that focuses on gaining control of the opponent\'s monsters.'},
    'deck18': {'user_id': 18, 'name': 'Thunder Dragon Charge', 'description': 'A Thunder Dragon deck that builds power with effects and summons.'},
    'deck19': {'user_id': 19, 'name': 'Altergeist Manipulation', 'description': 'Uses Altergeist monsters for tricky control of the game.'},
    'deck20': {'user_id': 20, 'name': 'Bujin Spirit', 'description': 'A Bujin deck that uses spirit monsters for protection and summoning.'},
    'deck21': {'user_id': 21, 'name': 'Mystic Mine Control', 'description': 'A control deck that relies on Mystic Mine for field advantage.'},
    'deck22': {'user_id': 22, 'name': 'Marincess Dive', 'description': 'A water-themed deck that utilizes Marincess monsters for rapid summoning.'},
    'deck23': {'user_id': 23, 'name': 'Swordsoul Strategy', 'description': 'A Swordsoul deck focusing on synchro summoning for powerful plays.'},
    'deck24': {'user_id': 24, 'name': 'Unchained Fury', 'description': 'An Unchained deck that leverages destruction for board control.'},
    'deck25': {'user_id': 25, 'name': 'Altered Scales', 'description': 'A deck focused on altering the scales for Pendulum summoning.'},
    'deck26': {'user_id': 26, 'name': 'Gouki Power', 'description': 'Utilizes Gouki monsters for heavy attacks and combos.'},
    'deck27': {'user_id': 27, 'name': 'D/D/D Domination', 'description': 'A D/D/D deck that focuses on fusion and summoning power.'},
    'deck28': {'user_id': 28, 'name': 'Dragoon of Red-Eyes', 'description': 'Combines Red-Eyes with fusion for unstoppable forces.'},
    'deck29': {'user_id': 29, 'name': 'Phantom Knights Control', 'description': 'Uses Phantom Knights to control the game and counter opponents.'},
    'deck30': {'user_id': 30, 'name': 'Frog Frenzy', 'description': 'A deck that uses frogs to swarm the field with tricky plays.'},
}



    for key, attributes in decks.items():
        allDecks = Deck(**attributes)
        db.session.add(allDecks)

        db.session.commit()



def undo_decks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.decks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM decks"))

    db.session.commit()
