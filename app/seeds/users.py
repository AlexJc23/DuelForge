from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_users():
    users = [
    {
        "first_name": "Demo",
        "last_name": "User",
        "email": "demo@aa.io",
        "username": "Demolition",
        "password": "password",
        "image_url": "https://example.com/images/darkphantom92.jpg",
        "bio": "Hey there! I’m Demo, a Yu-Gi-Oh! fanatic with a deck for every occasion. From high-level duels to casual matches with friends, I’m all about strategy and mind games. Let’s duel!"
    },
    {
        "first_name": "Liam",
        "last_name": "Johnson",
        "email": "liam.johnson@example.com",
        "username": "DarkPhantom92",
        "password": "password",
        "image_url": "https://example.com/images/darkphantom92.jpg",
        "bio": "I'm Liam, but in the Duelist world, you’ll know me as DarkPhantom92. I specialize in dark-type monsters and have a knack for pulling off surprise moves. Up for a challenge?"
    },
    {
        "first_name": "Olivia",
        "last_name": "Brown",
        "email": "olivia.brown@example.com",
        "username": "ShadowWraithX",
        "password": "password",
        "image_url": "https://example.com/images/shadowwraithx.jpg",
        "bio": "Olivia here! My friends call me ShadowWraithX because I’m all about ghost and spirit cards. I’m a Duelist who loves keeping my opponents on edge—come duel if you dare!"
    },
    {
        "first_name": "Noah",
        "last_name": "Davis",
        "email": "noah.davis@example.com",
        "username": "VoidReaper77",
        "password": "password",
        "image_url": "https://example.com/images/voidreaper77.jpg",
        "bio": "Yo, I’m Noah, a.k.a. VoidReaper77. I live for high-stakes duels and tricky trap cards. My deck is all about chaos and control—get ready to face the void when we duel!"
    },
    {
        "first_name": "Emma",
        "last_name": "Wilson",
        "email": "emma.wilson@example.com",
        "username": "ValkyrieFrost",
        "password": "password",
        "image_url": "https://example.com/images/valkyriefrost.jpg",
        "bio": "Emma here, known as ValkyrieFrost in the Yu-Gi-Oh! arena. I play a mix of icy and warrior archetypes. If you’re up for a duel, be prepared to be frozen in your tracks!"
    },
    {
        "first_name": "James",
        "last_name": "Moore",
        "email": "james.moore@example.com",
        "username": "NightHunter43",
        "password": "password",
        "image_url": "https://example.com/images/nighthunter43.jpg",
        "bio": "I’m James, or NightHunter43 online. My strategy is stealth and precision with my hunter cards, lurking in the shadows till it’s time to strike. Care to duel and find out?"
    },
    {
        "first_name": "Ava",
        "last_name": "Taylor",
        "email": "ava.taylor@example.com",
        "username": "CrimsonSirenX",
        "password": "password",
        "image_url": "https://example.com/images/crimsonsirenx.jpg",
        "bio": "I’m Ava, also known as CrimsonSirenX. I’m all about fierce, fast-paced battles with my dragon and fire cards. Think you can handle the heat? Let’s find out in a duel!"
    },
    {
        "first_name": "Lucas",
        "last_name": "Anderson",
        "email": "lucas.anderson@example.com",
        "username": "AbyssWalker66",
        "password": "password",
        "image_url": "https://example.com/images/abysswalker66.jpg",
        "bio": "Lucas here, or AbyssWalker66 to Duelists. My deck’s packed with dark waters and lurking creatures. Every duel feels like a plunge into the abyss—let’s see if you survive!"
    },
    {
        "first_name": "Sophia",
        "last_name": "Thomas",
        "email": "sophia.thomas@example.com",
        "username": "HexBladeQueen",
        "password": "password",
        "image_url": "https://example.com/images/hexbladequeen.jpg",
        "bio": "I’m Sophia, but everyone calls me HexBladeQueen. I love spellcasters and hexes, perfect for outwitting my opponents. Think you can break my spells? Let’s see!"
    },
    {
        "first_name": "Mason",
        "last_name": "Jackson",
        "email": "mason.jackson@example.com",
        "username": "SpectreStrike13",
        "password": "password",
        "image_url": "https://example.com/images/spectrestrike13.jpg",
        "bio": "I’m Mason, known as SpectreStrike13, a Duelist with a thing for ghost-type monsters and spectral attacks. I like to keep it eerie and unexpected. Up for a spooky duel?"
    },
    {
        "first_name": "Isabella",
        "last_name": "White",
        "email": "isabella.white@example.com",
        "username": "CyberFuryX",
        "password": "password",
        "image_url": "https://example.com/images/cyberfuryx.jpg",
        "bio": "Hey, I’m Isabella, aka CyberFuryX! My deck is all about tech and power moves. If you’re looking for a Duelist who can adapt on the fly, look no further—let’s duel!"
    },
    {
        "first_name": "Ethan",
        "last_name": "Harris",
        "email": "ethan.harris@example.com",
        "username": "RavenSoul45",
        "password": "password",
        "image_url": "https://example.com/images/ravensoul45.jpg",
        "bio": "I’m Ethan, but RavenSoul45 when it’s game time. My deck flies like a raven, swift and elusive. I believe in strategic plays—think you can outsmart me? Challenge accepted!"
    },
    {
        "first_name": "Mia",
        "last_name": "Martin",
        "email": "mia.martin@example.com",
        "username": "GhostlyRevenant",
        "password": "password",
        "image_url": "https://example.com/images/ghostlyrevenant.jpg",
        "bio": "Mia here! Known as GhostlyRevenant, I duel with a ghost-themed deck. I love unpredictable plays that keep my opponents guessing. Want to see what haunts my deck?"
    },
    {
        "first_name": "Logan",
        "last_name": "Thompson",
        "email": "logan.thompson@example.com",
        "username": "IronFang42",
        "password": "password",
        "image_url": "https://example.com/images/ironfang42.jpg",
        "bio": "Hey, I’m Logan, or IronFang42 to fellow duelists. My cards are fierce and relentless like a wolf. Once my fangs sink in, I don’t let go. Ready to face the wild side?"
    },
    {
        "first_name": "Amelia",
        "last_name": "Garcia",
        "email": "amelia.garcia@example.com",
        "username": "ViperBladeX",
        "password": "password",
        "image_url": "https://example.com/images/viperbladex.jpg",
        "bio": "I’m Amelia, but you’ll know me as ViperBladeX. My style? Sharp and venomous, like a viper’s bite. I love duels that challenge my wits and reflexes. Let’s see your skills!"
    },
    {
        "first_name": "Henry",
        "last_name": "Martinez",
        "email": "henry.martinez@example.com",
        "username": "NebulaBane69",
        "password": "password",
        "image_url": "https://example.com/images/nebulabane69.jpg",
        "bio": "Yo, I’m Henry, aka NebulaBane69. I’m all about cosmic and star-themed monsters. My duels are out of this world, literally. Think you can handle the celestial power?"
    },
    {
        "first_name": "Harper",
        "last_name": "Clark",
        "email": "harper.clark@example.com",
        "username": "ShadowRift95",
        "password": "password",
        "image_url": "https://example.com/images/shadowrift95.jpg",
        "bio": "Harper here, also known as ShadowRift95. I specialize in shadowy cards that create chaos. My deck is all about playing in the dark—let’s see if you can survive it!"
    },
    {
        "first_name": "Jack",
        "last_name": "Rodriguez",
        "email": "jack.rodriguez@example.com",
        "username": "OblivionStormZ",
        "password": "password",
        "image_url": "https://example.com/images/oblivionstormz.jpg",
        "bio": "I’m Jack, but when it’s duel time, I’m OblivionStormZ. My deck’s all about storms and overwhelming attacks. I love powerful plays—up for a duel in the eye of the storm?"
    },
    {
        "first_name": "Ellie",
        "last_name": "Lewis",
        "email": "ellie.lewis@example.com",
        "username": "FrostEmpress7",
        "password": "password",
        "image_url": "https://example.com/images/frostempress7.jpg",
        "bio": "Ellie here! Call me FrostEmpress7 on the battlefield. My deck’s icy, with a powerful winter theme. Think you can stand the chill? Let’s test your resolve in a duel!"
    },
    {
        "first_name": "Aiden",
        "last_name": "Walker",
        "email": "aiden.walker@example.com",
        "username": "DragonForge15",
        "password": "password",
        "image_url": "https://example.com/images/dragonforge15.jpg",
        "bio": "I’m Aiden, known as DragonForge15. I live for dragon cards and powerful moves. I’m always ready for a fiery duel—let’s see if you can handle the heat!"
    },
    {
        "first_name": "Scarlett",
        "last_name": "Young",
        "email": "scarlett.young@example.com",
        "username": "PhoenixAbyss",
        "password": "password",
        "image_url": "https://example.com/images/phoenixabyss.jpg",
        "bio": "Hey, I’m Scarlett, or PhoenixAbyss. My deck rises from the ashes every time. Think you can handle my fiery resilience? Let’s duel and see!"
    },
    {
        "first_name": "Jayden",
        "last_name": "Allen",
        "email": "jayden.allen@example.com",
        "username": "LunarGuard98",
        "password": "password",
        "image_url": "https://example.com/images/lunarguard98.jpg",
        "bio": "I’m Jayden, but LunarGuard98 to my duel rivals. My deck’s all about moonlight and strategy—ever tried to fight in the dark? Let’s see if you’re ready!"
    },
    {
        "first_name": "Grace",
        "last_name": "King",
        "email": "grace.king@example.com",
        "username": "CelestialStar27",
        "password": "password",
        "image_url": "https://example.com/images/celestialstar27.jpg",
        "bio": "Grace here, also known as CelestialStar27. I’m all about cosmic cards and bright, shining plays. Ready to duel in the galaxy? Let’s see if you shine as bright as I do!"
    },
    {
        "first_name": "Leo",
        "last_name": "Hernandez",
        "email": "leo.hernandez@example.com",
        "username": "PyroFist12",
        "password": "password",
        "image_url": "https://example.com/images/pyrofist12.jpg",
        "bio": "I’m Leo, a Duelist who loves fire and intensity—call me PyroFist12. My deck burns through opponents with powerful plays. Care to take on the heat?"
    },
    {
        "first_name": "Zoe",
        "last_name": "Scott",
        "email": "zoe.scott@example.com",
        "username": "MysticFlame11",
        "password": "password",
        "image_url": "https://example.com/images/mysticflame11.jpg",
        "bio": "I’m Zoe, but I go by MysticFlame11 when I duel. My deck’s all about magical fire and mystic plays. Ready to duel in the flames?"
    },
    {
        "first_name": "David",
        "last_name": "Reed",
        "email": "david.reed@example.com",
        "username": "SilentHunter34",
        "password": "password",
        "image_url": "https://example.com/images/silenthunter34.jpg",
        "bio": "I’m David, SilentHunter34 in the arena. I play silent but deadly. My deck’s about patience and precision—up for a duel?"
    },
    {
        "first_name": "Lily",
        "last_name": "Robinson",
        "email": "lily.robinson@example.com",
        "username": "OceanReaper77",
        "password": "password",
        "image_url": "https://example.com/images/oceanreaper77.jpg",
        "bio": "Lily here, known as OceanReaper77. My deck’s full of powerful water monsters. Ready to dive in?"
    },
    {
        "first_name": "Caleb",
        "last_name": "Morris",
        "email": "caleb.morris@example.com",
        "username": "BladeSpectre13",
        "password": "password",
        "image_url": "https://example.com/images/bladespectre13.jpg",
        "bio": "I’m Caleb, BladeSpectre13 when it’s game time. My deck’s all about sharp plays and unexpected moves. Up for a challenge?"
    },
    {
        "first_name": "Hannah",
        "last_name": "Ward",
        "email": "hannah.ward@example.com",
        "username": "StarlightQueen99",
        "password": "password",
        "image_url": "https://example.com/images/starlightqueen99.jpg",
        "bio": "Hey, I’m Hannah, known as StarlightQueen99. I’m all about shining plays with my starlight deck. Ready to duel under the stars?"
    }
]


    for user_data in users:
        user = User(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            username=user_data["username"],
            bio= user_data['bio'],
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
