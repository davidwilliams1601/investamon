import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, LinearProgress, Chip, Button, Collapse, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PetsIcon from '@mui/icons-material/Pets';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  border: '3px solid #E0E0E0',
  borderRadius: '16px',
  '&:hover': {
    transform: 'translateY(-8px) rotate(1deg)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  }
}));

const TraitBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
}));

const TraitLabel = styled(Typography)(({ theme }) => ({
  minWidth: '80px',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: '4px',
    fontSize: '1rem',
  }
}));

const BadgeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px',
}));

const ColorfulLinearProgress = styled(LinearProgress)(({ color, theme }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    backgroundColor: color || theme.palette.primary.main,
  }
}));

const CardOverlay = styled(Box)(({ show, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: show ? 'flex' : 'none',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  color: 'white',
  zIndex: 10,
}));

// Terms and visuals for different age groups
const ageContent = {
  younger: {
    traitLabels: {
      resilience: 'Toughness',
      growth: 'Growing Power',
      momentum: 'Speed',
      stability: 'Steadiness'
    },
    colors: {
      resilience: '#8C52FF', // purple
      growth: '#25D366', // green
      momentum: '#FF5630', // red
      stability: '#4299E1' // blue
    },
    description: "This monster helps you learn about money!",
    marketLabel: "Monster Mood",
    experienceLabel: "Monster Power"
  },
  middle: {
    traitLabels: {
      resilience: 'Defense Power',
      growth: 'Growth Rate',
      momentum: 'Momentum',
      stability: 'Stability'
    },
    colors: {
      resilience: '#8C52FF',
      growth: '#25D366',
      momentum: '#FF5630',
      stability: '#4299E1'
    },
    description: "This character represents a real company in the stock market.",
    marketLabel: "Market Performance",
    experienceLabel: "Experience Points"
  },
  older: {
    traitLabels: {
      resilience: 'Resilience',
      growth: 'Growth',
      momentum: 'Momentum',
      stability: 'Stability'
    },
    colors: {
      resilience: '#8C52FF',
      growth: '#25D366',
      momentum: '#FF5630',
      stability: '#4299E1'
    },
    description: "This investment character represents a company's stock performance.",
    marketLabel: "Market Status",
    experienceLabel: "Experience"
  }
};

const CharacterCard = ({ character, ageGroup = 'middle' }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const content = ageContent[ageGroup] || ageContent.middle;
  
  // Provide default values for potentially missing properties
  const {
    name = 'Unknown',
    description = 'No description available',
    imageUrl = 'https://via.placeholder.com/200',
    traits = {
      resilience: 50,
      growth: 50,
      momentum: 50,
      stability: 50
    },
    evolution = {
      level: 1,
      experience: 0,
      badges: []
    },
    marketData = {
      priceChange: 0,
      priceChangePercent: 0
    },
    level = 1,
    experience = 0,
    companyName = '',
  } = character || {};

  // If we have level/experience from the API response directly, use them
  if (level && !evolution.level) {
    evolution.level = level;
  }
  
  if (experience && !evolution.experience) {
    evolution.experience = experience;
  }
  
  // Simplified description based on age group
  const getSimplifiedDescription = () => {
    if (ageGroup === 'younger') {
      return `This friendly monster is called ${name} and helps you learn about money!`;
    } else if (ageGroup === 'middle') {
      return `${name} represents ${companyName || 'a company'} and helps you understand how companies work.`;
    } else {
      return description || `${name} represents ${companyName || 'a company'} in your investment portfolio.`;
    }
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <CardOverlay show={showInfo}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          All About {name}
        </Typography>
        <Typography sx={{ mb: 2, textAlign: 'center' }}>
          {content.description}
        </Typography>
        {companyName && (
          <Typography sx={{ mb: 2, textAlign: 'center' }}>
            Real company: {companyName}
          </Typography>
        )}
        <Button 
          variant="contained" 
          color="secondary"
          onClick={toggleInfo}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </CardOverlay>
      
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          bgcolor: 'rgba(0,0,0,0.6)', 
          color: 'white',
          p: '3px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">Level {evolution.level}</Typography>
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ textShadow: '1px 1px 3px #000' }}>
            {name}
          </Typography>
          
          <Tooltip title="Learn more about this character">
            <Button 
              size="small" 
              variant="contained" 
              color="secondary" 
              sx={{ minWidth: '30px', width: '30px', height: '30px', p: 0, borderRadius: '50%' }}
              onClick={toggleInfo}
            >
              <InfoIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      
      <CardContent>
        {companyName && ageGroup !== 'younger' && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {companyName}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {getSimplifiedDescription()}
        </Typography>
        
        {/* Market Performance with icon */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          p: 1,
          borderRadius: '8px',
          bgcolor: marketData.priceChange >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'
        }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            {content.marketLabel}:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {marketData.priceChange >= 0 ? (
              <>
                <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {ageGroup === 'younger' ? 'Happy' : `+${marketData.priceChangePercent.toFixed(2)}%`}
                </Typography>
              </>
            ) : (
              <>
                <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {ageGroup === 'younger' ? 'Sad' : `${marketData.priceChangePercent.toFixed(2)}%`}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Button 
          variant="outlined" 
          color="primary" 
          size="small" 
          fullWidth
          onClick={() => setExpanded(!expanded)}
          sx={{ mb: 1 }}
        >
          {expanded ? 'Hide Monster Stats' : 'Show Monster Stats'}
        </Button>

        <Collapse in={expanded}>
          {/* Traits */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              <PetsIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
              Character Traits
            </Typography>
            
            <TraitBar>
              <TraitLabel>{content.traitLabels.resilience}</TraitLabel>
              <ColorfulLinearProgress
                variant="determinate"
                value={traits.resilience}
                color={content.colors.resilience}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Typography variant="body2">{traits.resilience}%</Typography>
            </TraitBar>
            
            <TraitBar>
              <TraitLabel>{content.traitLabels.growth}</TraitLabel>
              <ColorfulLinearProgress
                variant="determinate"
                value={traits.growth}
                color={content.colors.growth}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Typography variant="body2">{traits.growth}%</Typography>
            </TraitBar>
            
            <TraitBar>
              <TraitLabel>{content.traitLabels.momentum}</TraitLabel>
              <ColorfulLinearProgress
                variant="determinate"
                value={traits.momentum}
                color={content.colors.momentum}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Typography variant="body2">{traits.momentum}%</Typography>
            </TraitBar>
            
            <TraitBar>
              <TraitLabel>{content.traitLabels.stability}</TraitLabel>
              <ColorfulLinearProgress
                variant="determinate"
                value={traits.stability}
                color={content.colors.stability}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Typography variant="body2">{traits.stability}%</Typography>
            </TraitBar>
          </Box>

          {/* Experience */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {content.experienceLabel}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(evolution.experience % 100)}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {evolution.experience} XP • {100 - (evolution.experience % 100)} XP until level {evolution.level + 1}
            </Typography>
          </Box>

          {/* Badges - only show if badges exist and have length */}
          {evolution.badges && evolution.badges.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Badges
              </Typography>
              <BadgeContainer>
                {evolution.badges.map((badge, index) => (
                  <Chip
                    key={index}
                    label={badge.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: '12px' }}
                  />
                ))}
              </BadgeContainer>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default CharacterCard; 