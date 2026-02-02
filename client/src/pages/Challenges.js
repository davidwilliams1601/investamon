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
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChallengeCard from '../components/ChallengeCard';
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

const ChallengeHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const RewardChip = styled(Chip)(({ theme }) => ({
  marginLeft: '8px',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const Challenges = () => {
  const { user } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch user's challenges
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.get('/challenges'),
    enabled: !!user,
  });

  // Complete challenge mutation
  const completeChallengeMutation = useMutation({
    mutationFn: (challengeId) => api.post(`/challenges/${challengeId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (isLoading) {
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

  const filteredChallenges = challenges?.filter(challenge => {
    if (selectedTab === 0) return challenge.type === 'daily';
    if (selectedTab === 1) return challenge.type === 'weekly';
    return true;
  });

  const completedChallenges = filteredChallenges?.filter(challenge => challenge.completed);
  const activeChallenges = filteredChallenges?.filter(challenge => !challenge.completed);

  return (
    <Box>
      <ChallengeHeader>
        <Typography variant="h4">
          Challenges
        </Typography>
        <Box>
          <Typography variant="body1" component="span">
            Total Rewards:
          </Typography>
          <RewardChip
            label={`${challenges?.reduce((acc, challenge) => acc + (challenge.completed ? challenge.reward : 0), 0)} XP`}
          />
        </Box>
      </ChallengeHeader>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Daily Missions" />
        <Tab label="Weekly Missions" />
      </Tabs>

      {filteredChallenges?.length === 0 ? (
        <Alert severity="info">
          {selectedTab === 0
            ? "No daily missions available at the moment. Check back tomorrow!"
            : "No weekly missions available at the moment. Check back next week!"}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Active Challenges */}
          <Grid item xs={12}>
            <StyledPaper>
              <SectionTitle variant="h5">
                Active Challenges
              </SectionTitle>
              {activeChallenges?.length === 0 ? (
                <Alert severity="success">
                  All challenges completed! Great job!
                </Alert>
              ) : (
                activeChallenges?.map((challenge) => (
                  <Box key={challenge._id} sx={{ mb: 2 }}>
                    <ChallengeCard
                      challenge={challenge}
                      onComplete={() => completeChallengeMutation.mutate(challenge._id)}
                    />
                  </Box>
                ))
              )}
            </StyledPaper>
          </Grid>

          {/* Completed Challenges */}
          <Grid item xs={12}>
            <StyledPaper>
              <SectionTitle variant="h5">
                Completed Challenges
              </SectionTitle>
              {completedChallenges?.length === 0 ? (
                <Alert severity="info">
                  Complete challenges to see your achievements here!
                </Alert>
              ) : (
                completedChallenges?.map((challenge) => (
                  <Box key={challenge._id} sx={{ mb: 2 }}>
                    <ChallengeCard
                      challenge={challenge}
                      completed
                    />
                  </Box>
                ))
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Challenges; 