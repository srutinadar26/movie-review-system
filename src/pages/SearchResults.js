import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';
import { getFavorites, addToFavorites, removeFromFavorites } from '../utils/storage';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      performSearch();
    }
    loadFavorites();
  }, [query, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const data = await searchMovies(query, currentPage);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to search movies.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  const handleAddToFavorites = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
    loadFavorites();
  };

  if (loading) return <div className="loading">Searching...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      
      {movies.length === 0 ? (
        <div className="no-results">
          <p>No movies found. Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="results-grid">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
              />
            ))}
          </div>

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
      )}
    </div>
  );
};

export default SearchResults;