
'use client';
import React, { useState, useEffect } from 'react';
import HeaderComponent from './components/Header';
import Charts from './components/Charts';
import {
  Container, Typography, TextField, Paper, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, InputAdornment, Avatar, Chip, Rating, TableSortLabel, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ScatterChart, Scatter, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MusicNote as MusicNoteIcon, Speed as SpeedIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { groupBy, map, entries } from 'lodash';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const fetchSongs = async (page, limit) => {
  const response = await fetch(`/api/songs?page=${page}&limit=${limit}`);
  const data = await response.json();
  return data;
};

const fetchSongByTitle = async (page, limit, title) => {
  const response = await fetch(`/api/songs?title=${title}&page=${page}&limit=${limit}`);
  const data = await response.json();
  return data;
};

const rateSong = async (id, stars) => {
  const response = await fetch(`/api/songs/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stars }),
  });
  return response.json();
};

const Dashboard = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        const data = await fetchSongs(page + 1, rowsPerPage);
        setSongs(data.data);
      } catch (err) {
        setError('Failed to load songs');
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleRate = async (id, stars) => {
    try {
      const result = await rateSong(id, stars);
      const data = await fetchSongs(page, rowsPerPage);
      console.log(data.data);
      setSongs(data.data);
      setFeedback(result.message || 'Rating updated successfully');
    } catch (err) {
      setError('Failed to rate song');
    }
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const songs = await fetchSongByTitle(1, 10, searchTerm);
        if (songs && songs.error) {
          setError(songs.error);
          setSongs([]);
          return;
        }
        setSongs(songs);
        console.log(songs); 
      } catch (error) {
        setSongs([]);
        console.error('Error searching for song:', error);
        setError('Song not found');
      }
    } else {
      // If search term is empty, reset to fetching all songs
      const data = await fetchSongs(1, rowsPerPage);
      setSongs(data.data);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Title', 'Danceability', 'Energy', 'Acousticness', 'Tempo', 'Duration', 'Sections', 'Segments', 'Rating'];
    const csvContent = [
      headers.join(','),
      ...songs.map(song => [
        song.title,
        song.danceability,
        song.energy,
        song.acousticness,
        song.tempo,
        song.duration_ms,
        song.num_sections,
        song.num_segments,
        song.rating
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'songs.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sortedSongs = [...songs].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    return order === 'asc'
      ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
      : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
  });

  return (
    <Container maxWidth="lg">
        
      <HeaderComponent />
      <Typography variant="h4" sx={{ my: 4, fontWeight: 'bold', color:'black'}}>Dashboard</Typography>

      <Charts sortedSongs={sortedSongs}/>
      
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Song List</Typography>
        <Box display="flex" alignItems="center">
            <TextField
              size="small"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={handleDownloadCSV} sx={{ ml: 2 }}>
              <DownloadIcon />
            </IconButton>
          </Box>  
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'danceability'}
                    direction={orderBy === 'danceability' ? order : 'asc'}
                    onClick={() => handleRequestSort('danceability')}
                  >
                    Danceability
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'energy'}
                    direction={orderBy === 'energy' ? order : 'asc'}
                    onClick={() => handleRequestSort('energy')}
                  >
                    Energy
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'acousticness'}
                    direction={orderBy === 'acousticness' ? order : 'asc'}
                    onClick={() => handleRequestSort('acousticness')}
                  >
                    Acousticness
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'tempo'}
                    direction={orderBy === 'tempo' ? order : 'asc'}
                    onClick={() => handleRequestSort('tempo')}
                  >
                    Tempo
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'duration_ms'}
                    direction={orderBy === 'duration_ms' ? order : 'asc'}
                    onClick={() => handleRequestSort('duration_ms')}
                  >
                    Duration
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>                  <TableSortLabel
                    active={orderBy === 'num_sections'}
                    direction={orderBy === 'num_sections' ? order : 'asc'}
                    onClick={() => handleRequestSort('num_sections')}
                  >
                    Sections
                  </TableSortLabel></StyledTableCell>
                <StyledTableCell>Segments</StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'rating'}
                    direction={orderBy === 'rating' ? order : 'asc'}
                    onClick={() => handleRequestSort('rating')}
                  >
                    Rating
                  </TableSortLabel>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSongs.length > 0 ? sortedSongs.map((song) => (
                <StyledTableRow key={song.id}>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <MusicNoteIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">{song.title}</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title={`Danceability: ${song.danceability}`}>
                      <Box width={50} bgcolor="#e0e0e0" borderRadius={5} height={10}>
                        <Box width={`${song.danceability * 100}%`} bgcolor="#1976d2" borderRadius={5} height={10} />
                      </Box>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title={`Energy: ${song.energy}`}>
                      <Box width={50} bgcolor="#e0e0e0" borderRadius={5} height={10}>
                        <Box width={`${song.energy * 100}%`} bgcolor="#2196f3" borderRadius={5} height={10} />
                      </Box>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title={`Acousticness: ${song.acousticness}`}>
                      <Box width={50} bgcolor="#e0e0e0" borderRadius={5} height={10}>
                        <Box width={`${song.acousticness * 100}%`} bgcolor="#4caf50" borderRadius={5} height={10} />
                      </Box>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <SpeedIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{Math.round(song.tempo)} BPM</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {`${Math.floor(song.duration_ms / (60 * 1000))}:${Math.floor((song.duration_ms % (60 * 1000)) / 1000).toString().padStart(2, '0')}`}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip label={song.num_sections} size="small" color="secondary" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip label={song.num_segments} size="small" color="info" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Rating
                      name={`rating-${song.id}`}
                      value={song.rating}
                      onChange={(event, newValue) => handleRate(song.id, newValue)}
                      precision={0.5}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )) : <Typography variant="body1">No songs found</Typography>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={100} // Update this with the actual count from your backend if possible
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Dashboard;
