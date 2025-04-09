import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import './IntegrationsNew.css';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  category: string;
  lastSynced?: {
    date: string;
    status: 'success' | 'failed';
  };
  authType: 'oauth' | 'api_key' | 'credentials';
  authConfig?: {
    fields?: Array<{
      name: string;
      label: string;
      type: 'text' | 'password';
      required: boolean;
    }>;
    oauthUrl?: string;
  };
}

const FallbackIcon: React.FC<{ name: string }> = ({ name }) => (
  <div className="fallback-icon">
    {name.charAt(0).toUpperCase()}
  </div>
);

const getIconPath = (name: string): string => {
  const iconMap: Record<string, string> = {
    'GitHub': '/icons/github.svg',
    'Slack': '/icons/slack.svg',
    'Gmail': '/icons/gmail.svg',
    'Google Calendar': '/icons/google-calendar.svg',
    'Jira': '/icons/jira.svg',
    'Notion': '/icons/notion.svg',
    'HubSpot CRM': '/icons/hubspot.svg',
    'Salesforce': '/icons/salesforce.svg'
  };
  return iconMap[name] || '';
};

const IntegrationCard: React.FC<{
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
}> = ({ integration, onConnect, onDisconnect }) => {
  const [imageError, setImageError] = useState(true);
  const iconPath = getIconPath(integration.name);

  return (
    <div className="integration-card">
      {integration.status === 'connected' && integration.lastSynced && (
        <div className="sync-tooltip">
          <svg viewBox="0 0 24 24" fill="none" className="sync-icon">
            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Last synced: {integration.lastSynced.date}</span>
        </div>
      )}
      <div className="integration-main">
        <div className="integration-icon">
          {iconPath && !imageError ? (
            <img 
              src={iconPath}
              alt={integration.name} 
              onError={() => setImageError(true)}
            />
          ) : (
            <FallbackIcon name={integration.name} />
          )}
        </div>
        <div className="integration-info">
          <h3>{integration.name}</h3>
          <p>{integration.description}</p>
        </div>
      </div>
      <div className="integration-footer">
        <div className="integration-actions">
          {integration.status === 'connected' ? (
            <>
              <div className="status-badge">
                <svg viewBox="0 0 24 24" fill="none" className="status-icon">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Connected</span>
              </div>
              <button onClick={onDisconnect} className="disconnect-button">
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={onConnect} className="connect-button">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalIcon: React.FC<{ icon: string; name: string }> = ({ icon, name }) => {
  const [imageError, setImageError] = useState(true);
  const iconPath = getIconPath(name);

  if (!iconPath || imageError) {
    return (
      <div className="modal-fallback-icon">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img 
      src={iconPath}
      alt={name} 
      className="modal-icon" 
      onError={() => setImageError(true)}
    />
  );
};

interface IntegrationsNewProps {
  onClose?: () => void;
}

export function IntegrationsNew({ onClose }: IntegrationsNewProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authFormData, setAuthFormData] = useState<Record<string, string>>({});

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  const integrations: Integration[] = [
    // AI & Machine Learning
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'Enhance your timeline with AI-powered insights and summaries.',
      icon: '',
      status: 'connected',
      category: 'AI & Machine Learning',
      lastSynced: {
        date: '1 minute ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://chatgpt.com/oauth/v2/authorize'
      }
    },
    {
      id: 'claude',
      name: 'Claude AI',
      description: 'Advanced AI assistant for document analysis and content generation.',
      icon: '',
      status: 'disconnected',
      category: 'AI & Machine Learning',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://claude.com/oauth/v2/authorize'
      }
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Multimodal AI for enhanced content understanding and generation.',
      icon: '',
      status: 'disconnected',
      category: 'AI & Machine Learning',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://gemini.com/oauth/v2/authorize'
      }
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      description: 'AI-powered code suggestions and documentation assistance.',
      icon: '',
      status: 'connected',
      category: 'AI & Machine Learning',
      lastSynced: {
        date: '30 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://github.com/login/oauth/authorize'
      }
    },

    // Messaging & Communication
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Connect your WhatsApp chats and messages for a complete communication timeline.',
      icon: '',
      status: 'connected',
      category: 'Messaging & Communication',
      lastSynced: {
        date: '2 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://whatsapp.com/oauth/v2/authorize'
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Sync your Telegram conversations and channel messages.',
      icon: '',
      status: 'disconnected',
      category: 'Messaging & Communication',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://telegram.com/oauth/v2/authorize'
      }
    },
    {
      id: 'signal',
      name: 'Signal',
      description: 'Import your Signal private messages and group chats securely.',
      icon: '',
      status: 'disconnected',
      category: 'Messaging & Communication',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://signal.com/oauth/v2/authorize'
      }
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Connect your Discord servers and direct messages.',
      icon: '',
      status: 'connected',
      category: 'Messaging & Communication',
      lastSynced: {
        date: '10 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://discord.com/oauth2/authorize'
      }
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      description: 'Import your Facebook Messenger conversations and group chats.',
      icon: '',
      status: 'disconnected',
      category: 'Messaging & Communication',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://facebook.com/oauth/v2/authorize'
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Sync your Slack conversations and channel activities.',
      icon: '',
      status: 'disconnected',
      category: 'Messaging & Communication',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://slack.com/oauth/v2/authorize'
      }
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Connect your Teams chats, channels, and meetings.',
      icon: '',
      status: 'disconnected',
      category: 'Messaging & Communication',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://teams.com/oauth/v2/authorize'
      }
    },

    // Email & Calendar
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Import and analyze your email communications timeline.',
      icon: '',
      status: 'connected',
      category: 'Email & Calendar',
      lastSynced: {
        date: '5 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://gmail.com/oauth/v2/authorize'
      }
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Sync your Outlook emails and calendar events.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://outlook.com/oauth/v2/authorize'
      }
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your calendar events and schedules.',
      icon: '',
      status: 'connected',
      category: 'Email & Calendar',
      lastSynced: {
        date: '15 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://calendar.google.com/oauth/v2/auth'
      }
    },
    {
      id: 'yahoo-mail',
      name: 'Yahoo Mail',
      description: 'Connect your Yahoo email account and manage communications.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://yahoo.com/oauth/v2/authorize'
      }
    },
    {
      id: 'proton-mail',
      name: 'ProtonMail',
      description: 'Secure email service with end-to-end encryption.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://proton.me/oauth/authorize'
      }
    },
    {
      id: 'zoho-mail',
      name: 'Zoho Mail',
      description: 'Business email service with calendar and collaboration tools.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://zoho.com/oauth/v2/auth'
      }
    },
    {
      id: 'fastmail',
      name: 'Fastmail',
      description: 'Private email service with custom domain support.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://fastmail.com/oauth/v2/auth'
      }
    },
    {
      id: 'apple-mail',
      name: 'Apple Mail',
      description: 'Native Apple email client with iCloud integration.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://apple.com/oauth/v2/auth'
      }
    },
    {
      id: 'icloud-calendar',
      name: 'iCloud Calendar',
      description: 'Sync your Apple iCloud calendar events and reminders.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://icloud.com/oauth/v2/auth'
      }
    },
    {
      id: 'exchange',
      name: 'Microsoft Exchange',
      description: 'Enterprise email and calendar solution for businesses.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://exchange.microsoft.com/oauth2/auth'
      }
    },
    {
      id: 'thunderbird',
      name: 'Mozilla Thunderbird',
      description: 'Open-source email client with calendar integration.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://thunderbird.com/oauth/v2/auth'
      }
    },
    {
      id: 'office365',
      name: 'Office 365 Calendar',
      description: 'Microsoft 365 calendar and scheduling platform.',
      icon: '',
      status: 'disconnected',
      category: 'Email & Calendar',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://office.com/oauth2/auth'
      }
    },

    // Development & Project Management
    {
      id: 'github',
      name: 'GitHub',
      description: 'Track your repository activities and code contributions.',
      icon: '',
      status: 'disconnected',
      category: 'Development & Project Management',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://github.com/login/oauth/authorize'
      }
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Monitor your GitLab projects and merge requests.',
      icon: '',
      status: 'disconnected',
      category: 'Development & Project Management',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://gitlab.com/oauth/authorize'
      }
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'View your project timelines and ticket status.',
      icon: '',
      status: 'connected',
      category: 'Development & Project Management',
      lastSynced: {
        date: '3 hours ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://jira.com/oauth/authorize'
      }
    },
    {
      id: 'linear',
      name: 'Linear',
      description: 'Streamline your software project management workflow.',
      icon: '',
      status: 'disconnected',
      category: 'Development & Project Management',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://linear.app/oauth/authorize'
      }
    },

    // CRM & Sales
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect your Salesforce account to view CRM data and analytics.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'credentials',
      authConfig: {
        fields: [
          { name: 'username', label: 'Username', type: 'text', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
          { name: 'security_token', label: 'Security Token', type: 'text', required: true }
        ]
      }
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      description: 'Integrate customer relationship management and sales pipeline.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://hubspot.com/oauth/authorize'
      }
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      description: 'Sync your customer data and sales activities.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://zoho.com/oauth/v2/auth'
      }
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'Manage your sales pipeline and track customer interactions.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://pipedrive.com/oauth/authorize'
      }
    },
    {
      id: 'dynamics365',
      name: 'Microsoft Dynamics 365',
      description: 'Enterprise-level CRM solution for customer engagement and sales.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://dynamics.microsoft.com/oauth2/authorize'
      }
    },
    {
      id: 'freshsales',
      name: 'Freshsales',
      description: 'AI-powered CRM for sales teams with built-in communication tools.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://freshsales.io/oauth/authorize'
      }
    },
    {
      id: 'zendesk-sell',
      name: 'Zendesk Sell',
      description: 'Sales CRM software for better customer relationships.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://zendesk.com/oauth/authorize'
      }
    },
    {
      id: 'copper',
      name: 'Copper CRM',
      description: 'CRM that works seamlessly with Google Workspace.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://copper.com/oauth/authorize'
      }
    },
    {
      id: 'close',
      name: 'Close',
      description: 'Sales engagement CRM for inside sales teams.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://close.com/oauth/authorize'
      }
    },
    {
      id: 'insightly',
      name: 'Insightly',
      description: 'CRM with project management capabilities.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://insightly.com/oauth/authorize'
      }
    },
    {
      id: 'sugar-crm',
      name: 'SugarCRM',
      description: 'Enterprise CRM for marketing, sales, and service teams.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://sugarcrm.com/oauth/authorize'
      }
    },
    {
      id: 'vtiger',
      name: 'Vtiger',
      description: 'Open-source CRM for sales, marketing, and support.',
      icon: '',
      status: 'disconnected',
      category: 'CRM & Sales',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://vtiger.com/oauth/authorize'
      }
    },

    // Productivity & Notes
    {
      id: 'notion',
      name: 'Notion',
      description: 'Connect your workspace documents and databases.',
      icon: '',
      status: 'disconnected',
      category: 'Productivity & Notes',
      authType: 'api_key',
      authConfig: {
        fields: [
          { name: 'api_key', label: 'API Key', type: 'password', required: true }
        ]
      }
    },
    {
      id: 'evernote',
      name: 'Evernote',
      description: 'Sync your notes and organize your thoughts.',
      icon: '',
      status: 'disconnected',
      category: 'Productivity & Notes',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://evernote.com/oauth/v2/auth'
      }
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      description: 'Connect your knowledge base and markdown notes.',
      icon: '',
      status: 'disconnected',
      category: 'Productivity & Notes',
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://obsidian.md/oauth/authorize'
      }
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Access and manage your documents and files.',
      icon: '',
      status: 'connected',
      category: 'Productivity & Notes',
      lastSynced: {
        date: '45 minutes ago',
        status: 'success'
      },
      authType: 'oauth',
      authConfig: {
        oauthUrl: 'https://drive.google.com/oauth/v2/auth'
      }
    }
  ];

  // Get unique categories from integrations that have at least one app
  const categories = useMemo(() => {
    const allCategories = integrations.map(integration => integration.category);
    const uniqueCategories = Array.from(new Set(allCategories));
    return ['All', ...uniqueCategories].filter(category => 
      category === 'All' || 
      integrations.some(integration => integration.category === category)
    );
  }, []);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleConnect = (integration: Integration) => {
    // Navigate to the auth page with integration details
    navigate(`/auth/${integration.name.toLowerCase().replace(/\s+/g, '-')}`, {
      state: { integration }
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegration) return;

    try {
      // Handle different auth types
      switch (selectedIntegration.authType) {
        case 'oauth':
          // Open OAuth flow in a popup
          const width = 600;
          const height = 600;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          window.open(
            selectedIntegration.authConfig?.oauthUrl,
            'oauth_popup',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          break;

        case 'api_key':
        case 'credentials':
          // Make API call to your backend with the form data
          console.log('Submitting auth data:', authFormData);
          // TODO: Add your API call here
          break;
      }

      // Close the modal after successful authentication
      setIsAuthModalOpen(false);
      setSelectedIntegration(null);
    } catch (error) {
      console.error('Authentication failed:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div className="integrations-container">
      <div className="integrations-header">
        <div className="header-title">
          <svg viewBox="0 0 24 24" fill="none" className="header-icon">
            <path d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>Integrations</h1>
        </div>
        <div className="header-description">
          <p>Connect your favorite tools and services to enhance your timeline experience. Seamlessly integrate with popular platforms to bring all your data into one place.</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="categories-container">
          <div className="categories-grid">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleClose} className="close-button">
        <svg viewBox="0 0 24 24" fill="none" className="close-icon">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="integrations-grid">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => handleConnect(integration)}
            onDisconnect={() => {}}
          />
        ))}
      </div>

      {/* Authentication Modal */}
      {isAuthModalOpen && selectedIntegration && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button className="modal-close" onClick={() => setIsAuthModalOpen(false)}>
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <div className="modal-header">
              <ModalIcon icon={selectedIntegration.icon} name={selectedIntegration.name} />
              <h2>Connect {selectedIntegration.name}</h2>
            </div>

            <div className="modal-body">
              <p>
                Connect your {selectedIntegration.name} account to enable automatic synchronization 
                of your data and streamline your workflow.
              </p>
            </div>

            <div className="modal-footer">
              <button onClick={() => {
                setIsAuthModalOpen(false);
                handleConnect(selectedIntegration);
              }}>
                Connect with {selectedIntegration.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 