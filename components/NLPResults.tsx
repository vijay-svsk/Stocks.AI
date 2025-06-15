import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NLPAnalysisResult } from './NLPAnalyzer';

type NLPResultsProps = {
  data: NLPAnalysisResult;
};

const NLPResults: React.FC<NLPResultsProps> = ({ data }) => {
  // Helper function to get color based on sentiment score (-1 to 1)
  const getSentimentColor = (score: number) => {
    if (score > 0.3) return '#10b981'; // positive
    if (score < -0.3) return '#ef4444'; // negative
    return '#f59e0b'; // neutral
  };

  // Helper function to get icon based on sentiment score
  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return 'trending-up';
    if (score < -0.3) return 'trending-down';
    return 'remove';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sentiment & NLP Analysis</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{data.summary}</Text>
      </View>
      
      <View style={styles.sentimentContainer}>
        <Text style={styles.sectionTitle}>Sentiment Breakdown</Text>
        <View style={styles.sentimentRow}>
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>Positive</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.positive * 100}%`,
                    backgroundColor: '#10b981'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.positive * 100)}%</Text>
          </View>
          
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>Negative</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.negative * 100}%`,
                    backgroundColor: '#ef4444'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.negative * 100)}%</Text>
          </View>
          
          <View style={styles.sentimentItem}>
            <Text style={styles.sentimentLabel}>Neutral</Text>
            <View style={styles.sentimentBar}>
              <View 
                style={[
                  styles.sentimentFill, 
                  { 
                    width: `${data.sentiment.neutral * 100}%`,
                    backgroundColor: '#f59e0b'
                  }
                ]} 
              />
            </View>
            <Text style={styles.sentimentValue}>{Math.round(data.sentiment.neutral * 100)}%</Text>
          </View>
        </View>
        
        <View style={styles.overallSentiment}>
          <Text style={styles.overallLabel}>Overall Sentiment:</Text>
          <View style={[
            styles.sentimentBadge, 
            { backgroundColor: getSentimentColor(data.sentiment.overall) }
          ]}>
            <Ionicons 
              name={getSentimentIcon(data.sentiment.overall) as any} 
              size={16} 
              color="white" 
            />
            <Text style={styles.sentimentBadgeText}>
              {data.sentiment.overall > 0.3 ? 'Positive' : 
               data.sentiment.overall < -0.3 ? 'Negative' : 'Neutral'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.keywordsContainer}>
        <Text style={styles.sectionTitle}>Key Topics</Text>
        <View style={styles.keywordsList}>
          {data.keywords.map((keyword, index) => (
            <View key={index} style={styles.keywordBadge}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.entitiesContainer}>
        <Text style={styles.sectionTitle}>Entities Mentioned</Text>
        {data.entities.map((entity, index) => (
          <View key={index} style={styles.entityItem}>
            <View style={styles.entityHeader}>
              <Text style={styles.entityName}>{entity.name}</Text>
              <View style={styles.entityType}>
                <Text style={styles.entityTypeText}>{entity.type}</Text>
              </View>
            </View>
            <View style={styles.entitySentiment}>
              <Text style={styles.entitySentimentLabel}>Sentiment:</Text>
              <View style={[
                styles.sentimentIndicator,
                { backgroundColor: getSentimentColor(entity.sentiment) }
              ]} />
              <Text style={[
                styles.entitySentimentValue,
                { color: getSentimentColor(entity.sentiment) }
              ]}>
                {entity.sentiment > 0.3 ? 'Positive' : 
                 entity.sentiment < -0.3 ? 'Negative' : 'Neutral'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.topicsContainer}>
        <Text style={styles.sectionTitle}>Main Discussion Topics</Text>
        {data.topics.map((topic, index) => (
          <View key={index} style={styles.topicItem}>
            <Text style={styles.topicName}>{topic.name}</Text>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence:</Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill, 
                    { width: `${topic.confidence * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceValue}>{Math.round(topic.confidence * 100)}%</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color="#6b7280" />
        <Text style={styles.disclaimerText}>
          Analysis based on recent news articles and social media posts. Sentiment may not reflect actual market performance.
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summary: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
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
    marginBottom: 12,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentLabel: {
    width: 70,
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
  overallSentiment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginRight: 8,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sentimentBadgeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  keywordsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    color: '#4338ca',
    fontSize: 13,
    fontWeight: '500',
  },
  entitiesContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  entityItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  entityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  entityType: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  entityTypeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  entitySentiment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entitySentimentLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 8,
  },
  sentimentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  entitySentimentValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  topicsContainer: {
    marginBottom: 16,
  },
  topicItem: {
    marginBottom: 12,
  },
  topicName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    width: 80,
    fontSize: 13,
    color: '#6b7280',
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  confidenceValue: {
    width: 40,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
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

export default NLPResults;