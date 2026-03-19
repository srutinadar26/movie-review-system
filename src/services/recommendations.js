import { getPopularMovies } from './api';

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    console.log('Fetching movies for genre ID:', genreId); // Debug log
    
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=8df1a16f7f310b78a1c9e977430bef71&with_genres=${genreId}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Genre movies fetched:', data.results?.length || 0); // Debug log
    return data.results || [];
  } catch (error) {
    console.error('Error getting movies by genre:', error);
    return [];
  }
};

// Get personalized recommendations
export const getPersonalizedRecommendations = async (favoriteMovies = [], favoriteGenres = []) => {
  try {
    console.log('Getting recommendations with favorites:', favoriteMovies.length);
    
    let recommendations = [];

    // If user has favorite movies, find similar ones
    if (favoriteMovies.length > 0) {
      const similarPromises = favoriteMovies.slice(0, 3).map(movie => 
        getSimilarMovies(movie.id)
      );
      const similarResults = await Promise.all(similarPromises);
      recommendations = [...recommendations, ...similarResults.flat()];
    }

    // If user has favorite genres, get popular movies from those genres
    if (favoriteGenres.length > 0) {
      const genrePromises = favoriteGenres.slice(0, 3).map(genreId =>
        getMoviesByGenre(genreId)
      );
      const genreResults = await Promise.all(genrePromises);
      recommendations = [...recommendations, ...genreResults.flat()];
    }

    // If no preferences, return popular movies
    if (recommendations.length === 0) {
      console.log('No preferences, fetching popular movies');
      const popular = await getPopularMovies();
      recommendations = popular.results;
    }

    // Remove duplicates and limit to 20
    const unique = removeDuplicates(recommendations);
    console.log('Final recommendations count:', unique.length);
    return unique.slice(0, 20);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Get similar movies
export const getSimilarMovies = async (movieId) => {
  try {
    console.log('Fetching similar movies for ID:', movieId);
    
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=8df1a16f7f310b78a1c9e977430bef71`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error getting similar movies:', error);
    return [];
  }
};

// Get trending movies
export const getTrendingMovies = async (timeWindow = 'week') => {
  try {
    console.log('Fetching trending movies');
    
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=8df1a16f7f310b78a1c9e977430bef71`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Trending movies fetched:', data.results?.length || 0);
    return data.results || [];
  } catch (error) {
    console.error('Error getting trending movies:', error);
    return [];
  }
};

// Get upcoming movies
export const getUpcomingMovies = async () => {
  try {
    console.log('Fetching upcoming movies');
    
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=8df1a16f7f310b78a1c9e977430bef71`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upcoming movies fetched:', data.results?.length || 0);
    return data.results || [];
  } catch (error) {
    console.error('Error getting upcoming movies:', error);
    return [];
  }
};

// Get top rated movies
export const getTopRatedMovies = async () => {
  try {
    console.log('Fetching top rated movies');
    
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=8df1a16f7f310b78a1c9e977430bef71`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Top rated movies fetched:', data.results?.length || 0);
    return data.results || [];
  } catch (error) {
    console.error('Error getting top rated movies:', error);
    return [];
  }
};

// Get genre list
export const getGenres = async () => {
  try {
    console.log('Fetching genres');
    
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=8df1a16f7f310b78a1c9e977430bef71`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Genres fetched:', data.genres?.length || 0);
    return data.genres || [];
  } catch (error) {
    console.error('Error getting genres:', error);
    return [];
  }
};

// Helper: Remove duplicate movies
const removeDuplicates = (movies) => {
  const seen = new Set();
  return movies.filter(movie => {
    const duplicate = seen.has(movie.id);
    seen.add(movie.id);
    return !duplicate;
  });
};