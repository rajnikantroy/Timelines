import React, { useState } from 'react';
import { TimelineEvent } from '../types/timeline';
import { ChevronDownIcon, VideoCameraIcon, NewspaperIcon, ChartBarIcon, FilmIcon, TrophyIcon, StarIcon, CurrencyDollarIcon, LinkIcon } from '@heroicons/react/24/outline';

interface TimelineProps {
  events: TimelineEvent[];
  children?: React.ReactNode;
  isB2BMode: boolean;
}

export function Timeline({ events, children, isB2BMode }: TimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(events.map(event => event.id)));
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<string>>>({});

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
      setExpandedSections((prev) => ({ ...prev, [eventId]: new Set() }));
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const toggleSection = (eventId: string, section: 'videos' | 'articles' | 'metrics') => {
    setExpandedSections((prev) => {
      const eventSections = prev[eventId] || new Set();
      const newSections = new Set(eventSections);
      if (newSections.has(section)) {
        newSections.delete(section);
      } else {
        newSections.add(section);
      }
      return { ...prev, [eventId]: newSections };
    });
  };

  const isSectionExpanded = (eventId: string, section: string) => {
    return expandedSections[eventId]?.has(section) || false;
  };

  const formatMetricValue = (value: number | undefined, type: string) => {
    if (value === undefined) return 'N/A';
    if (type === 'boxOffice' || type === 'revenue') {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (type === 'criticalRating' || type === 'audienceRating') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const getMetricIcon = (metricKey: string) => {
    switch (metricKey) {
      case 'films':
        return <FilmIcon className="metric-icon" />;
      case 'awards':
        return <TrophyIcon className="metric-icon" />;
      case 'boxOffice':
        return <CurrencyDollarIcon className="metric-icon" />;
      case 'criticalRating':
      case 'audienceRating':
        return <StarIcon className="metric-icon" />;
      default:
        return <ChartBarIcon className="metric-icon" />;
    }
  };

  const getMetricLabel = (metricKey: string) => {
    switch (metricKey) {
      case 'films':
        return 'Films';
      case 'awards':
        return 'Awards';
      case 'boxOffice':
        return 'Box Office';
      case 'criticalRating':
        return 'Critic Rating';
      case 'audienceRating':
        return 'Audience Rating';
      default:
        return metricKey.replace(/([A-Z])/g, ' $1').trim();
    }
  };

  // Filter events based on B2B mode
  const filteredEvents = events.filter(event => {
    if (isB2BMode) {
      return true; // Show all events in B2B mode
    } else {
      return !event.section.includes('Connected Apps'); // Hide connected apps in commercial mode
    }
  });

  // Group events by section and ensure Introduction, Key Events, and Conclusion order
  const sections = filteredEvents.reduce((acc, event) => {
    let sectionTitle = event.section;
    
    // Map sections to standard names
    if (event.section.toLowerCase().includes('overview') || event.section.toLowerCase().includes('introduction')) {
      sectionTitle = 'Introduction';
    } else if (event.section.toLowerCase().includes('conclusion') || event.section.toLowerCase().includes('summary')) {
      sectionTitle = 'Conclusion';
    } else if (event.section.toLowerCase().includes('key') || event.section.toLowerCase().includes('events')) {
      sectionTitle = 'Key Events';
    }

    if (!acc[sectionTitle]) {
      acc[sectionTitle] = [];
    }
    acc[sectionTitle].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  // Define the order of sections
  const sectionOrder = ['Introduction', 'Key Events', 'Conclusion'];

  const renderVideoSection = (event: TimelineEvent) => {
    if (!event.videos && !event.links) return null;

    return (
      <div className="content-section">
        <button
          className="section-toggle"
          onClick={() => toggleSection(event.id, 'videos')}
        >
          <VideoCameraIcon className="section-icon" />
          Media & Links
          <ChevronDownIcon
            className={`section-chevron ${
              isSectionExpanded(event.id, 'videos') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isSectionExpanded(event.id, 'videos') && (
          <div className="media-content">
            {event.videos && event.videos.length > 0 && (
              <div className="videos-section">
                <h4 className="section-subtitle">
                  <VideoCameraIcon className="section-icon" />
                  Videos
                </h4>
                <div className="video-grid">
                  {event.videos.map((video, idx) => (
                    <a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-card"
                    >
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="video-thumbnail"
                        />
                      )}
                      <div className="video-content">
                        <div className="video-title">{video.title}</div>
                        {video.description && (
                          <div className="video-description">{video.description}</div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {event.links && event.links.length > 0 && (
              <div className="links-section">
                <h4 className="section-subtitle">
                  <LinkIcon className="section-icon" />
                  Related Links
                </h4>
                <div className="links-list">
                  {event.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-item"
                    >
                      <div className="link-content">
                        <span className="link-title">{link.title}</span>
                        <span className="link-url">{link.url}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`timeline ${isB2BMode ? 'b2b-mode' : 'commercial-mode'}`}>
      {sectionOrder.map((sectionTitle) => {
        const sectionEvents = sections[sectionTitle] || [];
        if (sectionEvents.length === 0) return null;

        return (
          <React.Fragment key={sectionTitle}>
            <div className="timeline-section">
              <h2 className="section-title">{sectionTitle}</h2>
              {sectionEvents.map((event) => (
                <div key={event.id} className="timeline-card">
                  <div className="event-header" onClick={() => toggleEvent(event.id)}>
                    <div className="event-date">{event.date}</div>
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-summary">
                      {!expandedEvents.has(event.id) && (
                        <p className="event-description-preview">
                          {event.description.length > 150 
                            ? `${event.description.substring(0, 150)}...` 
                            : event.description}
                        </p>
                      )}
                      {!expandedEvents.has(event.id) && event.metrics && (
                        <div className="metrics-preview">
                          {Object.entries(event.metrics)
                            .filter(([key]) => !isB2BMode ? ['boxOffice', 'awards', 'criticalRating'].includes(key) : ['opportunities', 'leads', 'revenue'].includes(key))
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key} className="metric-preview">
                                {getMetricIcon(key)}
                                <span className="metric-label">{getMetricLabel(key)}:</span>
                                <span className="metric-value">{formatMetricValue(value, key)}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon
                      className={`event-chevron ${
                        expandedEvents.has(event.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {expandedEvents.has(event.id) && (
                    <div className="event-content">
                      {event.status && (
                        <div className="event-status">
                          <span className={`status-badge ${event.status.toLowerCase()}`}>
                            {event.status}
                          </span>
                        </div>
                      )}
                      <p className="event-description">{event.description}</p>
                      
                      {event.metrics && (
                        <div className="content-section">
                          <button
                            className="section-toggle"
                            onClick={() => toggleSection(event.id, 'metrics')}
                          >
                            <ChartBarIcon className="section-icon" />
                            Metrics
                            <ChevronDownIcon
                              className={`section-chevron ${
                                isSectionExpanded(event.id, 'metrics') ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isSectionExpanded(event.id, 'metrics') && (
                            <div className="metrics-grid">
                              {Object.entries(event.metrics).map(([key, value]) => (
                                <div key={key} className="metric-item">
                                  <div className="metric-header">
                                    {getMetricIcon(key)}
                                    <div className="metric-label">{getMetricLabel(key)}</div>
                                  </div>
                                  <div className="metric-value">{formatMetricValue(value, key)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {renderVideoSection(event)}

                      {event.articles && event.articles.length > 0 && (
                        <div className="content-section">
                          <button
                            className="section-toggle"
                            onClick={() => toggleSection(event.id, 'articles')}
                          >
                            <NewspaperIcon className="section-icon" />
                            Articles ({event.articles.length})
                            <ChevronDownIcon
                              className={`section-chevron ${
                                isSectionExpanded(event.id, 'articles') ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isSectionExpanded(event.id, 'articles') && (
                            <div className="articles-list">
                              {event.articles.map((article, idx) => (
                                <a
                                  key={idx}
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="article-card"
                                >
                                  <div className="article-title">{article.title}</div>
                                  <div className="article-source">{article.source}</div>
                                  <div className="article-description">
                                    {article.description}
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {sectionTitle === 'Conclusion' && (
              <div className="timeline-section">
                {children}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 