import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SearchBar } from './components/SearchBar';
import { Timeline } from './components/Timeline';
import DataPanel from './components/DataPanel';
import { ComparisonView } from './components/ComparisonView';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { IntegrationsNew } from './components/IntegrationsNew';
import AuthPage from './components/AuthPage';
import { 
  SunIcon, 
  CalendarIcon, 
  FunnelIcon,
  Cog6ToothIcon,
  UserIcon,
  UserPlusIcon,
  PuzzlePieceIcon,
  KeyIcon,
  BellIcon,
  BuildingOfficeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EnvelopeIcon,
  CodeBracketIcon,
  WindowIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { TimelineEvent } from './types/timeline';
import './index.css';
import volkswagenData from './data/volkswagenTimeline.json';
import tomData from './data/tomTimeline.json';

interface ConnectedApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface ConnectedApps {
  [category: string]: ConnectedApp[];
}

const connectedApps: ConnectedApps = {
  "Productivity": [
    {
      id: "salesforce",
      name: "Salesforce",
      icon: <BuildingOfficeIcon className="app-icon" />,
      color: "#00A1E0"
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: <EnvelopeIcon className="app-icon" />,
      color: "#EA4335"
    }
  ],
  "Development": [
    {
      id: "github",
      name: "GitHub",
      icon: <CodeBracketIcon className="app-icon" />,
      color: "#181717"
    },
    {
      id: "jira",
      name: "Jira",
      icon: <WindowIcon className="app-icon" />,
      color: "#0052CC"
    }
  ],
  "Communication": [
    {
      id: "slack",
      name: "Slack",
      icon: <ChatBubbleLeftRightIcon className="app-icon" />,
      color: "#4A154B"
    },
    {
      id: "zoom",
      name: "Zoom",
      icon: <VideoCameraIcon className="app-icon" />,
      color: "#2D8CFF"
    }
  ]
};

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{ item1: string; item2: string } | null>(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [isB2BMode, setIsB2BMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchPanelExpanded, setIsSearchPanelExpanded] = useState(false);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const searchPanelRef = useRef<HTMLDivElement>(null);

  // Load initial data when component mounts
  useEffect(() => {
    handleSearch('', []);
  }, [isB2BMode]); // Add isB2BMode as dependency

  const defaultSuggestions = [
    'iPhone 4 vs iPhone 5',
    'First iPhone Release',
    'iPhone 3G Features',
    'iPhone History Timeline',
    'Latest iPhone Model'
  ];

  // Add preset date ranges
  const datePresets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 3 months', days: 90 },
    { label: 'Last year', days: 365 },
    { label: 'All time', days: 0 }
  ];

  const settingsOptions = [
    { icon: UserIcon, label: 'Login', action: () => navigate('/login') },
    { 
      icon: PuzzlePieceIcon, 
      label: 'Integrations', 
      action: () => navigate('/integrations')
    },
    { icon: KeyIcon, label: 'API Keys', action: () => console.log('API Keys clicked') },
    { icon: BellIcon, label: 'Notifications', action: () => console.log('Notifications clicked') }
  ];

  const handleCompare = (query: string) => {
    if (query.toLowerCase().includes(' vs ') || query.toLowerCase().includes(' versus ')) {
      const [item1, item2] = query.split(/\s+(?:vs|versus)\s+/i);
      setComparison({ item1, item2 });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setIsSearchPanelExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchPanelExpanded(true);
    
    // Load data based on mode
    if (isB2BMode) {
      setEvents(volkswagenData.events);
    } else {
      setEvents(tomData.events);
    }
  };

  const handleAppSelect = (appId: string) => {
    setSelectedApps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days > 0) {
      start.setDate(start.getDate() - days);
    } else {
      // For "All time", set to a past date that covers all events
      start.setFullYear(2000);
    }
    
    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
    
    // Automatically apply the filter
    handleDateFilter(start, end);
  };

  const handleDateFilter = (start: Date, end: Date) => {
    if (start && end) {
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end;
      });
      setEvents(filteredEvents);
    }
  };

  const toggleB2BMode = () => {
    setIsB2BMode(!isB2BMode);
    // The useEffect will handle updating the data
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="logo">
          <CalendarIcon className="logo-icon" />
          <div className="logo-text">
            <span className="logo-title">Timeline {isB2BMode ? 'B2B' : ''}</span>
            <span className="logo-subtitle">Journey Through Time & Stories</span>
          </div>
        </div>
        <div className="search-container">
          <div className="search-section">
            <div className={`search-panel ${isSearchPanelExpanded ? 'expanded' : ''} ${isB2BMode ? 'b2b-mode' : ''}`} ref={searchPanelRef}>
              <div className="search-bar">
                <MagnifyingGlassIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search timelines..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchPanelExpanded(true)}
                />
              </div>
              {isSearchPanelExpanded && (
                <div className="connected-apps-section">
                  <div className="connected-apps-wrapper">
                    <div className="connected-apps-categories">
                      {Object.entries(connectedApps).map(([category, apps]) => (
                        <div key={category} className="app-category">
                          <div className="category-label">{category}</div>
                          <div className="connected-apps-list">
                            {apps.map((app) => (
                              <button
                                key={app.id}
                                className={`app-chip ${
                                  selectedApps.has(app.id) ? "selected" : ""
                                }`}
                                onClick={() => handleAppSelect(app.id)}
                                style={{
                                  "--app-color": app.color,
                                } as React.CSSProperties}
                              >
                                <div className="app-icon">
                                  {app.icon}
                                </div>
                                <span className="app-name">{app.name}</span>
                                {selectedApps.has(app.id) && (
                                  <XMarkIcon className="deselect-icon" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={toggleB2BMode}
            className={`mode-toggle ${isB2BMode ? 'active' : ''}`}
          >
            {isB2BMode ? (
              <>
                <BuildingOfficeIcon className="mode-icon" />
                B2B Mode
              </>
            ) : (
              <>
                <ShoppingCartIcon className="mode-icon" />
                Commercial Mode
              </>
            )}
          </button>
          <button onClick={toggleTheme} className="icon-button">
            <SunIcon className="icon" />
          </button>
          <div className="settings-wrapper">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="icon-button"
            >
              <Cog6ToothIcon className="icon" />
            </button>
            {showSettings && (
              <div className="settings-menu">
                {settingsOptions.map((option, index) => (
                  <button
                    key={index}
                    className="settings-item"
                    onClick={option.action}
                  >
                    <option.icon className="settings-icon" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="banner">
        <div className="banner-content">
          <h1>{isB2BMode ? 'Volkswagen' : 'Tom Cruise'}</h1>
          <p>
            {isB2BMode 
              ? 'Explore Volkswagen Group\'s digital transformation journey and strategic initiatives'
              : 'Explore Tom Cruise\'s legendary career journey from his debut to becoming a Hollywood icon'
            }
          </p>
        </div>
      </div>

      <div className="filters">
        <button 
          className={`filter-button ${showDateRange ? 'active' : ''}`}
          onClick={() => setShowDateRange(!showDateRange)}
        >
          <CalendarIcon className="filter-icon" />
          Date Range
        </button>
        <button className="filter-button">
          <FunnelIcon className="filter-icon" />
          Sort by Relevance
        </button>
      </div>

      <main className="main-content">
        <Timeline events={events} isB2BMode={isB2BMode}>
          <DataPanel />
        </Timeline>
      </main>

      {comparison && (
        <ComparisonView
          item1={comparison.item1}
          item2={comparison.item2}
          onClose={() => setComparison(null)}
        />
      )}

      {showIntegrations && isB2BMode && (
        <IntegrationsNew onClose={() => setShowIntegrations(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/integrations" element={<IntegrationsNew />} />
          <Route path="/auth/:integration" element={<AuthPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
} 