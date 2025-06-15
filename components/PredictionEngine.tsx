import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Types for prediction data
export type PredictionData = {
  symbol: string;
  historicalPrices: number[];
  predictedPrices: number[];
  timeLabels: string[];
  confidence: number;
  sentiment: {
    news: number;
    social: number;
    overall: number;
  };
  signals: {
    shortTerm: 'buy' | 'sell' | 'hold';
    mediumTerm: 'buy' | 'sell' | 'hold';
    longTerm: 'buy' | 'sell' | 'hold';
  };
  supportingFactors: string[];
  riskFactors: string[];
};

type PredictionEngineProps = {
  symbol: string;
  onPredictionComplete?: (data: PredictionData) => void;
  isLoading?: boolean;
};

// Mock function to simulate ML prediction
// In a real app, this would use TensorFlow.js or a similar library
const generatePrediction = (symbol: string): PredictionData => {
  // Generate random historical data
  const historicalPrices = Array(30).fill(0).map((_, i) => 
    1000 + Math.random() * 200 + i * 5 + Math.sin(i/3) * 50
  );
  
  // Generate predicted prices with some trend and randomness
  const lastPrice = historicalPrices[historicalPrices.length - 1];
  const trend = Math.random() > 0.5 ? 1 : -1;
  const predictedPrices = Array(14).fill(0).map((_, i) => 
    lastPrice + trend * (i * 10) + Math.random() * 50 - 25
  );
  
  // Generate time labels
  const today = new Date();
  const timeLabels = Array(44).fill(0).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - 30 + i);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  // Calculate confidence based on the consistency of the prediction
  const priceChanges = predictedPrices.map((price, i) => 
    i === 0 ? 0 : price - predictedPrices[i-1]
  );
  const changeConsistency = priceChanges.slice(1).filter(
    change => Math.sign(change) === Math.sign(priceChanges[1])
  ).length / (priceChanges.length - 1);
  const confidence = 0.5 + changeConsistency * 0.4 + Math.random() * 0.1;
  
  // Generate sentiment scores
  const newsSentiment = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
  const socialSentiment = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
  const overallSentiment = (newsSentiment * 0.6) + (socialSentiment * 0.4);
  
  // Determine signals based on prediction and sentiment
  const shortTermTrend = (predictedPrices[3] - lastPrice) / lastPrice;
  const mediumTermTrend = (predictedPrices[7] - lastPrice) / lastPrice;
  const longTermTrend = (predictedPrices[13] - lastPrice) / lastPrice;
  
  const getSignal = (trend: number, sentimentWeight: number = 0.3) => {
    const weightedScore = trend + (overallSentiment - 0.5) * sentimentWeight;
    if (weightedScore > 0.02) return 'buy';
    if (weightedScore < -0.02) return 'sell';
    return 'hold';
  };
  
  // Generate supporting and risk factors
  const supportingFactors = [
    'Positive quarterly earnings report',
    'Expansion into new markets',
    'Favorable industry trends',
    'Strong technical indicators',
    'Positive analyst ratings'
  ].sort(() => Math.random() - 0.5).slice(0, 3);
  
  const riskFactors = [
    'Market volatility',
    'Regulatory challenges',
    'Competitive pressures',
    'Supply chain disruptions',
    'Valuation concerns'
  ].sort(() => Math.random() - 0.5).slice(0, 3);
  
  return {
    symbol,
    historicalPrices,
    predictedPrices,
    timeLabels,
    confidence,
    sentiment: {
      news: newsSentiment,
      social: socialSentiment,
      overall: overallSentiment
    },
    signals: {
      shortTerm: getSignal(shortTermTrend, 0.4),
      mediumTerm: getSignal(mediumTermTrend, 0.3),
      longTerm: getSignal(longTermTrend, 0.2)
    },
    supportingFactors,
    riskFactors
  };
};

const PredictionEngine: React.FC<PredictionEngineProps> = ({ 
  symbol, 
  onPredictionComplete,
  isLoading = false
}) => {
  React.useEffect(() => {
    if (!isLoading) {
      // In a real app, this would be an API call or ML model execution
      const predictionData = generatePrediction(symbol);
      
      // Simulate a delay for the prediction calculation
      const timer = setTimeout(() => {
        if (onPredictionComplete) {
          onPredictionComplete(predictionData);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [symbol, isLoading, onPredictionComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Prediction Engine</Text>
      <Text style={styles.subtitle}>Analyzing {symbol} with machine learning models</Text>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Processing market data...</Text>
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

export default PredictionEngine;