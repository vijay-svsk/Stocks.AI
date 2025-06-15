import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import type { PredictionData } from './PredictionEngine';

type PredictionResultProps = {
  data: PredictionData;
  timeframe?: 'short' | 'medium' | 'long';
};

const PredictionResult: React.FC<PredictionResultProps> = ({ 
  data,
  timeframe = 'medium'
}) => {
  // Determine how much of the prediction to show based on timeframe
  const predictionPoints = timeframe === 'short' ? 5 : timeframe === 'medium' ? 10 : 14;
  
  // Prepare chart data
  const chartData = {
    labels: data.timeLabels.slice(0, 30 + predictionPoints).filter((_, i) => i % 5 === 0),
    datasets: [
      {
        data: [...data.historicalPrices, ...data.predictedPrices.slice(0, predictionPoints)],
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  
  // Determine the prediction boundary for the chart
  const predictionBoundary = data.historicalPrices.length;
  
  // Format confidence as percentage
  const confidencePercent = Math.round(data.confidence * 100);
  
  // Get the appropriate signal based on timeframe
  const signal = timeframe === 'short' 
    ? data.signals.shortTerm 
    : timeframe === 'medium' 
      ? data.signals.mediumTerm 
      : data.signals.longTerm;
  
  // Calculate price change and percentage
  const startPrice = data.historicalPrices[0];
  const endPrice = data.historicalPrices[data.historicalPrices.length - 1];
  const predictedEndPrice = data.predictedPrices[predictionPoints - 1];
  
  const historicalChange = endPrice - startPrice;
  const historicalChangePercent = (historicalChange / startPrice) * 100;
  
  const predictedChange = predictedEndPrice - endPrice;
  const predictedChangePercent = (predictedChange / endPrice) * 100;
  
  // Determine colors based on changes
  const historicalColor = historicalChange >= 0 ? '#10b981' : '#ef4444';
  const predictedColor = predictedChange >= 0 ? '#10b981' : '#ef4444';
  
  // Determine signal icon and color
  const getSignalIcon = (sig: string) => {
    switch (sig) {
      case 'buy': return { name: 'trending-up', color: '#10b981' };
      case 'sell': return { name: 'trending-down', color: '#ef4444' };
      default: return { name: 'remove', color: '#f59e0b' };
    }
  };
  
  const signalInfo = getSignalIcon(signal);
  
  // Determine timeframe text
  const timeframeText = timeframe === 'short' 
    ? 'Short-term (1-3 days)' 
    : timeframe === 'medium' 
      ? 'Medium-term (1-2 weeks)' 
      : 'Long-term (1 month+)';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Prediction Analysis: {data.symbol}</Text>
        <View style={styles.signalContainer}>
          <Ionicons name={signalInfo.name as any} size={24} color={signalInfo.color} />
          <Text style={[styles.signalText, { color: signalInfo.color }]}>
            {signal.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.timeframeText}>{timeframeText}</Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '2',
              strokeWidth: '1',
              stroke: '#4F46E5',
            },
          }}
          bezier
          style={styles.chart}
          withDots={false}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
        />
        <View style={[styles.predictionLine, { left: `${(predictionBoundary / (30 + predictionPoints)) * 100}%` }]} />
        <Text style={styles.predictionLabel}>Prediction</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Historical</Text>
          <Text style={[styles.statValue, { color: historicalColor }]}>
            {historicalChange >= 0 ? '+' : ''}{historicalChange.toFixed(2)} ({historicalChangePercent.toFixed(2)}%)
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Predicted</Text>
          <Text style={[styles.statValue, { color: predictedColor }]}>
            {predictedChange >= 0 ? '+' : ''}{predictedChange.toFixed(2)} ({predictedChangePercent.toFixed(2)}%)
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statValue}>{confidencePercent}%</Text>
        </View>
      </View>
      
      <View style={styles.sentimentContainer}>
        <Text style={styles.sectionTitle}>Sentiment Analysis</Text>
        <View style={styles.sentimentRow}>
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>News</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.news * 100}%`,
                    backgroundColor: data.sentiment.news > 0.5 ? '#10b981' : '#ef4444'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.news * 100)}%</Text>
          </View>
          
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>Social</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.social * 100}%`,
                    backgroundColor: data.sentiment.social > 0.5 ? '#10b981' : '#ef4444'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.social * 100)}%</Text>
          </View>
          
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>Overall</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.overall * 100}%`,
                    backgroundColor: data.sentiment.overall > 0.5 ? '#10b981' : '#ef4444'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.overall * 100)}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.factorsContainer}>
        <View style={styles.factorSection}>
          <Text style={styles.sectionTitle}>Supporting Factors</Text>
          {data.supportingFactors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.factorSection}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          {data.riskFactors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color="#6b7280" />
        <Text style={styles.disclaimerText}>
          Predictions are based on historical data and AI analysis. Past performance does not guarantee future results.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signalText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  timeframeText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    paddingRight: 0,
  },
  predictionLine: {
    position: 'absolute',
    top: 30,
    bottom: 30,
    width: 1,
    backgroundColor: '#4F46E5',
    borderStyle: 'dashed',
  },
  predictionLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4F46E5',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sentimentContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sentimentRow: {
    marginBottom: 8,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentLabel: {
    width: 60,
    fontSize: 14,
    color: '#4b5563',
  },
  sentimentBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  sentimentFill: {
    height: '100%',
    borderRadius: 4,
  },
  sentimentValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  factorsContainer: {
    marginBottom: 16,
  },
  factorSection: {
    marginBottom: 16,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  disclaimerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
});

export default PredictionResult;