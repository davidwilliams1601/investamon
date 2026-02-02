import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  EmojiEvents as EmojiEventsIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
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

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user's statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => api.get('/users/stats'),
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData) => api.put('/users/profile', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SectionTitle variant="h5">
              Account Information
            </SectionTitle>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <Button
                type={isEditing ? 'submit' : 'button'}
                variant="contained"
                color="primary"
                onClick={() => isEditing ? null : setIsEditing(true)}
                disabled={updateProfileMutation.isLoading}
              >
                {updateProfileMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Edit Profile'
                )}
              </Button>
            </form>
          </StyledPaper>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <SectionTitle variant="h5">
              Your Progress
            </SectionTitle>

            <List>
              <ListItem>
                <ListItemIcon>
                  <PetsIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Total InvestiMon"
                  secondary={stats?.totalCharacters || 0}
                />
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemIcon>
                  <EmojiEventsIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Completed Challenges"
                  secondary={stats?.completedChallenges || 0}
                />
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemIcon>
                  <CakeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Type"
                  secondary={
                    <Chip
                      label={user?.role === 'parent' ? 'Parent' : 'Child'}
                      color={user?.role === 'parent' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  }
                />
              </ListItem>

              {user?.role === 'child' && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Age"
                      secondary={`${user?.age} years old`}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 