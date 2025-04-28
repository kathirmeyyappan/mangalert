import * as React from 'react';
import './App.css';
import Card from './components/Card'
import EmptyMessage from './components/EmptyMessage';
import SortDropdown from './components/SortDropdown';

function App({ anime, manga }) {
  const [sortType, setSortType] = React.useState('date-desc');

  const sortItems = (items) => {
    if (!items) return { recently_completed: [], other_completed: [] };
    
    const sortedItems = [...items];
    switch (sortType) {
      case 'date-desc':
        sortedItems.sort((a, b) => new Date(b.completed_date) - new Date(a.completed_date));
        break;
      case 'date-asc':
        sortedItems.sort((a, b) => new Date(a.completed_date) - new Date(b.completed_date));
        break;
      case 'alphabetical':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Split into recently completed (last 3 months) and other completed
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    
    return {
      recently_completed: sortedItems.filter(item => new Date(item.completed_date) >= threeMonthsAgo),
      other_completed: sortedItems.filter(item => new Date(item.completed_date) < threeMonthsAgo)
    };
  };

  const sortedAnime = sortItems(anime);
  const sortedManga = sortItems(manga);

  const manga_recent_num = sortedManga.recently_completed.length
  const anime_recent_num = sortedAnime.recently_completed.length
  const manga_fin_num = sortedManga.other_completed.length
  const anime_fin_num = sortedAnime.other_completed.length

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
        <div className="sort-controls">
          <SortDropdown onSortChange={setSortType} />
        </div>
        <div className='Category'><h2>Finished Serialization in the Last 3 Months</h2></div>
        <div className='Header'>Manga (Plan to Read)</div>
        {manga_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {sortedManga.recently_completed.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
        <div className='Header'>Anime (Plan to Watch)</div>
        {anime_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {sortedAnime.recently_completed.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
        <div className='Category'><h2>Finished Serialization (Older Than 3 Months)</h2></div>
        <div className='Header'>Manga (Plan to Read)</div>
        {manga_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {sortedManga.other_completed.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
        <div className='Header'>Anime (Plan to Watch)</div>
        {anime_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className = 'grid-container'>
        {sortedAnime.other_completed.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
      </div>
      <footer class="footer"><p>Created by Uji_Gintoki_Bowl and JLi2021</p>
      <a href = "https://github.com/kathirmeyyappan/mangalert">Github</a></footer>
    </div>
  );
}

export default App;
