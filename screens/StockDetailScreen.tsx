import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import StockChart from '../components/StockChart';
import PredictionEngine, { PredictionData } from '../components/PredictionEngine';
import PredictionResult from '../components/PredictionResult';
import NLPAnalyzer, { NLPAnalysisResult } from '../components/NLPAnalyzer';
import NLPResults from '../components/NLPResults';
import MultiModelAI, { AIModelResult, MultiModelResults } from '../components/MultiModelAI';
import { toast } from 'sonner-native';

type RouteParams = {
  symbol: string;
};

const StockDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { symbol } = route.params as RouteParams;
  const { stocks, addToPortfolio, isLoading, refreshData } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'prediction' | 'sentiment' | 'models'>('prediction');
  const [predictionTimeframe, setPredictionTimeframe] = useState<'short' | 'medium' | 'long'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  
  // Analysis results
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [nlpData, setNlpData] = useState<NLPAnalysisResult | null>(null);
  const [modelResults, setModelResults] = useState<AIModelResult[] | null>(null);
  
  // Find the stock data
  const stockData = stocks.find(s => s.symbol === symbol);
  
  // If stock not found, navigate back
  useEffect(() => {
    if (!stockData) {
      toast.error('Stock not found');
      navigation.goBack();
    }
  }, [stockData, navigation]);
  
  // Generate chart data
  const generateChartData = () => {
    // In a real app, this would be fetched from an API
    const today = new Date();
    const labels = Array(6).fill(0).map((_, i) => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - 5 + i);
      return date.toLocaleDateString('en-US', { month: 'short' });
    });
    
    // Generate some random data with a trend
    const basePrice = stockData ? stockData.price * 0.8 : 1000;
    const trend = stockData && stockData.change > 0 ? 1 : -1;
    const data = Array(6).fill(0).map((_, i) => {
      return basePrice * (1 + (i * 0.05 * trend) + (Math.random() * 0.1 - 0.05));
    });
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => stockData && stockData.change >= 0 
            ? `rgba(16, 185, 129, ${opacity})` 
            : `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };
  
  // Handle prediction completion
  const handlePredictionComplete = (data: PredictionData) => {
    setPredictionData(data);
    setIsAnalyzing(false);
  };
  
  // Handle NLP analysis completion
  const handleNLPComplete = (data: NLPAnalysisResult) => {
    setNlpData(data);
  };
  
  // Handle AI model analysis completion
  const handleModelAnalysisComplete = (results: AIModelResult[]) => {
    setModelResults(results);
  };
  
  // Handle add to portfolio
  const handleAddToPortfolio = () => {
    if (stockData) {
      addToPortfolio({
        symbol: stockData.symbol,
        name: stockData.name,
        shares: 10, // Default value
        buyPrice: stockData.price,
        buyDate: new Date().toISOString().split('T')[0],
      });
      toast.success(`Added ${stockData.name} to portfolio`);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsAnalyzing(true);
    await refreshData();
    // Reset analysis states to trigger re-analysis
    setPredictionData(null);
    setNlpData(null);
    setModelResults(null);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };
  
  if (!stockData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading stock data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header
        title={stockData.name}
        subtitle={stockData.symbol}
        showBack
        showRefresh
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.overviewCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Current Price</Text>
            <Text style={styles.price}>₹{stockData.price.toFixed(2)}</Text>
            <View style={[
              styles.changeBadge,
              { backgroundColor: stockData.change >= 0 ? '#dcfce7' : '#fee2e2' }
            ]}>
              <Ionicons 
                name={stockData.change >= 0 ? 'trending-up' : 'trending-down'} 
                size={16} 
                color={stockData.change >= 0 ? '#10b981' : '#ef4444'} 
              />
              <Text style={[
                styles.changeText,
                { color: stockData.change >= 0 ? '#10b981' : '#ef4444' }
              ]}>
                {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
          
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationLabel}>AI Recommendation</Text>
            <View style={[
              styles.recommendationBadge,
              { 
                backgroundColor: 
                  stockData.recommendation === 'buy' ? '#10b981' : 
                  stockData.recommendation === 'sell' ? '#ef4444' : '#f59e0b'
              }
            ]}>
              <Text style={styles.recommendationText}>
                {stockData.recommendation.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.aiScore}>AI Score: {stockData.aiScore.toFixed(1)}/10</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addToPortfolioButton}
            onPress={handleAddToPortfolio}
          >
            <Ionicons name="add-circle" size={18} color="white" />
            <Text style={styles.addToPortfolioText}>Add to Portfolio</Text>
          </TouchableOpacity>
        </View>
        
        <StockChart
          title="Historical Performance"
          data={generateChartData()}
          height={220}
        />
        
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonTitle}>Investment Thesis</Text>
          <Text style={styles.reasonText}>{stockData.reason}</Text>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'prediction' && styles.activeTab]}
            onPress={() => setActiveTab('prediction')}
          >
            <Text style={[styles.tabText, activeTab === 'prediction' && styles.activeTabText]}>
              Prediction
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'sentiment' && styles.activeTab]}
            onPress={() => setActiveTab('sentiment')}
          >
            <Text style={[styles.tabText, activeTab === 'sentiment' && styles.activeTabText]}>
              Sentiment
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'models' && styles.activeTab]}
            onPress={() => setActiveTab('models')}
          >
            <Text style={[styles.tabText, activeTab === 'models' && styles.activeTabText]}>
              AI Models
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'prediction' && (
          <View>
            <View style={styles.timeframeSelector}>
              <TouchableOpacity 
                style={[
                  styles.timeframeOption, 
                  predictionTimeframe === 'short' && styles.activeTimeframe
                ]}
                onPress={() => setPredictionTimeframe('short')}
              >
                <Text style={[
                  styles.timeframeText,
                  predictionTimeframe === 'short' && styles.activeTimeframeText
                ]}>
                  Short-term
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.timeframeOption, 
                  predictionTimeframe === 'medium' && styles.activeTimeframe
                ]}
                onPress={() => setPredictionTimeframe('medium')}
              >
                <Text style={[
                  styles.timeframeText,
                  predictionTimeframe === 'medium' && styles.activeTimeframeText
                ]}>
                  Medium-term
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.timeframeOption, 
                  predictionTimeframe === 'long' && styles.activeTimeframe
                ]}
                onPress={() => setPredictionTimeframe('long')}
              >
                <Text style={[
                  styles.timeframeText,
                  predictionTimeframe === 'long' && styles.activeTimeframeText
                ]}>
                  Long-term
                </Text>
              </TouchableOpacity>
            </View>
            
            {isAnalyzing ? (
              <PredictionEngine 
                symbol={symbol}
                onPredictionComplete={handlePredictionComplete}
                isLoading={true}
              />
            ) : predictionData ? (
              <PredictionResult 
                data={predictionData}
                timeframe={predictionTimeframe}
              />
            ) : (
              <PredictionEngine 
                symbol={symbol}
                onPredictionComplete={handlePredictionComplete}
              />
            )}
          </View>
        )}
        
        {activeTab === 'sentiment' && (
          <View>
            {isAnalyzing ? (
              <NLPAnalyzer 
                symbol={symbol}
                isLoading={true}
              />
            ) : nlpData ? (
              <NLPResults data={nlpData} />
            ) : (
              <NLPAnalyzer 
                symbol={symbol}
                onAnalysisComplete={handleNLPComplete}
              />
            )}
          </View>
        )}
        
        {activeTab === 'models' && (
          <View>
            {isAnalyzing ? (
              <MultiModelAI 
                symbol={symbol}
                price={stockData.price}
                isLoading={true}
              />
            ) : modelResults ? (
              <MultiModelResults 
                results={modelResults}
                symbol={symbol}
                currentPrice={stockData.price}
              />
            ) : (
              <MultiModelAI 
                symbol={symbol}
                price={stockData.price}
                onAnalysisComplete={handleModelAnalysisComplete}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  changeText: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  recommendationContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  recommendationLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  recommendationBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  recommendationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  aiScore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  addToPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToPortfolioText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  reasonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  timeframeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  timeframeOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTimeframe: {
    borderBottomColor: '#4F46E5',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTimeframeText: {
    color: '#4F46E5',
  },
});

export default StockDetailScreen;