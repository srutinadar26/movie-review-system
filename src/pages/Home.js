/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getNowPlayingMovies
} from '../services/api';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State for different movie categories
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  
  // Pagination states
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  
  const [popularTotalPages, setPopularTotalPages] = useState(1);
  const [topRatedTotalPages, setTopRatedTotalPages] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
    loadAllMovies();
  }, []);

  // Auto-rotate hero carousel
  useEffect(() => {
    if (heroMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroMovies]);

  // Load movies when page changes
  useEffect(() => {
    if (!loading) loadPopularMovies();
  }, [popularPage]);

  useEffect(() => {
    if (!loading) loadTopRatedMovies();
  }, [topRatedPage]);

  useEffect(() => {
    if (!loading) loadUpcomingMovies();
  }, [upcomingPage]);

  const loadAllMovies = async () => {
    setLoading(true);
    await Promise.all([
      loadHeroMovies(),
      loadPopularMovies(),
      loadTopRatedMovies(),
      loadUpcomingMovies()
    ]);
    setLoading(false);
  };

  const loadHeroMovies = async () => {
    try {
      // Get now playing movies for hero section
      const nowPlaying = await getNowPlayingMovies(1);
      // Get popular movies to mix in
      const popular = await getPopularMovies(1);
      
      // Combine and select top 10 trending Hollywood movies
      const combined = [...nowPlaying.results, ...popular.results]
        .filter(movie => movie.original_language === 'en') // English/Hollywood movies
        .reduce((unique, movie) => {
          // Remove duplicates
          if (!unique.some(m => m.id === movie.id)) {
            unique.push(movie);
          }
          return unique;
        }, [])
        .slice(0, 10); // Take top 10
      
      setHeroMovies(combined);
    } catch (error) {
      console.error('Error loading hero movies:', error);
    }
  };

  const loadPopularMovies = async () => {
    try {
      const data = await getPopularMovies(popularPage);
      setPopularMovies(data.results);
      setPopularTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error loading popular movies:', error);
    }
  };

  const loadTopRatedMovies = async () => {
    try {
      const data = await getTopRatedMovies(topRatedPage);
      setTopRatedMovies(data.results);
      setTopRatedTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error loading top rated movies:', error);
    }
  };

  const loadUpcomingMovies = async () => {
    try {
      const data = await getUpcomingMovies(upcomingPage);
      setUpcomingMovies(data.results);
      setUpcomingTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error loading upcoming movies:', error);
    }
  };

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

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading your movie experience...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Carousel - Like Amazon Prime Video */}
      {heroMovies.length > 0 && (
        <div className="hero-carousel">
          <div className="carousel-container">
            {heroMovies.map((movie, index) => (
              <div
                key={movie.id}
                className={`carousel-slide ${index === currentHeroIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), 
                  url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}
              >
                <div className="slide-content">
                  <span className="movie-badge">🔥 Trending in Hollywood</span>
                  <h2 className="movie-title">{movie.title}</h2>
                  <p className="movie-overview">{movie.overview}</p>
                  <div className="movie-meta">
                    <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                    <span className="year">{movie.release_date?.split('-')[0]}</span>
                  </div>
                  <div className="slide-buttons">
                    <button 
                      className="play-btn"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      ▶ Watch Now
                    </button>
                    <button 
                      className="info-btn"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      ℹ More Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="carousel-arrow prev" onClick={prevHero}>‹</button>
          <button className="carousel-arrow next" onClick={nextHero}>›</button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {heroMovies.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentHeroIndex ? 'active' : ''}`}
                onClick={() => setCurrentHeroIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Movie Rows with Pagination */}
      <div className="movie-rows">
        {/* Popular Movies Row */}
        <MovieRow 
          title="Popular Movies"
          movies={popularMovies}
          currentPage={popularPage}
          totalPages={popularTotalPages}
          onPageChange={setPopularPage}
          onMovieClick={handleMovieClick}
          onFavorite={handleAddToFavorites}
          favorites={favorites}
        />

        {/* Top Rated Row */}
        <MovieRow 
          title="Top Rated"
          movies={topRatedMovies}
          currentPage={topRatedPage}
          totalPages={topRatedTotalPages}
          onPageChange={setTopRatedPage}
          onMovieClick={handleMovieClick}
          onFavorite={handleAddToFavorites}
          favorites={favorites}
        />

        {/* Coming Soon Row */}
        <MovieRow 
          title="Coming Soon"
          movies={upcomingMovies}
          currentPage={upcomingPage}
          totalPages={upcomingTotalPages}
          onPageChange={setUpcomingPage}
          onMovieClick={handleMovieClick}
          onFavorite={handleAddToFavorites}
          favorites={favorites}
        />
      </div>
    </div>
  );
};

// Movie Row Component with Pagination
const MovieRow = ({ title, movies, currentPage, totalPages, onPageChange, onMovieClick, onFavorite, favorites }) => {
  return (
    <div className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-pagination">
          <button 
            className="page-btn prev"
            onClick={() => onPageChange(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="page-btn next"
            onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
      
      <div className="row-content">
        {movies.slice(0, 5).map((movie) => (
          <div 
            key={movie.id} 
            className="movie-card-container"
            onClick={() => onMovieClick(movie.id)}
          >
            <MovieCard
              movie={movie}
              onAddToFavorites={onFavorite}
              isFavorite={favorites.some(fav => fav.id === movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;