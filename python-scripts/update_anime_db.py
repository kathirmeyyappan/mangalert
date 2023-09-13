import requests
import time as time
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials, db


# get firebase connection
cred = credentials.Certificate("firebase-private-key.json")
firebase_admin.initialize_app(cred)
ref = db.reference("anime/", url='https://mal-email-service-cc2a4-default-rtdb.firebaseio.com')


# Load .env file and get MAL client id
load_dotenv()
client_id = os.getenv("CLIENT_ID")

# initial call to begin pagination through all anime
auth = {'X-MAL-CLIENT-ID' : client_id}
base_url = "https://api.myanimelist.net/v2/anime/ranking"
payload = {'ranking_type': 'all',
           'limit': 500,
           'offset': 0,
           'fields': 'id,status'}
response = requests.get(base_url, headers=auth, params=payload).json()

while 'next' in response['paging']:
    time.sleep(0.1)
    
    updated_entries = {}
    for entry in response['data']:
        anime = entry['node']
        
        # construct data to put into db
        updated_entries[anime['id']] = {
            'url' : f"https://myanimelist.net/anime/{anime['id']}/",
            'name' : anime.get('title', None),
            'img_url' : anime.get('main_picture', {}).get('medium', None),
            'status' : anime.get('status', None)
        }
    
    # add batch of anime with updated info to db
    ref.update(updated_entries)
    print([id for id in updated_entries.keys()])
    
    # get next batch of 500 entries with pagination
    try:
        response = requests.get(response['paging']['next'], headers=auth).json()
    except KeyError as e:
        print(f"Key Error: {e}")