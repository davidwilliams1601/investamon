import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import NewsStory from '../components/NewsStory';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '24px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const SearchField = styled(TextField)({
  marginBottom: '24px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
});

const News = () => {
  const { user } = useAuth();
  const api = useApi();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's characters
  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.get('/characters'),
    enabled: !!user,
  });

  // Fetch news for user's characters
  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.get('/news'),
    enabled: !!user && characters?.length > 0,
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (isLoadingCharacters || isLoadingNews) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredNews = news?.filter(story => {
    const matchesSearch = story.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.news.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 0) return matchesSearch;
    if (selectedTab === 1) return matchesSearch && story.characterName === selectedCharacter?.name;
    return matchesSearch;
  });

  const selectedCharacter = characters?.find(char => char._id === selectedTab);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Market News
      </Typography>

      <SearchField
        fullWidth
        variant="outlined"
        placeholder="Search news by character or title..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="All News" />
        {characters?.map((character) => (
          <Tab
            key={character._id}
            label={character.name}
            value={character._id}
          />
        ))}
      </Tabs>

      {filteredNews?.length === 0 ? (
        <Alert severity="info">
          {searchQuery
            ? "No news found matching your search. Try different keywords!"
            : selectedTab === 0
            ? "No news available at the moment. Check back later!"
            : `No news available for ${selectedCharacter?.name} at the moment.`}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredNews?.map((story) => (
            <Grid item xs={12} key={story._id}>
              <NewsStory story={story} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default News; 