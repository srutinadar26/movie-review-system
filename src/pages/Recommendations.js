import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { 
  getPersonalizedRecommendations, 
  getTrendingMovies, 
  getUpcomingMovies,
  getTopRatedMovies,
  getGenres,
  getMoviesByGenre
} from '../services/recommendations';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/storage';
import toast from 'react-hot-toast';
import './Recommendations.css';

const Recommendations = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState({
    recommendations: true,
    trending: true,
    upcoming: true,
    topRated: true,
    genre: false
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      toast.error('Please login to get personalized recommendations');
      navigate('/login');
      return;
    }
    loadAllData();
    loadFavorites();
  }, [currentUser, navigate]);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleAddToFavorites = (movie) => {
    if (!currentUser) {
      toast.error('Please login to add to favorites');
      navigate('/login');
      return;
    }
    
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    if (isFavorite) {
      removeFromFavorites(movie.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(movie);
      toast.success('Added to favorites');
    }
    loadFavorites();
  };

  const loadAllData = async () => {
    // Get user's favorite movies
    const userFavorites = getFavorites();
    
    // Get personalized recommendations
    const recs = await getPersonalizedRecommendations(userFavorites, []);
    setRecommendations(recs);
    setLoading(prev => ({ ...prev, recommendations: false }));

    // Get trending movies
    const trendingMovies = await getTrendingMovies();
    setTrending(trendingMovies);
    setLoading(prev => ({ ...prev, trending: false }));

    // Get upcoming movies
    const upcomingMovies = await getUpcomingMovies();
    setUpcoming(upcomingMovies);
    setLoading(prev => ({ ...prev, upcoming: false }));

    // Get top rated movies
    const topRatedMovies = await getTopRatedMovies();
    setTopRated(topRatedMovies);
    setLoading(prev => ({ ...prev, topRated: false }));

    // Get genres
    const genreList = await getGenres();
    setGenres(genreList);
  };

  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    setLoading(prev => ({ ...prev, genre: true }));
    
    // Fetch movies for selected genre
    const movies = await getMoviesByGenre(genreId);
    setGenreMovies(movies);
    setLoading(prev => ({ ...prev, genre: false }));
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  if (Object.values(loading).every(v => !v) && recommendations.length === 0 && trending.length === 0) {
    return (
      <div className="recommendations">
        <h1>Movie Recommendations</h1>
        <div className="empty-state">
          <p>No recommendations available right now.</p>
          <p>Check back later or browse movies to get personalized suggestions!</p>
          <button 
            className="browse-movies-btn"
            onClick={() => navigate('/')}
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <h1>🎬 Movie Recommendations</h1>
      
      {currentUser && (
        <div className="welcome-message">
          <h2>Welcome back, {currentUser.displayName || 'Movie Fan'}!</h2>
          <p>Here are some movies we think you'll love</p>
        </div>
      )}

      {/* Personalized Recommendations */}
      {!loading.recommendations && recommendations.length > 0 && (
        <section className="recommendation-section">
          <h2>✨ Personalized For You</h2>
          <div className="movies-grid">
            {recommendations.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Movies */}
      {!loading.trending && trending.length > 0 && (
        <section className="recommendation-section">
          <h2>🔥 Trending This Week</h2>
          <div className="movies-grid">
            {trending.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Genre Explorer */}
      {genres.length > 0 && (
        <section className="genre-section">
          <h2>🎯 Explore by Genre</h2>
          <div className="genre-buttons">
            {genres.map(genre => (
              <button
                key={genre.id}
                className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
          
          {selectedGenre && !loading.genre && genreMovies.length > 0 && (
            <div className="genre-movies">
              <h3>Popular in {genres.find(g => g.id === selectedGenre)?.name}</h3>
              <div className="movies-grid">
                {genreMovies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie}
                    onAddToFavorites={handleAddToFavorites}
                    isFavorite={favorites.some(fav => fav.id === movie.id)}
                  />
                ))}
              </div>
            </div>
          )}
          {selectedGenre && loading.genre && (
            <div className="genre-loading">
              <LoadingSpinner />
            </div>
          )}
        </section>
      )}

      {/* Upcoming Movies */}
      {!loading.upcoming && upcoming.length > 0 && (
        <section className="recommendation-section">
          <h2>📅 Coming Soon</h2>
          <div className="movies-grid">
            {upcoming.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated */}
      {!loading.topRated && topRated.length > 0 && (
        <section className="recommendation-section">
          <h2>⭐ Top Rated of All Time</h2>
          <div className="movies-grid">
            {topRated.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Recommendations;