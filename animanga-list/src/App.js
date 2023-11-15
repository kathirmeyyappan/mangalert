import * as React from 'react';
import './App.css';
import Card from './components/Card'
import EmptyMessage from './components/EmptyMessage';

function App({ anime, manga }) {

  const manga_recent_num = manga.recently_completed.length
  const anime_recent_num = anime.recently_completed.length
  const manga_fin_num = manga.other_completed.length
  const anime_fin_num = manga.other_completed.length
  console.log(manga_recent_num)

  return (
    <div className="App">
      <div className = "banner">
        <a className = "homeLink" href = "/" ><h1>MangAlert!</h1></a>
      </div>
      <div className='intro-box'>
        <div className='intro-message'>
        Thank you for visiting MangAlert! If you prefer binging to consuming content weekly, 
        this is great for you! Below are all of the anime and manga in your plan-to-watch 
        and plan-to-read lists that are no longer airing/serializing. Hover over them to see when 
        they ended. 
        </div>
      </div>
      <div className='box-container-list'>
        <div className='Category'><h2>Finished Serialization in the Last 3 Months</h2></div>
        <div className='Header'>Manga (Plan to Read)</div>
        {manga_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {manga.recently_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}
          completeDate={item.completed_date}></Card>
        ))}
      </div>)}
        <div className='Header'>Anime (Plan to Watch)</div>
        {anime_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {anime.recently_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}
          completeDate={item.completed_date}></Card>
        ))}
      </div>)}
        <div className='Category'><h2>Finished Serialization (Older Than 3 Months)</h2></div>
        <div className='Header'>Manga (Plan to Read)</div>
        {manga_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {manga.other_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}
          completeDate={item.completed_date}></Card>
        ))}
      </div>)}
        <div className='Header'>Anime (Plan to Watch)</div>
        {anime_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {anime.other_completed.map((item) => (
          <Card animeName={item.name} 
          imageURL={item.img_url}
          animeURL={item.url}
          completeDate={item.completed_date}></Card>
        ))}
      </div>)}
      </div>
      <footer class="footer"><p>Created by Uji_Gintoki_Bowl and JLi2021</p>
      <a href = "https://github.com/kathirmeyyappan/mangalert">Github</a></footer>
    </div>
  );
}

export default App;
