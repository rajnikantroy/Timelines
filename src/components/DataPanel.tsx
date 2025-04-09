import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Sample data for charts
const realtimeData = [
  { time: '00:00', value: 65 },
  { time: '01:00', value: 75 },
  { time: '02:00', value: 85 },
  { time: '03:00', value: 70 },
  { time: '04:00', value: 90 },
  { time: '05:00', value: 95 },
];

const statsData = [
  { category: 'Completed', value: 45 },
  { category: 'In Progress', value: 30 },
  { category: 'Pending', value: 25 },
];

export default function DataPanel() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="data panel tabs">
          <Tab label="Summary" />
          <Tab label="Stats" />
          <Tab label="Realtime Data" />
          <Tab label="Performance" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Typography variant="h6" gutterBottom>
          Project Overview
        </Typography>
        <Typography paragraph>
          Current project status and key metrics at a glance. The timeline shows steady progress
          with consistent updates and improvements across different areas.
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Total Events</Typography>
            <Typography variant="h4">1,234</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Active Users</Typography>
            <Typography variant="h4">856</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Response Time</Typography>
            <Typography variant="h4">125ms</Typography>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography variant="h6" gutterBottom>
          Realtime Monitoring
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">CPU Usage</Typography>
            <Typography variant="h4">45%</Typography>
            <Typography variant="body2" color="text.secondary">
              Stable performance
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Memory Usage</Typography>
            <Typography variant="h4">2.4GB</Typography>
            <Typography variant="body2" color="text.secondary">
              Within normal range
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
} 