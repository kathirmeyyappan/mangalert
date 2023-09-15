import * as React from 'react';
import './App.css';
import Card from './components/Card'

function App({ anime, manga }) {
  return (
    <div className="App">
      <div className = "banner">
        <h1>MangAlert</h1>
      </div>
      <div className='Category'><h2>Completed in the Last 3 Months</h2></div>
      <div className='Header'>Manga</div>
      <div className = 'grid-container'>
        {manga.recently_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
      <div className='Header'>Anime</div>
      <div className = 'grid-container'>
        {anime.recently_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
      <div className='Category'><h2>Completed (Older than the last 3 months)</h2></div>
      <div className='Header'>Manga</div>
      <div className = 'grid-container'>
        {manga.other_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
      <div className='Header'>Anime</div>
      <div className = 'grid-container'>
        {anime.other_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}></Card>
        ))}
      </div>
    </div>
  );
}

export default App;
