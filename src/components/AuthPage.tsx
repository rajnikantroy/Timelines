import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Integration } from './IntegrationsNew';
import './AuthPage.css';

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

const AuthIcon: React.FC<{ name: string }> = ({ name }) => {
  const [imageError, setImageError] = React.useState(true);
  const iconPath = getIconPath(name);

  if (!iconPath || imageError) {
    return (
      <div className="auth-fallback-icon">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img 
      src={iconPath}
      alt={name} 
      className="auth-icon" 
      onError={() => setImageError(true)}
    />
  );
};

const getAuthMessage = (name: string): { description: string; permissions: string[] } => {
  const messages: Record<string, { description: string; permissions: string[] }> = {
    'GitHub': {
      description: 'Connect your GitHub account to sync your repositories, pull requests, issues, and code activity.',
      permissions: [
        'Read your repositories and activity',
        'Access pull requests and issues',
        'Track code contributions and commits',
        'Monitor repository events'
      ]
    },
    'Slack': {
      description: 'Connect Slack to sync your messages, channels, and workspace activity.',
      permissions: [
        'Access message history',
        'View channel information',
        'Read workspace activity',
        'Monitor mentions and reactions'
      ]
    },
    'Gmail': {
      description: 'Connect Gmail to sync your emails, attachments, and communication history.',
      permissions: [
        'Read email messages and threads',
        'Access email attachments',
        'View email labels and categories',
        'Monitor new email activity'
      ]
    },
    'Google Calendar': {
      description: 'Connect Google Calendar to sync your events, meetings, and schedule.',
      permissions: [
        'Access calendar events',
        'View meeting details',
        'Read event attendees',
        'Monitor schedule changes'
      ]
    },
    'Jira': {
      description: 'Connect Jira to sync your projects, issues, and sprint activities.',
      permissions: [
        'Access project information',
        'Read issue details and comments',
        'View sprint and board data',
        'Track workflow transitions'
      ]
    },
    'Notion': {
      description: 'Connect Notion to sync your pages, databases, and workspace content.',
      permissions: [
        'Access page content',
        'Read database entries',
        'View workspace updates',
        'Monitor page changes'
      ]
    },
    'HubSpot CRM': {
      description: 'Connect HubSpot to sync your contacts, deals, and sales activities.',
      permissions: [
        'Access contact information',
        'Read deal pipelines',
        'View sales activities',
        'Monitor customer interactions'
      ]
    },
    'Salesforce': {
      description: 'Connect Salesforce to sync your leads, opportunities, and customer data.',
      permissions: [
        'Access lead information',
        'Read opportunity details',
        'View account data',
        'Monitor sales activities'
      ]
    }
  };

  return messages[name] || {
    description: `Connect your ${name} account to sync your data and activities.`,
    permissions: ['Access account data', 'Sync relevant information']
  };
};

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { integration } = location.state as { integration: Integration };
  const [step, setStep] = React.useState<'initial' | 'authorizing' | 'success'>('initial');
  const authMessage = getAuthMessage(integration.name);

  const handleAuth = () => {
    setStep('authorizing');
    // Handle OAuth flow in a popup
    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      integration.authConfig?.oauthUrl,
      'oauth_popup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Simulate authorization process
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        navigate('/integrations');
      }, 2000);
    }, 2000);
  };

  const renderContent = () => {
    switch (step) {
      case 'authorizing':
        return (
          <>
            <div className="auth-status">
              <div className="auth-loader"></div>
              <p>Authorizing with {integration.name}...</p>
              <span className="auth-substatus">Please complete the authorization in the popup window</span>
            </div>
          </>
        );
      
      case 'success':
        return (
          <>
            <div className="auth-status">
              <CheckCircleIcon className="auth-success-icon" />
              <p>Successfully connected!</p>
              <span className="auth-substatus">Redirecting back to integrations...</span>
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div className="auth-description">
              <p>{authMessage.description}</p>
              <div className="auth-permissions">
                <h3>This integration will:</h3>
                <ul>
                  {authMessage.permissions.map((permission, index) => (
                    <li key={index}>
                      <CheckCircleIcon className="permission-icon" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="auth-button" onClick={handleAuth}>
              Continue with {integration.name}
            </button>
          </>
        );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-content">
            <div className="auth-header">
              <AuthIcon name={integration.name} />
              <h2>Connect {integration.name}</h2>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 