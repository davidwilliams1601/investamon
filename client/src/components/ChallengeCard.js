import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Button, Chip, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useApi } from '../hooks/useApi';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExtensionIcon from '@mui/icons-material/Extension';
import DiamondIcon from '@mui/icons-material/Diamond';
import PetsIcon from '@mui/icons-material/Pets';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import ConfettiExplosion from 'react-confetti-explosion';

const StyledCard = styled(motion(Card))(({ theme, difficulty }) => {
  const getBorderColor = () => {
    switch (difficulty) {
      case 'beginner': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'advanced': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };
  
  return {
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    borderRadius: '16px',
    border: `3px solid ${getBorderColor()}`,
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
    }
  };
});

const DifficultyChip = styled(Chip)(({ theme, difficulty }) => {
  const getColor = () => {
    switch (difficulty) {
      case 'beginner': return theme.palette.success;
      case 'intermediate': return theme.palette.warning;
      case 'advanced': return theme.palette.error;
      default: return theme.palette.primary;
    }
  };
  
  const color = getColor();
  
  return {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontWeight: 'bold',
    backgroundColor: color.main,
    color: '#fff',
    borderRadius: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };
});

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: '8px',
  marginBottom: '16px',
}));

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 10,
    backgroundImage: 'linear-gradient(to right, #4CAF50, #8BC34A, #CDDC39)',
  },
}));

const ProgressMarker = styled(Box)(({ theme, position, completed }) => ({
  position: 'absolute',
  left: `${position}%`,
  top: -10,
  transform: 'translateX(-50%)',
  color: completed ? theme.palette.success.main : theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'color 0.3s',
}));

const RewardBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.default,
}));

const StepsContainer = styled(Box)(({ theme }) => ({
  marginTop: '16px',
}));

const StepItem = styled(Box)(({ theme, completed }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  marginBottom: '8px',
  borderRadius: '8px',
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.1)' : theme.palette.background.default,
  border: completed ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(0, 0, 0, 0.12)',
}));

// Age-appropriate content
const ageContent = {
  younger: {
    title: {
      daily: "Daily Adventure",
      quiz: "Fun Quiz",
      achievement: "Cool Achievement",
      scenario: "Story Time"
    },
    difficultyLabels: {
      beginner: "Easy Peasy",
      intermediate: "A Bit Tricky",
      advanced: "Super Challenge"
    },
    progressLabel: "Your Journey",
    rewardsLabel: "Treasure",
    completeButtonText: "I Did It!",
    stepsLabel: "Adventure Steps",
    requirementsLabel: "What to Do"
  },
  middle: {
    title: {
      daily: "Daily Quest",
      quiz: "Knowledge Quiz",
      achievement: "Achievement",
      scenario: "Money Adventure"
    },
    difficultyLabels: {
      beginner: "Beginner",
      intermediate: "Getting Harder",
      advanced: "Expert"
    },
    progressLabel: "Quest Progress",
    rewardsLabel: "Rewards",
    completeButtonText: "Complete Quest",
    stepsLabel: "Quest Steps",
    requirementsLabel: "Requirements"
  },
  older: {
    title: {
      daily: "Daily Challenge",
      quiz: "Financial Quiz",
      achievement: "Investment Achievement",
      scenario: "Market Scenario"
    },
    difficultyLabels: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced"
    },
    progressLabel: "Progress",
    rewardsLabel: "Rewards",
    completeButtonText: "Complete Challenge",
    stepsLabel: "Steps to Complete",
    requirementsLabel: "Requirements"
  }
};

const ChallengeCard = ({ challenge, onComplete, ageGroup = 'middle' }) => {
  const api = useApi();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const content = ageContent[ageGroup] || ageContent.middle;
  
  // Provide default values for missing properties
  const { 
    title = "Unknown Challenge",
    description = "No description available",
    type = "daily",
    difficulty = "beginner",
    requirements = {
      description: "No requirements specified",
      type: "unknown",
      steps: []
    },
    rewards = {
      experience: 0,
      badges: []
    },
    progress = 0,
    _id,
    id
  } = challenge || {};

  // Make sure requirements has a description
  if (!requirements.description) {
    requirements.description = `Complete the ${requirements.type || ''} challenge`;
  }
  
  // Create steps if they don't exist
  const steps = requirements.steps || [
    { description: requirements.description, completed: progress >= 25 },
    { description: "Continue learning and practicing", completed: progress >= 50 },
    { description: "Apply what you've learned", completed: progress >= 75 },
    { description: "Complete the final task", completed: progress >= 100 }
  ];

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      const challengeId = _id || id;
      if (!challengeId) {
        console.error('Missing challenge ID');
        return;
      }
      
      await api.post(`/challenges/${challengeId}/complete`);
      setShowConfetti(true);
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) {
          onComplete(challengeId);
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getChallengeIcon = () => {
    switch (type) {
      case 'daily':
        return <SportsEsportsIcon color="primary" />;
      case 'quiz':
        return <SchoolIcon color="primary" />;
      case 'achievement':
        return <EmojiEventsIcon color="primary" />;
      case 'scenario':
        return <ExtensionIcon color="primary" />;
      default:
        return <DiamondIcon color="primary" />;
    }
  };
  
  const getChallengeTitle = () => {
    const typeTitle = content.title[type] || type;
    return `${typeTitle}: ${title}`;
  };
  
  const getStepIcon = (index, completed) => {
    const color = completed ? 'success' : 'disabled';
    switch (index) {
      case 0:
        return <LooksOneIcon color={color} />;
      case 1:
        return <LooksTwoIcon color={color} />;
      case 2:
        return <Looks3Icon color={color} />;
      case 3:
        return <Looks4Icon color={color} />;
      default:
        return <CheckCircleIcon color={color} />;
    }
  };

  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      difficulty={difficulty}
      whileHover={{ scale: 1.02 }}
    >
      {showConfetti && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}>
          <ConfettiExplosion duration={3000} particleCount={100} width={1600} />
        </Box>
      )}
      
      <DifficultyChip
        label={content.difficultyLabels[difficulty] || difficulty}
        difficulty={difficulty}
        size="small"
      />
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            mr: 2, 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'rgba(33, 150, 243, 0.1)'
          }}>
            {getChallengeIcon()}
          </Box>
          <Typography variant="h6">
            {getChallengeTitle()}
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            fontSize: ageGroup === 'younger' ? '1rem' : '0.875rem',
            fontWeight: ageGroup === 'younger' ? 'medium' : 'normal'
          }}
        >
          {description}
        </Typography>

        {/* Progress Bar with Markers */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon fontSize="small" sx={{ mr: 1 }} />
            {content.progressLabel}
          </Typography>
          
          <ProgressContainer>
            <StyledProgress
              variant="determinate"
              value={progress}
            />
            <ProgressMarker position={25} completed={progress >= 25}>
              <StarIcon fontSize="small" />
              <Typography variant="caption">25%</Typography>
            </ProgressMarker>
            <ProgressMarker position={50} completed={progress >= 50}>
              <StarIcon fontSize="small" />
              <Typography variant="caption">50%</Typography>
            </ProgressMarker>
            <ProgressMarker position={75} completed={progress >= 75}>
              <StarIcon fontSize="small" />
              <Typography variant="caption">75%</Typography>
            </ProgressMarker>
            <ProgressMarker position={100} completed={progress >= 100}>
              <StarIcon fontSize="small" />
              <Typography variant="caption">100%</Typography>
            </ProgressMarker>
          </ProgressContainer>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 3, textAlign: 'center', fontWeight: progress >= 100 ? 'bold' : 'normal' }}
          >
            {progress >= 100 
              ? "Challenge Complete! 🎉" 
              : `${Math.round(progress)}% Complete - Keep Going!`}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </Button>

        <Collapse in={expanded}>
          {/* Requirements */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {content.requirementsLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {requirements.description}
            </Typography>
            
            {/* Steps */}
            {steps && steps.length > 0 && (
              <StepsContainer>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  {content.stepsLabel}:
                </Typography>
                {steps.map((step, index) => (
                  <StepItem key={index} completed={step.completed}>
                    <Box sx={{ mr: 1 }}>
                      {getStepIcon(index, step.completed)}
                    </Box>
                    <Typography variant="body2">{step.description}</Typography>
                  </StepItem>
                ))}
              </StepsContainer>
            )}
          </Box>

          {/* Rewards */}
          <RewardBox>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              {content.rewardsLabel}:
            </Typography>
            <Chip
              icon={<StarIcon />}
              label={`${rewards.experience} XP`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            {rewards.badges && rewards.badges.map((badge, index) => (
              <Chip
                key={index}
                icon={<PetsIcon />}
                label={badge.name}
                color="secondary"
                size="small"
                variant="outlined"
              />
            ))}
          </RewardBox>
        </Collapse>

        {/* Complete Button */}
        {progress >= 100 && onComplete && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ 
              mt: 2,
              py: 1.5,
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
              }
            }}
            onClick={handleComplete}
            disabled={isCompleting}
            startIcon={<CheckCircleIcon />}
          >
            {isCompleting ? "Completing..." : content.completeButtonText}
          </Button>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ChallengeCard; 