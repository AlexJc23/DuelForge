from app.models import db, EventImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_eventImage():
    image_urls = [
        'https://i.redd.it/rhpkbahwt5ic1.jpeg',
        'https://yugiohnz.com/wp-content/uploads/2022/04/states-2022-trophy-600x450-1.jpeg',
        'https://images.pexels.com/photos/20131195/pexels-photo-20131195/free-photo-of-iphone-with-the-game-yu-gi-oh-duel-links-playing-on-the-display-an-ipad-playing-yu-gi-oh-card-game-the-chronicles-yu-gi-oh-card-game-25th-anniversary-jovan-vasiljevic-photography.jpeg',
        'https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/07/Yugioh-Duel-Disk.jpeg.jpg',
        'https://www.shutterstock.com/image-photo/guanajuato-mexico-february-22-2021-260nw-1922447285.jpg',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1449850/capsule_616x353.jpg',
        'https://roadoftheking.com/wp-content/uploads/2024/09/YuGiOhWorldChampionship.jpg',
        'https://i.ytimg.com/vi/Ve-7p60raFU/maxresdefault.jpg',
        'https://i.ytimg.com/vi/I5iKzm1i6VE/maxresdefault.jpg',
        'https://pm1.aminoapps.com/7489/15463377b010b2c0a1d95af685cdadf7da69f2d6r1-1080-374v2_uhq.jpg',
        'https://pbs.twimg.com/media/GFFQsMAaIAAtb6X.jpg',
        'https://www.heypoorplayer.com/wp-content/uploads/2017/02/YGOmain.jpg',
        'https://assetsio.gnwcdn.com/yu-gi-oh-master-duel-gameplay.png',
        'https://static1.srcdn.com/wordpress/wp-content/uploads/2022/01/YGO-Master-Duel-Fusion.jpg',
        'https://i.ytimg.com/vi/QrHRMrWJ9Lk/hq720.jpg',
        'https://img.freepik.com/premium-photo/nighttime-scene-with-starry-background_410516-18837.jpg',
        'https://yugiohblog.konami.com/wp-content/uploads/2018/02/UDS-Belt.jpg',
        'https://i.redd.it/435wlf313uh21.jpg',
        'https://bloximages.newyork1.vip.townnews.com/dailynebraskan.com/content/tncms/assets/v3/editorial/0/4f/04f86ee8-3870-11ed-a65b-b748990239fc/6328f6a272314.image.jpg',
        'https://c8.alamy.com/comp/DYCT8W/teenage-boys-playing-a-yu-gi-oh-trading-card-tournament-DYCT8W.jpg',
        'https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/07/yugioh.jpg',
        'https://i.ytimg.com/vi/m1SCk4Lkuy8/maxresdefault.jpg',
        'https://i.ytimg.com/vi/VqUQqrbyHc0/hqdefault.jpg',
        'https://i.ytimg.com/vi/xnFWO61D91k/maxresdefault.jpg',
        'https://i.ytimg.com/vi/5-VMhDb4ahE/maxresdefault.jpg',
        'https://i.ytimg.com/vi/mQ0S-pnJp9Y/sddefault.jpg',
        'https://i.redd.it/vrfo0gv5u5wb1.jpg',
        'https://i.ytimg.com/vi/bBhdKH9zUxM/maxresdefault.jpg',
        'https://64.media.tumblr.com/58040c93c036839816b0d5359b9dec9f/tumblr_inline_oz8sy8qaKF1qc7qsj_540.jpg',
        'https://i.ebayimg.com/images/g/NVUAAOSwDFhgs37r/s-l1200.jpg',
    ]

    event_images = []
    for i, url in enumerate(image_urls, start=1):
        event_images.append(EventImage(event_id=i, image_url=url))

    db.session.bulk_save_objects(event_images)
    db.session.commit()


def undo_eventImages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.event_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM event_images"))

    db.session.commit()
