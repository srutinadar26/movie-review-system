import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { discoverMovies } from '../services/api';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './FilterMovies.css';

// Language options
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'pt', name: 'Portuguese' },
];

// Genre options
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// Year options (last 50 years)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i);

// Sort options
const SORT_OPTIONS = [
  { value: 'popularity.desc', name: 'Most Popular' },
  { value: 'vote_average.desc', name: 'Top Rated' },
  { value: 'release_date.desc', name: 'Newest First' },
  { value: 'release_date.asc', name: 'Oldest First' },
  { value: 'title.asc', name: 'Title A-Z' },
  { value: 'vote_count.desc', name: 'Most Voted' },
];

const FilterMovies = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (selectedLanguage || selectedGenre || selectedYear) {
      searchMovies();
    }
  }, [currentPage]);

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

  const searchMovies = async () => {
    setLoading(true);
    
    const filters = {
      language: selectedLanguage,
      genre: selectedGenre,
      year: selectedYear,
      sort_by: selectedSort
    };

    try {
      const data = await discoverMovies(filters, currentPage);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
    } catch (error) {
      console.error('Error filtering movies:', error);
      toast.error('Failed to filter movies');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchMovies();
  };

  const handleClearFilters = () => {
    setSelectedLanguage('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedSort('popularity.desc');
    setMovies([]);
    setTotalResults(0);
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedLanguage) count++;
    if (selectedGenre) count++;
    if (selectedYear) count++;
    return count;
  };

  return (
    <div className="filter-page">
      <div className="filter-header">
        <h1>🎯 Filter Movies</h1>
        <p>Find the perfect movie with advanced filters</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => setShowFilters(!showFilters)}>
          <h2>Filter Options</h2>
          <div className="filter-header-right">
            {getActiveFilterCount() > 0 && (
              <span className="active-filter-badge">{getActiveFilterCount()} active</span>
            )}
            <button className="toggle-filters-btn">
              {showFilters ? '−' : '+'}
            </button>
          </div>
        </div>

        {showFilters && (
          <form onSubmit={handleApplyFilters} className="filter-form">
            <div className="filter-grid">
              {/* Language Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">🌐</span>
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">🎬</span>
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {GENRES.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">📅</span>
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {YEARS.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">⚡</span>
                  Sort By
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="apply-filters-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
              <button type="button" className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Results Info */}
      {totalResults > 0 && (
        <div className="results-info">
          Found <span>{totalResults.toLocaleString()}</span> movies
          {selectedLanguage && ` in ${LANGUAGES.find(l => l.code === selectedLanguage)?.name}`}
          {selectedGenre && ` • ${GENRES.find(g => g.id === parseInt(selectedGenre))?.name}`}
          {selectedYear && ` • ${selectedYear}`}
        </div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="filter-loading">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <span className="no-results-icon">🎬</span>
                <h3>No movies found</h3>
                <p>Try adjusting your filters to find more movies</p>
                {(selectedLanguage || selectedGenre || selectedYear) && (
                  <button onClick={handleClearFilters} className="clear-all-btn">
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterMovies;