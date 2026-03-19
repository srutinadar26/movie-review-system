import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Languages.css';

// Language data with color themes
const LANGUAGES = [
  // Top Languages
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', color: 'blue', movies: 15000 },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', color: 'orange', movies: 8000 },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', color: 'red', movies: 7000 },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', color: 'blue', movies: 6000 },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', color: 'gold', movies: 5000 },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', color: 'green', movies: 4500 },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', color: 'red', movies: 8000 },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', color: 'blue', movies: 6000 },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', color: 'red', movies: 10000 },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', color: 'red', movies: 5500 },
  
  // Indian Languages
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', color: 'maroon', movies: 5000 },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', color: 'gold', movies: 4500 },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', color: 'green', movies: 3500 },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', color: 'orange', movies: 3000 },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', color: 'teal', movies: 4000 },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', color: 'purple', movies: 3000 },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', color: 'pink', movies: 2500 },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', color: 'gold', movies: 3000 },
  
  // Other Languages
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', color: 'green', movies: 4000 },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', color: 'green', movies: 5000 },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', color: 'red', movies: 4000 },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', color: 'blue', movies: 3000 },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', color: 'red', movies: 2500 },
];

const Languages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredLanguages = LANGUAGES.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lang.native.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedRegion === 'all') return matchesSearch;
    if (selectedRegion === 'indian') return matchesSearch && ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa'].includes(lang.code);
    if (selectedRegion === 'european') return matchesSearch && ['en', 'es', 'fr', 'de', 'it', 'pt'].includes(lang.code);
    if (selectedRegion === 'asian') return matchesSearch && ['ja', 'ko', 'zh', 'th', 'vi'].includes(lang.code);
    if (selectedRegion === 'middleeast') return matchesSearch && ['ar', 'tr'].includes(lang.code);
    return matchesSearch;
  });

  // Group languages by region
  const languagesByRegion = {
    'Popular Languages': filteredLanguages.filter(l => ['en', 'hi', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ru'].includes(l.code)),
    'Indian Languages': filteredLanguages.filter(l => ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa'].includes(l.code)),
    'European Languages': filteredLanguages.filter(l => ['en', 'es', 'fr', 'de', 'it', 'pt'].includes(l.code)),
    'Asian Languages': filteredLanguages.filter(l => ['ja', 'ko', 'zh', 'th', 'vi'].includes(l.code)),
    'Middle Eastern': filteredLanguages.filter(l => ['ar', 'tr'].includes(l.code)),
  };

  return (
    <div className="languages-page">
      {/* Hero Section */}
      <div className="languages-hero">
        <h1>Languages</h1>
        <p>Explore movies in your preferred language</p>
        
        {/* Search Bar */}
        <div className="language-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for a language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Region Filters - Netflix Row */}
        <div className="region-filters">
          <button 
            className={`region-btn ${selectedRegion === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('all')}
          >
            All
          </button>
          <button 
            className={`region-btn ${selectedRegion === 'indian' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('indian')}
          >
            Indian
          </button>
          <button 
            className={`region-btn ${selectedRegion === 'european' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('european')}
          >
            European
          </button>
          <button 
            className={`region-btn ${selectedRegion === 'asian' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('asian')}
          >
            Asian
          </button>
          <button 
            className={`region-btn ${selectedRegion === 'middleeast' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('middleeast')}
          >
            Middle East
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        <span>{filteredLanguages.length} languages</span> available
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Language Sections */}
      {Object.entries(languagesByRegion).map(([region, languages]) => 
        languages.length > 0 && (
          <div key={region} className="language-section">
            <h2 className="region-title">{region}</h2>
            <div className="languages-grid">
              {languages.map(language => (
                <Link 
                  to={`/language/${language.code}`} 
                  key={language.code}
                  className="language-card"
                  data-color={language.color}
                >
                  <div className="language-card-content">
                    <span className="language-flag">{language.flag}</span>
                    <h3 className="language-name">{language.name}</h3>
                    <p className="language-native">{language.native}</p>
                    <span className="language-badge">{language.movies}+ Movies</span>
                    <span className="play-overlay">▶</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      )}

      {/* No Results */}
      {filteredLanguages.length === 0 && (
        <div className="no-languages">
          <div className="no-languages-content">
            <span className="no-languages-icon">🔍</span>
            <h3>No languages found</h3>
            <p>Try a different search term</p>
            <button 
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Fun Fact */}
      <div className="language-fun-fact">
        <h3>Did you know?</h3>
        <p>Indian cinema produces movies in over 20 languages, with Bollywood (Hindi) being the largest film industry in the world by the number of films produced!</p>
      </div>
    </div>
  );
};

export default Languages;