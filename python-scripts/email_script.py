import os
from dotenv import load_dotenv
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime, date, timedelta


# get firebase connection
cred = credentials.Certificate("firebase-private-key.json")
firebase_admin.initialize_app(cred)
ref = db.reference("users/", url='https://mal-email-service-cc2a4-default-rtdb.firebaseio.com')
mangalert_users = ref.get()
anime_ref = db.reference(f"anime/", url='https://mal-email-service-cc2a4-default-rtdb.firebaseio.com')
manga_ref = db.reference(f"manga/", url='https://mal-email-service-cc2a4-default-rtdb.firebaseio.com')
all_anime, all_manga = anime_ref.get(), manga_ref.get()

# function for taking anime or manga id and returning img html for the entry
#   if it ended recently
def finished_media_image(media_type, id):
    # get correct dict from media type
    if media_type == "anime":
        entry = all_anime[id]
    elif media_type == "manga":
        entry = all_manga[id]
    
    # entries that haven't ended
    if not (entry["status"] == "finished_airing" or entry["status"] == "finished"):
        return ""
    
    # get and compare dates
    completed_date_string = entry.get("completed_date", "")
    if completed_date_string == "" or not(completed_date_string.count("-") == 2):
        return ""
    completed_date = datetime.strptime(completed_date_string, "%Y-%m-%d").date()
    three_months_ago = datetime.now() - timedelta(days=90)
    if completed_date > three_months_ago.date():
        return f"""
        <a href="{entry.get("url", "")}">
            <img src="{entry.get("img_url", "")}" width="100" height="145" />
        </a>
        """
    return ""

# function for taking anime or manga id and returning title if it ended recently
def finished_media_title(media_type, id):
    # get correct dict from media type
    if media_type == "anime":
        entry = all_anime[id]
    elif media_type == "manga":
        entry = all_manga[id]
    
    # entries that haven't ended
    if not (entry["status"] == "finished_airing" or entry["status"] == "finished"):
        return ""
    
    # get and compare dates
    completed_date_string = entry.get("completed_date", "")
    if completed_date_string == "" or not(completed_date_string.count("-") == 2):
        return ""
    completed_date = datetime.strptime(completed_date_string, "%Y-%m-%d").date()
    three_months_ago = datetime.now() - timedelta(days=90)
    if completed_date > three_months_ago.date():
        return entry["name"]
    return ""

# get email sending information
smtp_server = "smtp.gmail.com"
port = 465
sender_email = "ujigintokibowl@gmail.com"
load_dotenv()
password = os.getenv("MANGALERT_APP_PASSWORD")
my_email = os.getenv("MY_EMAIL")
ssl_context = ssl.create_default_context()

with smtplib.SMTP_SSL(smtp_server, port, context=ssl_context) as server:    
    # log into mangalert sender email
    server.login(sender_email, password)
    
    # go through all users and send email for each
    for user_id, user in mangalert_users.items():
        
        # skip user if no email given (and whatever other condition to filter and check for bugs)
        if user["email"] == "" or user["email"] not in ["kathirmey@gmail.com", "sudarmey@gmail.com", "manojbhagwat123@gmail.com"]:
            continue
        
        # initialize message
        message = MIMEMultipart("alternative")
        
        # email data
        message["From"] = "MangAlert"
        message["To"] = user["email"]
        message["Subject"] = f"MangAlert: {user['user_info']['name']}, Anime/Manga have finished airing! ({date.today()})"
        
        # construct completed media html with anime and manga data
        completed_media = ""
        if "anime" in user:
            completed_media += """
            <h2>PLANNED ANIME THAT HAVE RECENTLY ENDED:</h2>
            """
            anime_titles = anime_images = ""
            for anime_id in user["anime"]:
                anime_title = finished_media_title("anime", str(anime_id))
                if anime_title != "":
                    anime_titles += anime_title + ", "
            if anime_titles == "":
                anime_titles = "None in the last 3 months!  "
            for anime_id in user["anime"]:
                anime_images += finished_media_image("anime", str(anime_id))
            completed_media += f"""
            <h3>{anime_titles[:-2]}</h3>
            <br>
            {anime_images}
            """        
        if "manga" in user:
            completed_media += """<br><br>
            <h2>PLANNED MANGA THAT HAVE RECENTLY ENDED:</h2>
            """
            manga_titles = manga_images = ""
            for manga_id in user["manga"]:
                manga_title = finished_media_title("manga", str(manga_id))
                if manga_title != "":
                    manga_titles += manga_title + ", "
            if manga_titles == "":
                manga_titles = "None in the last 3 months!  "
            for manga_id in user["manga"]:
                manga_images += finished_media_image("manga", str(manga_id))
            completed_media += f"""
            <h3>{manga_titles[:-2]}</h3>
            <br>
            {manga_images}
            """
        
        # construct email content
        email_content = f"""
        <html>
            <head><h1>MangAlert Monthly Notification</h1></head>
            <body>
                <h3>Hey there! It's MangAlert (Uji_Gintoki_Bowl on MAL for inquiries).
                <br>
                Here are the planned anime and manga in your list that have 
                completed serialization within the last 3 months. Enjoy!</h3>
                <br>
                {completed_media}
                <br><br>
                <p>Please note that this notification uses your MAL data from the last
                time that you logged in, which can also be found at this url:
                <br>
                https://www.mangalert.com/users/{user_id}
                <br><br>
                To update your user data and have these monthly notifications be more up-to-date with 
                your list, please log in again <a href="https://www.mangalert.com/">here</a>.
                </p>
            </body>
        </html>
        """
        message.attach(MIMEText(email_content, "html"))        

        # send email to user
        server.sendmail(sender_email, my_email, message.as_string())
        print(f"Email sent to {user['user_info']['name']} successfully")

print("done")