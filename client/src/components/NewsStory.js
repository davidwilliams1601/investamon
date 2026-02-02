import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Link, IconButton, Button, Collapse, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SchoolIcon from '@mui/icons-material/School';

const StyledCard = styled(motion(Card))(({ theme, sentiment }) => {
  // Set card styles based on sentiment
  const getBorderColor = () => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return theme.palette.success.light;
      case 'negative':
        return theme.palette.error.light;
      case 'neutral':
      default:
        return theme.palette.info.light;
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

const StoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px',
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '16px',
}));

const LearningBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '12px',
  borderRadius: '8px',
  marginTop: '16px',
  border: `1px dashed ${theme.palette.primary.main}`,
}));

const SentimentAvatar = styled(Avatar)(({ theme, sentiment }) => {
  const getColor = () => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      case 'neutral':
      default:
        return theme.palette.info.main;
    }
  };
  
  return {
    backgroundColor: getColor(),
    marginRight: '12px',
  };
});

// Age-appropriate content
const ageContent = {
  younger: {
    title: "Monster News",
    sentimentLabels: {
      positive: "Happy News",
      negative: "Sad News",
      neutral: "Normal News"
    },
    impactLabels: {
      high: "Big Change",
      medium: "Medium Change",
      low: "Small Change"
    },
    learningPrompt: "Did you know?",
    readMore: "Ask a grown-up to read more",
    keywordLabel: "Fun Facts"
  },
  middle: {
    title: "Character Update",
    sentimentLabels: {
      positive: "Good News",
      negative: "Bad News", 
      neutral: "Neutral News"
    },
    impactLabels: {
      high: "Big Impact",
      medium: "Medium Impact",
      low: "Small Impact"
    },
    learningPrompt: "What does this mean?",
    readMore: "Read more",
    keywordLabel: "Keywords"
  },
  older: {
    title: "Market News",
    sentimentLabels: {
      positive: "Positive",
      negative: "Negative",
      neutral: "Neutral"
    },
    impactLabels: {
      high: "High Impact",
      medium: "Medium Impact", 
      low: "Low Impact"
    },
    learningPrompt: "Learning opportunity:",
    readMore: "Read full article",
    keywordLabel: "Keywords"
  }
};

// Simplified explanations for financial news by age group
const simplifiedExplanations = {
  positive: {
    younger: "This is good news for your monster! It means they're growing stronger.",
    middle: "Good news for this character! The company is doing well, which makes your character more valuable.",
    older: "This positive development could increase the value of your investment in this company."
  },
  negative: {
    younger: "This is not so good news for your monster. But don't worry, they can get stronger again!",
    middle: "This news isn't great for your character. The company is facing some challenges right now.",
    older: "This negative news might affect the company's value in the short term."
  },
  neutral: {
    younger: "This news doesn't change much for your monster right now.",
    middle: "This news doesn't have a big effect on your character's value at the moment.",
    older: "This news has a neutral impact on the company's current market position."
  }
};

const getSimplifiedDescription = (originalDescription, sentiment, ageGroup) => {
  // Keep original description for older kids
  if (ageGroup === 'older') return originalDescription;
  
  // Start with age-appropriate explanation
  const explanation = simplifiedExplanations[sentiment]?.[ageGroup] || originalDescription;
  
  // For younger kids, keep it very simple
  if (ageGroup === 'younger') return explanation;
  
  // For middle group, add a simplified version of the original if it's not too long
  if (ageGroup === 'middle' && originalDescription.length < 120) {
    return `${explanation} ${originalDescription}`;
  }
  
  return explanation;
};

const NewsStory = ({ story, ageGroup = 'middle' }) => {
  const [expanded, setExpanded] = useState(false);
  const content = ageContent[ageGroup] || ageContent.middle;
  
  // Provide default values for all properties that might be missing
  const {
    title = "No title available",
    description = "No description available",
    url = "#",
    source = "Unknown Source",
    publishedAt = new Date().toISOString(),
    sentiment = "neutral",
    impact = "low",
    keywords = [],
    characterName = "Unknown Character",
    priceChange = 0,
    news = {}
  } = story || {};

  // Handle nested news object
  const newsTitle = news?.title || title;
  const newsDescription = news?.description || description;
  const newsUrl = news?.url || url;
  const newsSource = news?.source || source;
  const newsPublishedAt = news?.publishedAt || publishedAt;
  const newsSentiment = news?.sentiment || sentiment;
  const newsImpact = news?.impact || impact;
  const newsKeywords = news?.keywords || keywords;

  // Create a simplified learning point based on news content
  const getLearningPoint = () => {
    if (newsSentiment === 'positive') {
      return ageGroup === 'younger' 
        ? "When good things happen to a company, your monster gets happier!" 
        : "Companies that make good decisions or have popular products often increase in value.";
    } else if (newsSentiment === 'negative') {
      return ageGroup === 'younger'
        ? "Sometimes companies have problems, and that makes your monster a bit sad."
        : "Even successful companies can face challenges that cause their value to drop temporarily.";
    } else {
      return ageGroup === 'younger'
        ? "The news doesn't always change how your monster feels."
        : "Some news doesn't have a big impact on a company's value right away.";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <EmojiEmotionsIcon />;
      case 'negative':
        return <SentimentVeryDissatisfiedIcon />;
      case 'neutral':
      default:
        return <TrendingUpIcon />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
      default:
        return 'info';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (ageGroup === 'younger') {
        return date.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric'
        });
      }
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  // Get appropriate title based on age group
  const getTitle = () => {
    if (ageGroup === 'younger') {
      // Very simple title for younger kids
      return newsSentiment === 'positive'
        ? `${characterName} is having a great day!`
        : newsSentiment === 'negative'
        ? `${characterName} is having a tough day`
        : `News about ${characterName}`;
    } else if (ageGroup === 'middle') {
      // Simplified but with some educational content
      return `${characterName}: ${newsTitle.split(' ').slice(0, 6).join(' ')}${newsTitle.split(' ').length > 6 ? '...' : ''}`;
    } else {
      // Full title for older kids
      return newsTitle;
    }
  };

  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sentiment={newsSentiment}
      whileHover={{ scale: 1.02 }}
    >
      <CardContent>
        <StoryHeader>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <SentimentAvatar sentiment={newsSentiment}>
              {getSentimentIcon(newsSentiment)}
            </SentimentAvatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant={ageGroup === 'younger' ? 'h6' : 'subtitle1'} 
                  sx={{ fontWeight: 'bold', mb: 0.5 }}
                >
                  {getTitle()}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {ageGroup === 'younger' ? 'From: ' : ''}{newsSource} • {formatDate(newsPublishedAt)}
              </Typography>
            </Box>
          </Box>
          
          {newsUrl && ageGroup !== 'younger' && (
            <IconButton
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ ml: 1 }}
              aria-label="Open article in new tab"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          )}
        </StoryHeader>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: priceChange >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            {ageGroup === 'younger' ? `${characterName} is` : `Impact on ${characterName}:`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {priceChange >= 0 ? (
              <>
                <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {ageGroup === 'younger' 
                    ? 'Getting Stronger!' 
                    : ageGroup === 'middle' 
                      ? `Growing by ${priceChange.toFixed(1)}%`
                      : `+${priceChange.toFixed(2)}%`}
                </Typography>
              </>
            ) : (
              <>
                <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {ageGroup === 'younger' 
                    ? 'Having a tough time' 
                    : ageGroup === 'middle'
                      ? `Decreasing by ${Math.abs(priceChange).toFixed(1)}%`
                      : `${priceChange.toFixed(2)}%`}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: ageGroup === 'younger' ? '1rem' : '0.875rem',
            fontWeight: ageGroup === 'younger' ? 500 : 400
          }}
        >
          {getSimplifiedDescription(newsDescription, newsSentiment.toLowerCase(), ageGroup)}
        </Typography>
        
        <Button
          size="small"
          color="primary"
          onClick={() => setExpanded(!expanded)}
          sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {expanded ? "Show Less" : "Learn More"}
        </Button>
        
        <Collapse in={expanded}>
          <LearningBox>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" color="primary.main">
                {content.learningPrompt}
              </Typography>
            </Box>
            <Typography variant="body2">
              {getLearningPoint()}
            </Typography>
            
            {newsUrl && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 2 }}
                startIcon={<OpenInNewIcon />}
              >
                {content.readMore}
              </Button>
            )}
          </LearningBox>

          <ChipContainer>
            <Chip
              label={content.sentimentLabels[newsSentiment] || newsSentiment}
              size="small"
              color={getSentimentColor(newsSentiment)}
            />
            <Chip
              label={content.impactLabels[newsImpact] || newsImpact}
              size="small"
              color={getImpactColor(newsImpact)}
            />
            {newsKeywords && newsKeywords.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1, width: '100%' }}>
                <Typography variant="caption" color="text.secondary">
                  {content.keywordLabel}:
                </Typography>
                {newsKeywords.slice(0, ageGroup === 'younger' ? 2 : 3).map((keyword, index) => (
                  <Chip 
                    key={index} 
                    label={keyword} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderRadius: '12px' }}
                  />
                ))}
              </Box>
            )}
          </ChipContainer>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default NewsStory; 