import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AIModelResult = {
  model: 'gemini' | 'groq' | 'openai' | 'ensemble';
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-1
  reasoning: string;
  timeframe: 'short' | 'medium' | 'long';
  priceTarget?: number;
  riskLevel: 'low' | 'medium' | 'high';
  supportingFactors: string[];
};

type MultiModelAIProps = {
  symbol: string;
  price: number;
  onAnalysisComplete?: (results: AIModelResult[]) => void;
  isLoading?: boolean;
};

// Mock function to simulate AI model analysis
const generateAIModelResults = (symbol: string, price: number): AIModelResult[] => {
  const models: ('gemini' | 'groq' | 'openai' | 'ensemble')[] = ['gemini', 'groq', 'openai', 'ensemble'];
  const recommendations: ('buy' | 'sell' | 'hold')[] = ['buy', 'sell', 'hold'];
  const timeframes: ('short' | 'medium' | 'long')[] = ['short', 'medium', 'long'];
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  
  // Generate a random recommendation bias (to make models somewhat agree)
  const recommendationBias = Math.random();
  
  // Generate supporting factors
  const potentialFactors = [
    'Strong quarterly earnings',
    'Positive analyst ratings',
    'Expanding market share',
    'New product launches',
    'Strategic acquisitions',
    'Industry leadership',
    'Technical indicators',
    'Valuation metrics',
    'Sector performance',
    'Economic outlook',
    'Management changes',
    'Regulatory environment'
  ];
  
  return models.map(model => {
    // Use bias to influence recommendation (but still allow for disagreement)
    let recommendation: 'buy' | 'sell' | 'hold';
    if (recommendationBias > 0.7) {
      recommendation = Math.random() > 0.3 ? 'buy' : Math.random() > 0.5 ? 'hold' : 'sell';
    } else if (recommendationBias < 0.3) {
      recommendation = Math.random() > 0.3 ? 'sell' : Math.random() > 0.5 ? 'hold' : 'buy';
    } else {
      recommendation = Math.random() > 0.3 ? 'hold' : Math.random() > 0.5 ? 'buy' : 'sell';
    }
    
    // Generate confidence (ensemble model usually has higher confidence)
    const confidence = model === 'ensemble' 
      ? 0.7 + Math.random() * 0.25 
      : 0.5 + Math.random() * 0.4;
    
    // Generate price target (if buy or sell)
    const priceTarget = recommendation !== 'hold' 
      ? recommendation === 'buy' 
        ? price * (1 + (Math.random() * 0.2 + 0.05)) 
        : price * (1 - (Math.random() * 0.15 + 0.05))
      : undefined;
    
    // Generate reasoning
    const reasoningTemplates = {
      buy: [
        `${symbol} shows strong growth potential based on recent performance metrics and industry trends.`,
        `Technical indicators and fundamental analysis suggest ${symbol} is undervalued at current price levels.`,
        `${symbol}'s strategic initiatives and market position indicate potential for significant upside.`
      ],
      sell: [
        `${symbol} faces significant headwinds that may impact future performance and valuation.`,
        `Technical analysis indicates ${symbol} is overbought and due for a correction.`,
        `${symbol}'s competitive position is weakening, suggesting potential downside risk.`
      ],
      hold: [
        `${symbol} is fairly valued at current levels, with balanced risk and reward potential.`,
        `While ${symbol} has positive long-term prospects, short-term volatility suggests caution.`,
        `${symbol} shows mixed signals, with some positive indicators offset by potential challenges.`
      ]
    };
    
    const reasoning = reasoningTemplates[recommendation][Math.floor(Math.random() * 3)];
    
    // Select random timeframe with bias toward medium
    const timeframe = Math.random() > 0.6 ? 'medium' : Math.random() > 0.5 ? 'short' : 'long';
    
    // Select risk level (correlated with recommendation)
    const riskLevel = recommendation === 'buy' 
      ? (Math.random() > 0.7 ? 'medium' : 'high') 
      : recommendation === 'sell' 
        ? (Math.random() > 0.7 ? 'high' : 'medium') 
        : (Math.random() > 0.7 ? 'medium' : 'low');
    
    // Select supporting factors
    const factorCount = 2 + Math.floor(Math.random() * 3);
    const supportingFactors = [...potentialFactors]
      .sort(() => Math.random() - 0.5)
      .slice(0, factorCount);
    
    return {
      model,
      recommendation,
      confidence,
      reasoning,
      timeframe,
      priceTarget,
      riskLevel,
      supportingFactors
    };
  });
};

const MultiModelAI: React.FC<MultiModelAIProps> = ({
  symbol,
  price,
  onAnalysisComplete,
  isLoading = false,
}) => {
  React.useEffect(() => {
    if (!isLoading) {
      // In a real app, this would be API calls to different AI models
      const results = generateAIModelResults(symbol, price);
      
      // Simulate a delay for the analysis
      const timer = setTimeout(() => {
        if (onAnalysisComplete) {
          onAnalysisComplete(results);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [symbol, price, isLoading, onAnalysisComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Model AI Analysis</Text>
      <Text style={styles.subtitle}>Analyzing {symbol} with multiple AI models</Text>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Consulting multiple AI models...</Text>
        </View>
      )}
    </View>
  );
};

type MultiModelResultsProps = {
  results: AIModelResult[];
  symbol: string;
  currentPrice: number;
};

export const MultiModelResults: React.FC<MultiModelResultsProps> = ({
  results,
  symbol,
  currentPrice,
}) => {
  // Get the ensemble model result (should be the most reliable)
  const ensembleResult = results.find(r => r.model === 'ensemble') || results[0];
  
  // Count model recommendations
  const recommendations = {
    buy: results.filter(r => r.recommendation === 'buy').length,
    sell: results.filter(r => r.recommendation === 'sell').length,
    hold: results.filter(r => r.recommendation === 'hold').length,
  };
  
  // Determine consensus
  const consensusCount = Math.max(recommendations.buy, recommendations.sell, recommendations.hold);
  let consensus: 'buy' | 'sell' | 'hold' | 'mixed' = 'mixed';
  
  if (consensusCount >= 3) {
    if (recommendations.buy === consensusCount) consensus = 'buy';
    else if (recommendations.sell === consensusCount) consensus = 'sell';
    else if (recommendations.hold === consensusCount) consensus = 'hold';
  }
  
  // Helper function to get color based on recommendation
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy': return '#10b981';
      case 'sell': return '#ef4444';
      case 'hold': return '#f59e0b';
      default: return '#6b7280';
    }
  };
  
  // Helper function to get icon based on recommendation
  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'buy': return 'trending-up';
      case 'sell': return 'trending-down';
      case 'hold': return 'remove';
      default: return 'help-circle';
    }
  };
  
  // Helper function to format confidence as percentage
  const formatConfidence = (confidence: number) => `${Math.round(confidence * 100)}%`;
  
  // Helper function to format price target
  const formatPriceTarget = (target?: number) => {
    if (!target) return 'N/A';
    const change = ((target - currentPrice) / currentPrice) * 100;
    const sign = change >= 0 ? '+' : '';
    return `₹${target.toFixed(2)} (${sign}${change.toFixed(2)}%)`;
  };

  return (
    <ScrollView style={styles.resultsContainer}>
      <View style={styles.consensusContainer}>
        <Text style={styles.consensusTitle}>AI Consensus</Text>
        <View style={[
          styles.consensusBadge, 
          { backgroundColor: getRecommendationColor(consensus) }
        ]}>
          <Ionicons 
            name={getRecommendationIcon(consensus) as any} 
            size={20} 
            color="white" 
          />
          <Text style={styles.consensusBadgeText}>
            {consensus.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.consensusSubtitle}>
          {consensus === 'mixed' 
            ? 'Models have different opinions. Consider additional research.' 
            : `${consensusCount} out of ${results.length} models recommend ${consensus.toUpperCase()}`}
        </Text>
      </View>
      
      <View style={styles.ensembleContainer}>
        <View style={styles.ensembleHeader}>
          <Text style={styles.ensembleTitle}>Ensemble Model Analysis</Text>
          <View style={[
            styles.recommendationBadge, 
            { backgroundColor: getRecommendationColor(ensembleResult.recommendation) }
          ]}>
            <Text style={styles.recommendationText}>
              {ensembleResult.recommendation.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.ensembleReasoning}>{ensembleResult.reasoning}</Text>
        
        <View style={styles.ensembleStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Confidence</Text>
            <Text style={styles.statValue}>{formatConfidence(ensembleResult.confidence)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Timeframe</Text>
            <Text style={styles.statValue}>
              {ensembleResult.timeframe === 'short' ? 'Short-term' : 
               ensembleResult.timeframe === 'medium' ? 'Medium-term' : 'Long-term'}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Risk Level</Text>
            <Text style={[
              styles.statValue,
              { 
                color: ensembleResult.riskLevel === 'low' ? '#10b981' : 
                       ensembleResult.riskLevel === 'medium' ? '#f59e0b' : '#ef4444' 
              }
            ]}>
              {ensembleResult.riskLevel.charAt(0).toUpperCase() + ensembleResult.riskLevel.slice(1)}
            </Text>
          </View>
        </View>
        
        {ensembleResult.priceTarget && (
          <View style={styles.priceTargetContainer}>
            <Text style={styles.priceTargetLabel}>Price Target:</Text>
            <Text style={[
              styles.priceTargetValue,
              { 
                color: ensembleResult.priceTarget > currentPrice ? '#10b981' : '#ef4444' 
              }
            ]}>
              {formatPriceTarget(ensembleResult.priceTarget)}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.modelsTitle}>Individual Model Recommendations</Text>
      
      {results.filter(r => r.model !== 'ensemble').map((result, index) => (
        <View key={index} style={styles.modelCard}>
          <View style={styles.modelHeader}>
            <View style={styles.modelNameContainer}>
              <Text style={styles.modelName}>
                {result.model.charAt(0).toUpperCase() + result.model.slice(1)}
              </Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {formatConfidence(result.confidence)}
                </Text>
              </View>
            </View>
            <View style={[
              styles.modelRecommendation,
              { backgroundColor: getRecommendationColor(result.recommendation) }
            ]}>
              <Ionicons 
                name={getRecommendationIcon(result.recommendation) as any} 
                size={16} 
                color="white" 
              />
              <Text style={styles.modelRecommendationText}>
                {result.recommendation.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.modelReasoning}>{result.reasoning}</Text>
          
          <View style={styles.modelFactors}>
            <Text style={styles.factorsTitle}>Supporting Factors:</Text>
            {result.supportingFactors.map((factor, i) => (
              <View key={i} style={styles.factorItem}>
                <Ionicons name="checkmark-circle" size={14} color="#4F46E5" />
                <Text style={styles.factorText}>{factor}</Text>
              </View>
            ))}
          </View>
          
          {result.priceTarget && (
            <View style={styles.modelPriceTarget}>
              <Text style={styles.modelTargetLabel}>Target:</Text>
              <Text style={[
                styles.modelTargetValue,
                { 
                  color: result.priceTarget > currentPrice ? '#10b981' : '#ef4444' 
                }
              ]}>
                {formatPriceTarget(result.priceTarget)}
              </Text>
            </View>
          )}
        </View>
      ))}
      
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color="#6b7280" />
        <Text style={styles.disclaimerText}>
          AI models provide analysis based on available data and patterns. Always conduct your own research before making investment decisions.
        </Text>
      </View>
    </ScrollView>
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
  resultsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consensusContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  consensusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  consensusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  consensusBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  consensusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  ensembleContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ensembleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ensembleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recommendationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  recommendationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  ensembleReasoning: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  ensembleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  priceTargetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  priceTargetLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginRight: 8,
  },
  priceTargetValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  modelsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  modelCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  confidenceBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '500',
  },
  modelRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  modelRecommendationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  modelReasoning: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  modelFactors: {
    marginBottom: 12,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorText: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 6,
  },
  modelPriceTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modelTargetLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
    marginRight: 8,
  },
  modelTargetValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
});

export default MultiModelAI;