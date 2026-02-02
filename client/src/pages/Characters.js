import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import CharacterCard from '../components/CharacterCard';
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

const AddCharacterButton = styled(Button)({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontSize: '1.1rem',
});

const Characters = () => {
  const { user } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    company: '',
    description: '',
  });

  // Fetch user's characters
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.get('/characters'),
    enabled: !!user,
  });

  // Add new character mutation
  const addCharacterMutation = useMutation({
    mutationFn: (characterData) => api.post('/characters', characterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setOpenDialog(false);
      setNewCharacter({ name: '', company: '', description: '' });
    },
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCharacter({ name: '', company: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCharacterMutation.mutateAsync(newCharacter);
    } catch (error) {
      console.error('Failed to add character:', error);
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

  const filteredCharacters = characters?.filter(character => {
    if (selectedTab === 0) return true;
    if (selectedTab === 1) return character.level >= 5;
    if (selectedTab === 2) return character.level < 5;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My InvestiMon Collection
        </Typography>
        <AddCharacterButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Character
        </AddCharacterButton>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="All Characters" />
        <Tab label="Advanced (Level 5+)" />
        <Tab label="Beginner (Level 1-4)" />
      </Tabs>

      {filteredCharacters?.length === 0 ? (
        <Alert severity="info">
          {selectedTab === 0
            ? "You don't have any InvestiMon characters yet. Add your first character to get started!"
            : selectedTab === 1
            ? "You don't have any advanced characters yet. Keep training your characters to level them up!"
            : "You don't have any beginner characters. Add a new character to get started!"}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredCharacters?.map((character) => (
            <Grid item xs={12} sm={6} md={4} key={character._id}>
              <CharacterCard character={character} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Character Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New InvestiMon Character</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Character Name"
              type="text"
              fullWidth
              value={newCharacter.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="company"
              label="Company Name"
              type="text"
              fullWidth
              value={newCharacter.company}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Character Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newCharacter.description}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addCharacterMutation.isLoading}
            >
              {addCharacterMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Add Character'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Characters; 