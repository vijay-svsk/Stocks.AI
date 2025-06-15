import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StockCardProps = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation?: 'buy' | 'sell' | 'hold';
  aiScore?: number;
  onPress?: () => void;
};

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  recommendation,
  aiScore,
  onPress,
}) => {
  const isPositive = change >= 0;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        {recommendation && (
          <View style={[
            styles.recommendationBadge,
            recommendation === 'buy' ? styles.buyBadge : 
            recommendation === 'sell' ? styles.sellBadge : styles.holdBadge
          ]}>
            <Text style={styles.recommendationText}>
              {recommendation.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={styles.changeContainer}>
          <Ionicons 
            name={isPositive ? 'caret-up' : 'caret-down'} 
            size={16} 
            color={isPositive ? '#16a34a' : '#dc2626'} 
          />
          <Text style={[
            styles.change,
            isPositive ? styles.positive : styles.negative
          ]}>
            {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
          </Text>
        </View>
      </View>
      
      {aiScore !== undefined && (
        <View style={styles.aiScoreContainer}>
          <Text style={styles.aiScoreLabel}>AI Score:</Text>
          <View style={[styles.aiScoreBadge, getAiScoreStyle(aiScore)]}>
            <Text style={styles.aiScoreText}>{aiScore.toFixed(1)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getAiScoreStyle = (score: number) => {
  if (score >= 8.5) return styles.highScore;
  if (score >= 7) return styles.mediumScore;
  return styles.lowScore;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  name: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 2,
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  recommendationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buyBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  sellBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  holdBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  aiScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  aiScoreLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  aiScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  aiScoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  highScore: {
    backgroundColor: '#16a34a',
  },
  mediumScore: {
    backgroundColor: '#eab308',
  },
  lowScore: {
    backgroundColor: '#dc2626',
  },
});

export default StockCard;