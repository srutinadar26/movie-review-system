/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { discoverMovies } from '../services/api';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './LanguageMovies.css';

// Language data
const LANGUAGE_DATA = {
  en: { name: 'English', native: 'English', flag: '🇬🇧', color: '#1e3c72' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', color: '#ff9933' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸', color: '#aa151b' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷', color: '#0055a4' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪', color: '#000000' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹', color: '#009246' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵', color: '#bc002d' },
  ko: { name: 'Korean', native: '한국어', flag: '🇰🇷', color: '#003478' },
  zh: { name: 'Chinese', native: '中文', flag: '🇨🇳', color: '#de2910' },
  ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺', color: '#d52b1e' },
  ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', color: '#8B0000' },
  te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', color: '#FFD700' },
  ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', color: '#228B22' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', color: '#FF4500' },
  bn: { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', color: '#20B2AA' },
  mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳', color: '#800080' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', color: '#FF69B4' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', color: '#DAA520' },
  ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦', color: '#006c35' },
  tr: { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', color: '#e30a17' },
  th: { name: 'Thai', native: 'ไทย', flag: '🇹🇭', color: '#2d2a4b' },
  vi: { name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', color: '#da251d' },
};

const LanguageMovies = () => {
  const { langCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  const language = LANGUAGE_DATA[langCode] || {
    name: langCode.toUpperCase(),
    native: langCode,
    flag: '🌐',
    color: '#e50914'
  };

  useEffect(() => {
    loadFavorites();
    loadMovies();
  }, [langCode, currentPage, sortBy]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      
      const filters = {
        language: langCode,
        sort_by: sortBy
      };
      
      const data = await discoverMovies(filters, currentPage);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading && movies.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="language-movies-page">
      {/* Language Header */}
      <div className="language-header" style={{ borderBottom: `4px solid ${language.color}` }}>
        <div className="language-header-content">
          <div className="language-flag-large">{language.flag}</div>
          <div className="language-title">
            <h1>{language.name} Movies</h1>
            <p className="language-native">{language.native}</p>
            <div className="language-stats">
              <span className="movie-count-badge">
                {totalPages * 20}+ Movies Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="movies-controls">
        <div className="sort-options">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Newest First</option>
            <option value="release_date.asc">Oldest First</option>
            <option value="title.asc">Title A-Z</option>
          </select>
        </div>
        <div className="results-info">
          Showing page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAddToFavorites={handleAddToFavorites}
              isFavorite={favorites.some(fav => fav.id === movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="no-movies">
          <p>No movies found in {language.name}</p>
          <p>Try checking other languages</p>
          <Link to="/languages" className="browse-languages-btn">
            Browse All Languages
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageMovies;