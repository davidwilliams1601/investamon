import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Tooltip,
  LinearProgress,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import CharacterCard from '../components/CharacterCard';
import ChallengeCard from '../components/ChallengeCard';
import NewsStory from '../components/NewsStory';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PetsIcon from '@mui/icons-material/Pets';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarIcon from '@mui/icons-material/Star';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  border: '2px solid #E0E0E0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '24px',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: '8px',
  },
}));

const GuideCharacter = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginRight: 16,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  border: `3px solid ${theme.palette.primary.main}`,
  cursor: 'pointer',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  '& .MuiLinearProgress-bar': {
    borderRadius: 10,
  },
}));

const DailyQuestCard = styled(Paper)(({ theme }) => ({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: '16px',
  marginBottom: '24px',
}));

const AgeGroupSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '24px',
  gap: '16px',
}));

const AgeGroupButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: '50px',
  fontWeight: 'bold',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  backgroundColor: selected ? theme.palette.secondary.main : '#f0f0f0',
  color: selected ? 'white' : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.secondary.dark : '#e0e0e0',
    transform: 'scale(1.05)',
  },
}));

// Age-appropriate content and terminology
const ageGroups = {
  younger: {
    title: "My Monster Friends",
    challenges: "Fun Quests",
    news: "Monster Updates",
    welcome: "Hello",
    dailyQuest: "Today's Adventure",
    tip: "Learning Tip: Money is like seeds - if you save it and take care of it, it can grow into more money!",
  },
  middle: {
    title: "My InvestiMon Collection",
    challenges: "Adventures & Quests",
    news: "Monster News",
    welcome: "Welcome back",
    dailyQuest: "Daily Challenge",
    tip: "Learning Tip: Companies that make things you like can be good investments - look for products you and your friends enjoy!",
  },
  older: {
    title: "My Investment Characters",
    challenges: "Active Challenges",
    news: "Market Updates",
    welcome: "Welcome",
    dailyQuest: "Financial Goal",
    tip: "Learning Tip: Diversification means having different types of investments, which can help protect your money if one investment doesn't do well.",
  }
};

const guideCharacters = [
  { name: "Penny", description: "Penny the Saver helps you learn about saving!", image: "https://via.placeholder.com/80?text=Penny" },
  { name: "Stocky", description: "Stocky teaches you about investing in companies!", image: "https://via.placeholder.com/80?text=Stocky" },
  { name: "Professor Coin", description: "Professor Coin explains difficult money concepts!", image: "https://via.placeholder.com/80?text=Prof" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const api = useApi();
  const [currentTip, setCurrentTip] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [ageGroup, setAgeGroup] = useState("middle"); // Default to middle age group
  const [dailyQuest, setDailyQuest] = useState(null);
  
  // Determine age group based on user age if available
  useEffect(() => {
    if (user?.age) {
      if (user.age <= 9) setAgeGroup("younger");
      else if (user.age <= 12) setAgeGroup("middle");
      else setAgeGroup("older");
    }
    
    // Set random daily quest
    const quests = [
      "Save a small amount of your pocket money this week",
      "Ask a parent about their favorite companies",
      "Find 3 companies that make things you use every day",
      "Keep track of how you spend your pocket money for a week",
    ];
    setDailyQuest(quests[Math.floor(Math.random() * quests.length)]);
    
  }, [user]);

  // Display tooltip with guide character
  const displayTip = (tip) => {
    setCurrentTip(tip);
    setShowTip(true);
    setTimeout(() => setShowTip(false), 10000); // Hide after 10 seconds
  };

  // Fetch user's characters
  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.get('/characters'),
    enabled: !!user,
  });

  // Fetch active challenges
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.get('/challenges'),
    enabled: !!user,
  });

  // Fetch latest news for user's characters
  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.get('/news'),
    enabled: !!user && characters?.length > 0,
  });

  // Calculate overall progress
  const calculateProgress = () => {
    if (!user) return 0;
    // Simple example calculation - can be made more sophisticated
    const baseScore = (user.experience || 0) / 10;
    const challengeBonus = challenges?.length ? challenges.reduce((acc, c) => acc + (c.progress || 0), 0) / challenges.length : 0;
    return Math.min(Math.max(baseScore + challengeBonus, 0), 100);
  };

  if (isLoadingCharacters || isLoadingChallenges || isLoadingNews) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <img 
          src="https://via.placeholder.com/150?text=Loading" 
          alt="Loading"
          style={{ marginBottom: '16px', animation: 'bounce 1s infinite alternate' }}
        />
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Loading your adventure...
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', mr: 2 }}>
          {guideCharacters.map((character, index) => (
            <Tooltip 
              key={index} 
              title={character.description}
              arrow
            >
              <GuideCharacter
                src={character.image}
                alt={character.name}
                onClick={() => displayTip(ageGroups[ageGroup].tip)}
                sx={{ zIndex: 3 - index, ml: index !== 0 ? -2 : 0 }}
              />
            </Tooltip>
          ))}
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            {ageGroups[ageGroup].welcome}, {user?.name || 'Explorer'}!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Adventure Level: {user?.level || 1}
            </Typography>
            <StarIcon color="primary" />
          </Box>
          <ProgressBar variant="determinate" value={calculateProgress()} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption">XP: {user?.experience || 0}</Typography>
            <Typography variant="caption">Next level: {(user?.level || 1) * 100}</Typography>
          </Box>
        </Box>
      </Box>

      <Zoom in={showTip}>
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setShowTip(false)}>
          {currentTip}
        </Alert>
      </Zoom>

      <AgeGroupSelector>
        <AgeGroupButton 
          selected={ageGroup === "younger"} 
          onClick={() => setAgeGroup("younger")}
        >
          Ages 7-9
        </AgeGroupButton>
        <AgeGroupButton 
          selected={ageGroup === "middle"} 
          onClick={() => setAgeGroup("middle")}
        >
          Ages 10-12
        </AgeGroupButton>
        <AgeGroupButton 
          selected={ageGroup === "older"} 
          onClick={() => setAgeGroup("older")}
        >
          Ages 13-14
        </AgeGroupButton>
      </AgeGroupSelector>

      {dailyQuest && (
        <DailyQuestCard elevation={3}>
          <EmojiEventsIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" gutterBottom align="center">
            {ageGroups[ageGroup].dailyQuest}
          </Typography>
          <Typography variant="body1" align="center">
            {dailyQuest}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ mt: 2 }}
          >
            Complete Quest
          </Button>
        </DailyQuestCard>
      )}

      <Grid container spacing={3}>
        {/* Characters Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <SectionTitle variant="h5">
              <PetsIcon />
              {ageGroups[ageGroup].title}
            </SectionTitle>
            {characters?.length === 0 ? (
              <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 2 }}>
                  <img 
                    src="https://via.placeholder.com/100?text=No+Monsters" 
                    alt="No monsters yet"
                    style={{ marginBottom: '16px' }}
                  />
                  <Typography variant="body1" align="center">
                    You don't have any monster friends yet. Let's find some!
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    href="/characters"
                  >
                    Discover Monsters
                  </Button>
                </Box>
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {characters?.map((character) => (
                  <Grid item xs={12} sm={6} md={4} key={character._id}>
                    <CharacterCard character={character} ageGroup={ageGroup} />
                  </Grid>
                ))}
              </Grid>
            )}
          </StyledPaper>
        </Grid>

        {/* Active Challenges Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SectionTitle variant="h5">
              <EmojiEventsIcon />
              {ageGroups[ageGroup].challenges}
            </SectionTitle>
            {challenges?.length === 0 ? (
              <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 2 }}>
                  <img 
                    src="https://via.placeholder.com/100?text=Quests" 
                    alt="No quests"
                    style={{ marginBottom: '16px' }}
                  />
                  <Typography variant="body1" align="center">
                    No {ageGroups[ageGroup].challenges.toLowerCase()} at the moment. Want to start one?
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    href="/challenges"
                  >
                    Find Adventures
                  </Button>
                </Box>
              </Alert>
            ) : (
              challenges?.map((challenge) => (
                <Box key={challenge._id} sx={{ mb: 2 }}>
                  <ChallengeCard challenge={challenge} ageGroup={ageGroup} />
                </Box>
              ))
            )}
          </StyledPaper>
        </Grid>

        {/* Latest News Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SectionTitle variant="h5">
              <SchoolIcon />
              {ageGroups[ageGroup].news}
            </SectionTitle>
            {news?.length === 0 ? (
              <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', py: 2 }}>
                  <img 
                    src="https://via.placeholder.com/100?text=News" 
                    alt="No news"
                    style={{ marginBottom: '16px' }}
                  />
                  <Typography variant="body1" align="center">
                    No {ageGroups[ageGroup].news.toLowerCase()} available right now. Check back soon!
                  </Typography>
                </Box>
              </Alert>
            ) : (
              news?.map((story) => (
                <Box key={story._id} sx={{ mb: 2 }}>
                  <NewsStory story={story} ageGroup={ageGroup} />
                </Box>
              ))
            )}
          </StyledPaper>
        </Grid>
      </Grid>
      
      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <Tooltip title="Need help? Click me!" arrow>
          <Button
            variant="contained"
            color="secondary"
            sx={{ 
              borderRadius: '50%', 
              width: 64, 
              height: 64,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              animation: 'pulse 2s infinite',
            }}
            onClick={() => displayTip(ageGroups[ageGroup].tip)}
          >
            <HelpOutlineIcon fontSize="large" />
          </Button>
        </Tooltip>
      </Box>
      
      <style jsx="true">{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </Box>
  );
};

export default Dashboard; 