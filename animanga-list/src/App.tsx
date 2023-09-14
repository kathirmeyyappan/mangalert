import * as React from 'react';
import './App.css';
import Card from './components/Card'

// use this format to make calls to backend (once you've made the express.get in there)
fetch('/api/userLogin', {
  method: 'GET'
})
.then((response) => response.json())
.then((data) => {
  // Handle the data received from the server
  console.log(data);
})
.catch((error) => {
  console.error('Error:', error);
});

function App() {
const mockAnime = {
    "anime": [
        {"name" : "Testing the wrapping of this text if i make this really fucking long holy shit like even longer than this",
         "img_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
          "url": "https://myanimelist.net/anime/1/"},
        {"name" : "Cowboy Bebop",
          "img_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
           "url": "https://myanimelist.net/anime/1/"},
        {"name" : "Cowboy Bebop",
        "img_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
        "url": "https://myanimelist.net/anime/1/"},
        {"name" : "Cowboy Bebop",
        "img_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
         "url": "https://myanimelist.net/anime/1/"},
    ]
}

  return (
    <div className="App">
      <div className = "banner">
        <h1>MangAlert</h1>
      </div>
      <div className='Category'><h2>Manga</h2></div>
      <div className='Header'>Recently Completed</div>
      <div className='Header'>Completed (Older than the last 3 months)</div>
      <div className = 'grid-container'>
        {mockAnime.anime.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
      <div className='Category'><h2>Anime</h2></div>
      <div className='Header'>Recently Completed</div>
      <div className='Header'>Completed (Older than the last 3 months)</div>
      <div className = 'grid-container'>
        {mockAnime.anime.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
    </div>
  );
}

export default App;