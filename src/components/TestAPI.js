import React, { useEffect, useState } from 'react';
import { getTrendingMovies, getGenres } from '../services/recommendations';

const TestAPI = () => {
  const [status, setStatus] = useState('Testing API...');
  const [data, setData] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      // Test 1: Fetch genres
      console.log('Test 1: Fetching genres...');
      const genres = await getGenres();
      console.log('Genres result:', genres);
      
      if (genres && genres.length > 0) {
        setStatus('✅ API is working! Genres fetched successfully.');
        setData(genres);
      } else {
        setStatus('❌ API returned no data');
      }
      
      // Test 2: Fetch trending movies
      console.log('Test 2: Fetching trending movies...');
      const trending = await getTrendingMovies();
      console.log('Trending result:', trending);
      
    } catch (error) {
      console.error('API Test Failed:', error);
      setStatus(`❌ API Test Failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>API Test Status</h2>
      <p>{status}</p>
      {data && (
        <div>
          <h3>Sample Data:</h3>
          <pre style={{ background: '#333', padding: '1rem', borderRadius: '8px' }}>
            {JSON.stringify(data.slice(0, 3), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;