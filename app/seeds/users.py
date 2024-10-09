from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_users():
    users = [
        {"first_name": "Demo", "last_name": "User", "email": "demo@aa.io", "username": "Demolition", "password": "password", "image_url": "https://example.com/images/darkphantom92.jpg"},
        {"first_name": "Liam", "last_name": "Johnson", "email": "liam.johnson@example.com", "username": "DarkPhantom92", "password": "password", "image_url": "https://example.com/images/darkphantom92.jpg"},
        {"first_name": "Olivia", "last_name": "Brown", "email": "olivia.brown@example.com", "username": "ShadowWraithX", "password": "password", "image_url": "https://example.com/images/shadowwraithx.jpg"},
        {"first_name": "Noah", "last_name": "Davis", "email": "noah.davis@example.com", "username": "VoidReaper77", "password": "password", "image_url": "https://example.com/images/voidreaper77.jpg"},
        {"first_name": "Emma", "last_name": "Wilson", "email": "emma.wilson@example.com", "username": "ValkyrieFrost", "password": "password", "image_url": "https://example.com/images/valkyriefrost.jpg"},
        {"first_name": "James", "last_name": "Moore", "email": "james.moore@example.com", "username": "NightHunter43", "password": "password", "image_url": "https://example.com/images/nighthunter43.jpg"},
        {"first_name": "Ava", "last_name": "Taylor", "email": "ava.taylor@example.com", "username": "CrimsonSirenX", "password": "password", "image_url": "https://example.com/images/crimsonsirenx.jpg"},
        {"first_name": "Lucas", "last_name": "Anderson", "email": "lucas.anderson@example.com", "username": "AbyssWalker66", "password": "password", "image_url": "https://example.com/images/abysswalker66.jpg"},
        {"first_name": "Sophia", "last_name": "Thomas", "email": "sophia.thomas@example.com", "username": "HexBladeQueen", "password": "password", "image_url": "https://example.com/images/hexbladequeen.jpg"},
        {"first_name": "Mason", "last_name": "Jackson", "email": "mason.jackson@example.com", "username": "SpectreStrike13", "password": "password", "image_url": "https://example.com/images/spectrestrike13.jpg"},
        {"first_name": "Isabella", "last_name": "White", "email": "isabella.white@example.com", "username": "CyberFuryX", "password": "password", "image_url": "https://example.com/images/cyberfuryx.jpg"},
        {"first_name": "Ethan", "last_name": "Harris", "email": "ethan.harris@example.com", "username": "RavenSoul45", "password": "password", "image_url": "https://example.com/images/ravensoul45.jpg"},
        {"first_name": "Mia", "last_name": "Martin", "email": "mia.martin@example.com", "username": "GhostlyRevenant", "password": "password", "image_url": "https://example.com/images/ghostlyrevenant.jpg"},
        {"first_name": "Logan", "last_name": "Thompson", "email": "logan.thompson@example.com", "username": "IronFang42", "password": "password", "image_url": "https://example.com/images/ironfang42.jpg"},
        {"first_name": "Amelia", "last_name": "Garcia", "email": "amelia.garcia@example.com", "username": "ViperBladeX", "password": "password", "image_url": "https://example.com/images/viperbladex.jpg"},
        {"first_name": "Henry", "last_name": "Martinez", "email": "henry.martinez@example.com", "username": "NebulaBane69", "password": "password", "image_url": "https://example.com/images/nebulabane69.jpg"},
        {"first_name": "Harper", "last_name": "Clark", "email": "harper.clark@example.com", "username": "ShadowRift95", "password": "password", "image_url": "https://example.com/images/shadowrift95.jpg"},
        {"first_name": "Jack", "last_name": "Rodriguez", "email": "jack.rodriguez@example.com", "username": "OblivionStormZ", "password": "password", "image_url": "https://example.com/images/oblivionstormz.jpg"},
        {"first_name": "Evelyn", "last_name": "Lewis", "email": "evelyn.lewis@example.com", "username": "PhoenixTalonX", "password": "password", "image_url": "https://example.com/images/phoenixtalonx.jpg"},
        {"first_name": "Alexander", "last_name": "Lee", "email": "alexander.lee@example.com", "username": "EclipseFang73", "password": "password", "image_url": "https://example.com/images/eclipsefang73.jpg"},
        {"first_name": "Scarlett", "last_name": "Walker", "email": "scarlett.walker@example.com", "username": "VenomousVixen", "password": "password", "image_url": "https://example.com/images/venomousvixen.jpg"},
        {"first_name": "Benjamin", "last_name": "Hall", "email": "benjamin.hall@example.com", "username": "WraithSlinger99", "password": "password", "image_url": "https://example.com/images/wraithslinger99.jpg"},
        {"first_name": "Lily", "last_name": "Allen", "email": "lily.allen@example.com", "username": "VoidValkyrieX", "password": "password", "image_url": "https://example.com/images/voidvalkyriex.jpg"},
        {"first_name": "Sebastian", "last_name": "Young", "email": "sebastian.young@example.com", "username": "GrimRevenantX", "password": "password", "image_url": "https://example.com/images/grimrevenantx.jpg"},
        {"first_name": "Ella", "last_name": "King", "email": "ella.king@example.com", "username": "FrostBaneX", "password": "password", "image_url": "https://example.com/images/frostbanex.jpg"},
        {"first_name": "Daniel", "last_name": "Scott", "email": "daniel.scott@example.com", "username": "SpectralBladeX", "password": "password", "image_url": "https://example.com/images/spectralbladex.jpg"},
        {"first_name": "Avery", "last_name": "Green", "email": "avery.green@example.com", "username": "ChaosWielder99", "password": "password", "image_url": "https://example.com/images/chaoswielder99.jpg"},
        {"first_name": "Matthew", "last_name": "Baker", "email": "matthew.baker@example.com", "username": "SoulShifterX", "password": "password", "image_url": "https://example.com/images/soulshifterx.jpg"},
        {"first_name": "Sofia", "last_name": "Adams", "email": "sofia.adams@example.com", "username": "DarkTemplarX", "password": "password", "image_url": "https://example.com/images/darktemplarx.jpg"},
        {"first_name": "Jackson", "last_name": "Carter", "email": "jackson.carter@example.com", "username": "DeathWingX", "password": "password", "image_url": "https://example.com/images/deathwingx.jpg"}
    ]

    for user_data in users:
        user = User(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            username=user_data["username"],
            password=user_data["password"],
            image_url=user_data["image_url"]
        )
        db.session.add(user)

    db.session.commit()


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
