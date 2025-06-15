import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StartupCardProps = {
  name: string;
  sector: string;
  description: string;
  aiScore: number;
  growthPotential: number;
  recommendation: string;
  onPress?: () => void;
};

const StartupCard: React.FC<StartupCardProps> = ({
  name,
  sector,
  description,
  aiScore,
  growthPotential,
  recommendation,
  onPress,
}) => {
  const isStrongBuy = recommendation.toLowerCase().includes('strong');
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={[
          styles.recommendationBadge,
          isStrongBuy ? styles.strongBuyBadge : styles.buyBadge
        ]}>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      </View>
      
      <View style={styles.sectorContainer}>
        <Ionicons name="business-outline" size={14} color="#6b7280" />
        <Text style={styles.sector}>{sector}</Text>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>AI Score</Text>
          <View style={[styles.metricValueContainer, getAiScoreStyle(aiScore)]}>
            <Text style={styles.metricValue}>{aiScore.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Growth Potential</Text>
          <View style={[styles.metricValueContainer, getGrowthStyle(growthPotential)]}>
            <Text style={styles.metricValue}>{growthPotential}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getAiScoreStyle = (score: number) => {
  if (score >= 8.5) return styles.highScore;
  if (score >= 7) return styles.mediumScore;
  return styles.lowScore;
};

const getGrowthStyle = (potential: number) => {
  if (potential >= 85) return styles.highGrowth;
  if (potential >= 70) return styles.mediumGrowth;
  return styles.lowGrowth;
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
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  sectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sector: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  strongBuyBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  buyBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  metricValue: {
    fontSize: 14,
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
  highGrowth: {
    backgroundColor: '#16a34a',
  },
  mediumGrowth: {
    backgroundColor: '#eab308',
  },
  lowGrowth: {
    backgroundColor: '#3b82f6',
  },
});

export default StartupCard;