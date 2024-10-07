from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_events():
    events = {
        'event1': {'owner_id': 1, 'name': 'Something Edgy Yu-Gi-Oh Title', 'description': 'Description about the event that deals with Yu-Gi-Oh', 'start_date': '01/02/2025', 'end_date': '01/03/2025', 'location': '413 W 14th St, New York, NY 10014', 'price': 20},
        'event2': {'owner_id': 2, 'name': 'Duelists Unite', 'description': 'Join us for an epic tournament', 'start_date': '01/15/2025', 'end_date': '01/16/2025', 'location': '123 E 15th St, New York, NY 10003', 'price': 25},
        'event3': {'owner_id': 3, 'name': 'Yu-Gi-Oh Battle Royale', 'description': 'Battle against the best duelists', 'start_date': '02/01/2025', 'end_date': '02/02/2025', 'location': '200 W 54th St, New York, NY 10019', 'price': 30},
        'event4': {'owner_id': 4, 'name': 'Legendary Duelists Showdown', 'description': 'Are you a legendary duelist?', 'start_date': '02/15/2025', 'end_date': '02/16/2025', 'location': '555 W 42nd St, New York, NY 10036', 'price': 15},
        'event5': {'owner_id': 5, 'name': 'Yu-Gi-Oh Card Trading Event', 'description': 'Trade and duel with fellow fans', 'start_date': '03/01/2025', 'end_date': '03/02/2025', 'location': '101 E 12th St, New York, NY 10003', 'price': 10},
        'event6': {'owner_id': 6, 'name': 'Duel Masters Tournament', 'description': 'Who will be crowned the Duel Master?', 'start_date': '03/10/2025', 'end_date': '03/11/2025', 'location': '76 S 6th St, Brooklyn, NY 11249', 'price': 20},
        'event7': {'owner_id': 7, 'name': 'Yu-Gi-Oh Championship Series', 'description': 'Join the championship series', 'start_date': '04/01/2025', 'end_date': '04/02/2025', 'location': '220 E 21st St, New York, NY 10010', 'price': 40},
        'event8': {'owner_id': 8, 'name': 'Duelists Meetup', 'description': 'Meet other duelists in your area', 'start_date': '04/15/2025', 'end_date': '04/16/2025', 'location': '222 W 39th St, New York, NY 10018', 'price': 5},
        'event9': {'owner_id': 9, 'name': 'Yu-Gi-Oh Casual Tournament', 'description': 'A friendly tournament for all ages', 'start_date': '05/01/2025', 'end_date': '05/02/2025', 'location': '150 E 29th St, New York, NY 10016', 'price': 15},
        'event10': {'owner_id': 10, 'name': 'Epic Duel Showdown', 'description': 'Show your skills against other duelists', 'start_date': '05/15/2025', 'end_date': '05/16/2025', 'location': '350 E 8th St, New York, NY 10009', 'price': 25},
        'event11': {'owner_id': 11, 'name': 'Yu-Gi-Oh Duel Fest', 'description': 'Join us for a festival of duels', 'start_date': '06/01/2025', 'end_date': '06/02/2025', 'location': '400 W 15th St, New York, NY 10011', 'price': 20},
        'event12': {'owner_id': 12, 'name': 'The Dark Side of Duel', 'description': 'Explore the dark side of Yu-Gi-Oh', 'start_date': '06/15/2025', 'end_date': '06/16/2025', 'location': '300 E 30th St, New York, NY 10016', 'price': 30},
        'event13': {'owner_id': 13, 'name': 'Yu-Gi-Oh Legends Unite', 'description': 'Legends come together for an epic duel', 'start_date': '07/01/2025', 'end_date': '07/02/2025', 'location': '450 W 29th St, New York, NY 10001', 'price': 25},
        'event14': {'owner_id': 14, 'name': 'Yu-Gi-Oh Fusion Fest', 'description': 'Join us for a fusion of cards and duelists', 'start_date': '07/15/2025', 'end_date': '07/16/2025', 'location': '580 W 18th St, New York, NY 10011', 'price': 20},
        'event15': {'owner_id': 15, 'name': 'Duel of the Champions', 'description': 'Compete to become the champion', 'start_date': '08/01/2025', 'end_date': '08/02/2025', 'location': '230 E 42nd St, New York, NY 10017', 'price': 30},
        'event16': {'owner_id': 16, 'name': 'Yu-Gi-Oh Night Duel', 'description': 'Duel under the stars', 'start_date': '08/15/2025', 'end_date': '08/16/2025', 'location': '330 E 37th St, New York, NY 10016', 'price': 20},
        'event17': {'owner_id': 17, 'name': 'The Ultimate Duelist', 'description': 'Are you the ultimate duelist?', 'start_date': '09/01/2025', 'end_date': '09/02/2025', 'location': '240 W 22nd St, New York, NY 10011', 'price': 25},
        'event18': {'owner_id': 18, 'name': 'Yu-Gi-Oh Duel Party', 'description': 'Join us for a party of duels', 'start_date': '09/15/2025', 'end_date': '09/16/2025', 'location': '100 E 23rd St, New York, NY 10010', 'price': 15},
        'event19': {'owner_id': 19, 'name': 'Card Clash: Yu-Gi-Oh Edition', 'description': 'Clash with fellow duelists', 'start_date': '10/01/2025', 'end_date': '10/02/2025', 'location': '300 W 24th St, New York, NY 10011', 'price': 20},
        'event20': {'owner_id': 20, 'name': 'Yu-Gi-Oh Duel and Trade', 'description': 'Trade cards and duel', 'start_date': '10/15/2025', 'end_date': '10/16/2025', 'location': '510 W 32nd St, New York, NY 10001', 'price': 10},
        'event21': {'owner_id': 21, 'name': 'The Pharaohs Challenge', 'description': 'Can you conquer the Pharaoh?', 'start_date': '11/01/2025', 'end_date': '11/02/2025', 'location': '400 E 39th St, New York, NY 10016', 'price': 25},
        'event22': {'owner_id': 22, 'name': 'Yu-Gi-Oh Turbo Duel', 'description': 'Experience the thrill of turbo dueling', 'start_date': '11/15/2025', 'end_date': '11/16/2025', 'location': '750 W 31st St, New York, NY 10001', 'price': 30},
        'event23': {'owner_id': 23, 'name': 'The Great Duel', 'description': 'Join us for a great duel experience', 'start_date': '12/01/2025', 'end_date': '12/02/2025', 'location': '250 E 14th St, New York, NY 10003', 'price': 20},
        'event24': {'owner_id': 24, 'name': 'Dueling with Friends', 'description': 'Bring your friends for an epic duel', 'start_date': '12/15/2025', 'end_date': '12/16/2025', 'location': '500 W 15th St, New York, NY 10011', 'price': 15},
        'event25': {'owner_id': 25, 'name': 'Yu-Gi-Oh Night of Champions', 'description': 'Who will be crowned champion?', 'start_date': '12/20/2025', 'end_date': '12/21/2025', 'location': '350 W 39th St, New York, NY 10018', 'price': 30},
        'event26': {'owner_id': 26, 'name': 'Yu-Gi-Oh Duel Night', 'description': 'A night full of dueling fun', 'start_date': '01/05/2026', 'end_date': '01/06/2026', 'location': '680 W 34th St, New York, NY 10001', 'price': 20},
        'event27': {'owner_id': 27, 'name': 'Card Game Festival', 'description': 'A festival celebrating card games', 'start_date': '01/15/2026', 'end_date': '01/16/2026', 'location': '390 E 18th St, New York, NY 10003', 'price': 15},
        'event28': {'owner_id': 28, 'name': 'Duelist Convention', 'description': 'A convention for all duelists', 'start_date': '02/01/2026', 'end_date': '02/02/2026', 'location': '210 W 40th St, New York, NY 10018', 'price': 25},
        'event29': {'owner_id': 29, 'name': 'Yu-Gi-Oh Collectors Meetup', 'description': 'Meet other collectors and trade', 'start_date': '02/15/2026', 'end_date': '02/16/2026', 'location': '490 W 15th St, New York, NY 10011', 'price': 20},
        'event30': {'owner_id': 30, 'name': 'Duel of Legends', 'description': 'Duel with legendary cards', 'start_date': '03/01/2026', 'end_date': '03/02/2026', 'location': '300 E 35th St, New York, NY 10016', 'price': 30},
    }

    for event in events.values():
        event['start_date'] = datetime.strptime(event['start_date'], '%m/%d/%Y').date()
        event['end_date'] = datetime.strptime(event['end_date'], '%m/%d/%Y').date()
        new_event = Event(
            owner_id=event['owner_id'],
            name=event['name'],
            description=event['description'],
            start_date=event['start_date'],
            end_date=event['end_date'],
            location=event['location'],
            price=event['price'],
        )
        db.session.add(new_event)

    db.session.commit()


def undo_events():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.events RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM events"))

    db.session.commit()
