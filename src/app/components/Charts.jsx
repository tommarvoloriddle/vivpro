// Charts.js
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, BarChart, Bar } from 'recharts';
import { Box, Grid, Paper, Typography } from '@mui/material';

const StatCard = ({ title, value, children }) => (
  <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="h4" gutterBottom>{value}</Typography>
    {children}
  </Paper>
);

const Charts = ({ sortedSongs }) => {
  // Function to bin duration values
  const binDuration = (songs, binSize) => {
    // Create bins
    const bins = {};
    songs.forEach(song => {
      const bin = Math.floor(song.duration_ms / binSize) * binSize;
      if (!bins[bin]) bins[bin] = 0;
      bins[bin]++;
    });

    // Convert bins object to array of objects
    return Object.entries(bins).map(([bin, count]) => ({
      name: `${Math.floor(bin / (60 * 1000))}:${Math.floor((bin % (60 * 1000)) / 1000).toString().padStart(2, '0')} - ${Math.floor((+bin + binSize) / (60 * 1000))}:${Math.floor(((+bin + binSize) % (60 * 1000)) / 1000).toString().padStart(2, '0')}`,
      count
    }));
  };

  const binSize = 50000;  // Bin size for duration ranges (e.g., 5 minutes)
  const durationBins = binDuration(sortedSongs, binSize);
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <StatCard title="Danceability">
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" name="Song Title" />
              <YAxis 
                dataKey="danceability" 
                name="Danceability" 
                domain={[0, 1]}  // Assuming danceability is a value between 0 and 1
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <RechartsTooltip 
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(label) => `Song: ${label}`}
              />
              <Scatter data={sortedSongs.map(song => ({
                name: song.title,
                danceability: song.danceability
              }))} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <StatCard title="Duration Histogram">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={durationBins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip formatter={(value) => `${value} songs`} />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <StatCard title="Acousticness">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sortedSongs.slice(0, 10).map(song => ({
                name: song.title,
                acousticness: song.acousticness
              }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                domain={[0, 1]}  // Assuming acousticness is a value between 0 and 1
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
              />
              <RechartsTooltip 
                formatter={(value) => `${(value * 100).toFixed(2)}%`} 
                labelFormatter={(label) => `Song: ${label}`}
              />
              <Bar dataKey="acousticness" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>
      </Grid>    
      <Grid item xs={12} md={6}>
        <StatCard title="Tempo">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sortedSongs.slice(0, 10).map(song => ({
                name: song.title,
                tempo: song.tempo
              }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                domain={['auto', 'auto']}  // Adjust the domain based on the range of BPM values
                tickFormatter={(value) => `${value} BPM`}  // Format ticks to show BPM
              />
              <RechartsTooltip   
                formatter={(value) => `${value} BPM`}  // Format tooltip to show BPM
                labelFormatter={(label) => `Song: ${label}`}
              />
              <Bar dataKey="tempo" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>
      </Grid>
    </Grid>
  );
};

export default Charts;
