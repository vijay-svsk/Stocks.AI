import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SentimentScore = {
  positive: number;
  negative: number;
  neutral: number;
  overall: number; // -1 to 1 scale
};

export type NLPAnalysisResult = {
  sentiment: SentimentScore;
  keywords: string[];
  entities: {
    name: string;
    type: string;
    sentiment: number; // -1 to 1 scale
  }[];
  summary: string;
  topics: {
    name: string;
    confidence: number;
  }[];
};

type NLPAnalyzerProps = {
  symbol: string;
  newsHeadlines?: string[];
  socialPosts?: string[];
  onAnalysisComplete?: (result: NLPAnalysisResult) => void;
  isLoading?: boolean;
};

// Mock function to simulate NLP analysis
// In a real app, this would use a library like compromise.js or call an API
const performNLPAnalysis = (symbol: string, headlines: string[] = [], posts: string[] = []): NLPAnalysisResult => {
  // Generate mock sentiment scores
  const sentiment: SentimentScore = {
    positive: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
    negative: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
    neutral: 0, // Will calculate
    overall: 0, // Will calculate
  };
  
  // Calculate neutral and overall
  sentiment.neutral = 1 - sentiment.positive - sentiment.negative;
  sentiment.overall = (sentiment.positive - sentiment.negative) * 2 - 1; // Convert to -1 to 1 scale
  
  // Generate mock keywords
  const potentialKeywords = [
    'earnings', 'growth', 'revenue', 'profit', 'loss', 'expansion',
    'acquisition', 'merger', 'CEO', 'quarterly', 'forecast', 'guidance',
    'dividend', 'investment', 'technology', 'market', 'competition',
    'regulation', 'innovation', 'sustainability', 'digital', 'transformation'
  ];
  
  const keywords = potentialKeywords
    .sort(() => Math.random() - 0.5)
    .slice(0, 5 + Math.floor(Math.random() * 5));
  
  // Generate mock entities
  const potentialEntities = [
    { name: 'SEBI', type: 'Organization' },
    { name: 'RBI', type: 'Organization' },
    { name: 'Finance Minister', type: 'Person' },
    { name: 'India', type: 'Location' },
    { name: 'Mumbai', type: 'Location' },
    { name: 'CEO', type: 'Person' },
    { name: 'Q2 2025', type: 'Time' },
    { name: 'Fiscal Year', type: 'Time' },
    { name: symbol, type: 'Organization' },
  ];
  
  const entities = potentialEntities
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3))
    .map(entity => ({
      ...entity,
      sentiment: (Math.random() * 2 - 1) * 0.8, // -0.8 to 0.8
    }));
  
  // Generate mock topics
  const potentialTopics = [
    'Quarterly Earnings', 'Market Expansion', 'Product Launch',
    'Industry Trends', 'Regulatory Changes', 'Economic Outlook',
    'Competitive Analysis', 'Technology Innovation', 'Leadership Changes',
    'Financial Performance', 'Market Share', 'Customer Growth'
  ];
  
  const topics = potentialTopics
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(topic => ({
      name: topic,
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    }));
  
  // Generate mock summary
  const summaries = [
    `Recent news and social media sentiment for ${symbol} is predominantly ${sentiment.overall > 0 ? 'positive' : 'negative'}, with discussions focused on ${keywords.slice(0, 3).join(', ')}.`,
    `Analysis of ${headlines.length} news articles and ${posts.length} social posts reveals ${sentiment.overall > 0 ? 'optimistic' : 'cautious'} market sentiment toward ${symbol}.`,
    `${symbol} is generating ${sentiment.overall > 0 ? 'favorable' : 'mixed'} attention in financial media, with emphasis on ${topics[0].name.toLowerCase()} and ${topics[1].name.toLowerCase()}.`
  ];
  
  return {
    sentiment,
    keywords,
    entities,
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    topics,
  };
};

const NLPAnalyzer: React.FC<NLPAnalyzerProps> = ({
  symbol,
  newsHeadlines = [],
  socialPosts = [],
  onAnalysisComplete,
  isLoading = false,
}) => {
  React.useEffect(() => {
    if (!isLoading) {
      // In a real app, this would be an API call or NLP library processing
      const analysisResult = performNLPAnalysis(symbol, newsHeadlines, socialPosts);
      
      // Simulate a delay for the analysis
      const timer = setTimeout(() => {
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResult);
        }
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [symbol, newsHeadlines, socialPosts, isLoading, onAnalysisComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NLP Analysis</Text>
      <Text style={styles.subtitle}>Processing news and social media for {symbol}</Text>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Analyzing sentiment and extracting insights...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
    color: '#4b5563',
    fontSize: 14,
  },
});

export default NLPAnalyzer;