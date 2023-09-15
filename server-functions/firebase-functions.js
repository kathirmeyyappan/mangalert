// import needed functions from other files
import { getPlannedManga, getPlannedAnime } from './mal-functions.js'

// import needed Firebase SDKs
import admin from 'firebase-admin';
import { ref, set, get, remove } from 'firebase/database';

// service account key for firebase access
import serviceAccount from '../firebase-private-key.js';

// firebase configuration
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://mal-email-service-cc2a4-default-rtdb.firebaseio.com'
});

// initialize firebase
const db = admin.database();


// (re)write user info to db
export async function writeUserInfo(email, user_info, accessToken) {
  // assign user path
  const reference = ref(db, 'users/' + user_info['id']);

  const plannedAnime = await getPlannedAnime(accessToken)
  const plannedManga = await getPlannedManga(accessToken)

  // write all data to db
  set(reference, {
    user_info: user_info,
    email: email,
    anime: plannedAnime,
    manga: plannedManga
  });
}


// get user info to db if they've visited before otherwise null
export async function getMangAlertUserInfo(user_id) {
  // assign user path and get reference
  const reference = ref(db, 'users/' + user_id);
  const snapshot = await get(reference);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    return userData;
  } else {
    return null; 
  }
}


// get time-stratified json with completed anime that are planned by user
export async function getFinishedPlannedAnime(user_id) {
  // get user's plann-to-watch anime
  const userRef = ref(db, 'users/' + user_id);
  const userSnap = await get(userRef);
  const userData = userSnap.val()
  let plannedAnime = userData.anime
  if (plannedAnime == undefined) {
    plannedAnime = [];
  }

  // arrays to hold anime of each type
  const recent = [];
  const other = [];

  // use mapping to execute asynchronous operations
  const promises = plannedAnime.map(async (anime_id) => {
    // get anime info from db by id
    const animeRef = ref(db, 'anime/' + anime_id);
    const animeSnap = await get(animeRef)
    const anime = animeSnap.val()

    if (anime.status == "finished_airing") {
      if (anime.completed_date == "") {
        other.push(anime)
        return;
      }
      const completedDate = new Date(anime.completed_date);
      const currentDate = new Date();
      // set the "recent" threshold date
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      
      // compare dates to see which list to push to
      if (completedDate > threeMonthsAgo) {
        recent.push(anime)
      } else {
        other.push(anime)
      }
    }
  });

  // wait for all async calls to end
  await Promise.all(promises)
  return {
    'recently_completed': recent,
    'other_completed': other,
  };
}


// get time-stratified json with completed manga that are planned by user
export async function getFinishedPlannedManga(user_id) {
  // get user's plann-to-watch manga
  const userRef = ref(db, 'users/' + user_id);
  const userSnap = await get(userRef);
  const userData = userSnap.val()
  let plannedManga = userData.manga
  if (plannedManga == undefined) {
    plannedManga = [];
  }

  // arrays to hold manga of each type
  const recent = [];
  const other = [];

  // use mapping to execute asynchronous operations
  const promises = plannedManga.map(async (manga_id) => {
    // get manga info from db by id
    const mangaRef = ref(db, 'manga/' + manga_id);
    const mangaSnap = await get(mangaRef)
    const manga = mangaSnap.val()

    if (manga.status == "finished") {
      if (manga.completed_date == "") {
        other.push(manga)
        return;
      }
      const completedDate = new Date(manga.completed_date);
      const currentDate = new Date();
      // set the "recent" threshold date
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      
      // compare dates to see which list to push to
      if (completedDate > threeMonthsAgo) {
        recent.push(manga)
      } else {
        other.push(manga)
      }
    }
  });

  // wait for all async calls to end
  await Promise.all(promises)
  return {
    'recently_completed': recent,
    'other_completed': other,
  };
}

export async function removeUser(id) {
  remove(ref(db, `users/${id}`));
}