import axios from 'axios';

const API_KEY = '8df1a16f7f310b78a1c9e977430bef71';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

// ADD THIS - Get Top Rated Movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

// ADD THIS - Get Upcoming Movies
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// ADD THIS - Get Now Playing Movies
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieTrailers = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`, {
      params: {
        region: 'US',
        language: 'en-US',
      },
    });
    
    const videos = response.data.results;
    
    const trailers = videos.filter(
      video => 
        video.site === 'YouTube' && 
        (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    return trailers;
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return [];
  }
};

export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : '/placeholder-image.jpg';
};

// Discover movies with filters
export const discoverMovies = async (filters = {}, page = 1) => {
  try {
    const params = {
      page,
      sort_by: filters.sort_by || 'popularity.desc',
      include_adult: false,
      include_video: false,
    };

    if (filters.language) {
      params.with_original_language = filters.language;
    }

    if (filters.country) {
      if (filters.filterType === 'origin') {
        params.with_origin_country = filters.country;
      } else {
        params.region = filters.country;
      }
    }

    if (filters.year) {
      params.primary_release_year = filters.year;
    }

    if (filters.genre) {
      params.with_genres = filters.genre;
    }

    console.log('Discover params:', params);

    const response = await api.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};

export const getProductionCountries = async () => {
  try {
    return [
      { iso_3166_1: 'US', english_name: 'United States' },
      { iso_3166_1: 'GB', english_name: 'United Kingdom' },
      { iso_3166_1: 'IN', english_name: 'India' },
      { iso_3166_1: 'CA', english_name: 'Canada' },
      { iso_3166_1: 'AU', english_name: 'Australia' },
      { iso_3166_1: 'FR', english_name: 'France' },
      { iso_3166_1: 'DE', english_name: 'Germany' },
      { iso_3166_1: 'IT', english_name: 'Italy' },
      { iso_3166_1: 'ES', english_name: 'Spain' },
      { iso_3166_1: 'JP', english_name: 'Japan' },
      { iso_3166_1: 'KR', english_name: 'South Korea' },
      { iso_3166_1: 'CN', english_name: 'China' },
      { iso_3166_1: 'RU', english_name: 'Russia' },
      { iso_3166_1: 'BR', english_name: 'Brazil' },
      { iso_3166_1: 'MX', english_name: 'Mexico' }
    ];
  } catch (error) {
    console.error('Error getting countries:', error);
    return [];
  }
};

export const getSpokenLanguages = async () => {
  try {
    const response = await api.get('/configuration/languages');
    return response.data;
  } catch (error) {
    console.error('Error getting languages:', error);
    return [];
  }
};