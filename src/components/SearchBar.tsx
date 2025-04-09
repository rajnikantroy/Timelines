import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import {
  CloudIcon,
  EnvelopeIcon,
  CommandLineIcon,
  CircleStackIcon,
  WindowIcon,
  CodeBracketIcon,
  SwatchIcon,
  ChatBubbleLeftRightIcon,
  HashtagIcon,
  VideoCameraIcon,
  UserGroupIcon,
  LinkIcon,
  ChatBubbleOvalLeftIcon,
  PhoneIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/solid';

interface ConnectedApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  connectedApps: ConnectedApp[];
  onAppSelect: (app: string) => void;
  isB2BMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, connectedApps, onAppSelect, isB2BMode = false }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-panel" ref={searchRef}>
      <form onSubmit={handleSearch} className={`search-bar ${isFocused ? 'focused' : ''}`}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={isB2BMode ? "Search across your connected apps..." : "Search for anything..."}
          className="search-input"
        />
        {query && (
          <button type="button" onClick={handleClear} className="clear-button">
            <X size={16} />
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isB2BMode && isFocused && connectedApps.length > 0 && (
        <div className="connected-apps-section">
          <div className="connected-apps-wrapper">
            <h3 className="connected-apps-title">Connected Apps</h3>
            <div className="connected-apps-grid">
              {connectedApps.map((app) => (
                <button
                  key={app.id}
                  className="connected-app-button"
                  onClick={() => {
                    onAppSelect(app.id);
                    setIsFocused(false);
                  }}
                  style={{
                    '--app-color': app.color,
                    borderColor: app.color
                  } as React.CSSProperties}
                >
                  <span className="app-name">
                    <span className="app-icon" style={{ color: app.color }}>
                      {app.icon}
                    </span>
                    {app.name}
                  </span>
                  <ChevronDown size={16} className="app-arrow" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 