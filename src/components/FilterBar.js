import React, { useState, useEffect } from 'react';
import './FilterBar.css';

// Language options (ISO 639-1 codes)
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
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' }
];

// Country options (ISO 3166-1 codes)
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' }
];

const FilterBar = ({ onFilterChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filterType, setFilterType] = useState('origin'); // 'origin' or 'release'

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    onFilterChange({
      language,
      country: selectedCountry,
      filterType
    });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    onFilterChange({
      language: selectedLanguage,
      country,
      filterType
    });
  };

  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    onFilterChange({
      language: selectedLanguage,
      country: selectedCountry,
      filterType: type
    });
  };

  const handleClearFilters = () => {
    setSelectedLanguage('');
    setSelectedCountry('');
    setFilterType('origin');
    onFilterChange({
      language: '',
      country: '',
      filterType: 'origin'
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h3>🎯 Filter Movies</h3>
        {(selectedLanguage || selectedCountry) && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>

      <div className="filter-options">
        {/* Language Filter */}
        <div className="filter-group">
          <label htmlFor="language-filter">
            <span className="filter-icon">🌐</span> Language
          </label>
          <select
            id="language-filter"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="filter-select"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Type Selection */}
        <div className="filter-group">
          <label htmlFor="filter-type">
            <span className="filter-icon">🎬</span> Filter By
          </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={handleFilterTypeChange}
            className="filter-select"
          >
            <option value="origin">Country of Origin</option>
            <option value="release">Released In Country</option>
          </select>
        </div>

        {/* Country Filter */}
        <div className="filter-group">
          <label htmlFor="country-filter">
            <span className="filter-icon">📍</span> Country
          </label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="filter-select"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedLanguage || selectedCountry) && (
        <div className="active-filters">
          <span className="active-filters-label">Active Filters:</span>
          {selectedLanguage && (
            <span className="filter-tag">
              {LANGUAGES.find(l => l.code === selectedLanguage)?.name || selectedLanguage}
              <button onClick={() => {
                setSelectedLanguage('');
                onFilterChange({
                  language: '',
                  country: selectedCountry,
                  filterType
                });
              }}>✕</button>
            </span>
          )}
          {selectedCountry && (
            <span className="filter-tag">
              {filterType === 'origin' ? 'Origin: ' : 'Released in: '}
              {COUNTRIES.find(c => c.code === selectedCountry)?.name || selectedCountry}
              <button onClick={() => {
                setSelectedCountry('');
                onFilterChange({
                  language: selectedLanguage,
                  country: '',
                  filterType
                });
              }}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;