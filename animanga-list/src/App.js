import * as React from 'react';
import './App.css';
import Card from './components/Card'
import EmptyMessage from './components/EmptyMessage';
import SortDropdown from './components/SortDropdown';
import LoadingScreen from './components/LoadingScreen';

function App({ anime, manga }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [recentSortType, setRecentSortType] = React.useState('date-desc');
  const [olderSortType, setOlderSortType] = React.useState('date-desc');

  React.useEffect(() => {
    // Simulate minimum loading time of 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const sortItems = (items, sortType) => {
    if (!items) return [];
    
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
    return sortedItems;
  };

  const sortedRecentAnime = sortItems(anime?.recently_completed || [], recentSortType);
  const sortedRecentManga = sortItems(manga?.recently_completed || [], recentSortType);
  const sortedOlderAnime = sortItems(anime?.other_completed || [], olderSortType);
  const sortedOlderManga = sortItems(manga?.other_completed || [], olderSortType);

  const manga_recent_num = sortedRecentManga.length;
  const anime_recent_num = sortedRecentAnime.length;
  const manga_fin_num = sortedOlderManga.length;
  const anime_fin_num = sortedOlderAnime.length;

  return (
    <div className="App">
      <div className="banner">
        <a className="homeLink" href="/"><h1>MangAlert!</h1></a>
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
        <div className='Header'>
          <span>Manga (Plan to Read)</span>
          <SortDropdown onSortChange={setRecentSortType} section="Recent" />
        </div>
        {manga_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className='grid-container'>
        {sortedRecentManga.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
        <div className='Header'>
          <span>Anime (Plan to Watch)</span>
          <SortDropdown onSortChange={setRecentSortType} section="Recent" />
        </div>
        {anime_recent_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className='grid-container'>
        {sortedRecentAnime.map((item) => (
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
        <div className='Header'>
          <span>Manga (Plan to Read)</span>
          <SortDropdown onSortChange={setOlderSortType} section="Older" />
        </div>
        {manga_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className='grid-container'>
        {sortedOlderManga.map((item) => (
          <Card 
            key={item.name}
            animeName={item.name} 
            imageURL={item.img_url}
            animeURL={item.url}
            completeDate={item.completed_date}
          />
        ))}
      </div>)}
        <div className='Header'>
          <span>Anime (Plan to Watch)</span>
          <SortDropdown onSortChange={setOlderSortType} section="Older" />
        </div>
        {anime_fin_num == 0 ? (<EmptyMessage></EmptyMessage>)
        :( <div className='grid-container'>
        {sortedOlderAnime.map((item) => (
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
      <footer className="footer">
        <p>Created by Uji_Gintoki_Bowl and JLi2021</p>
        <a href="https://github.com/kathirmeyyappan/mangalert">Github</a>
      </footer>
    </div>
  );
}

export default App;
