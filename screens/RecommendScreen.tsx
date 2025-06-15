import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import StockCard from '../components/StockCard';
import StartupCard from '../components/StartupCard';
import StockChart from '../components/StockChart';
import { useAppContext } from '../context/AppContext';

export default function RecommendScreen() {
  const navigation = useNavigation();
  const { 
    recommendedStocks, 
    recommendedStartups, 
    isLoading, 
    lastRefreshed, 
    refreshData 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'stocks' | 'startups'>('stocks');

  // Sample chart data for projected growth
  const stockProjectionData = {
    labels: ['1mo', '3mo', '6mo', '1yr', '3yr', '5yr'],
    datasets: [
      {
        data: [
          100,
          105,
          112,
          125,
          160,
          200,
        ],
        color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  
  const startupProjectionData = {
    labels: ['Now', '1yr', '2yr', '3yr', '4yr', '5yr'],
    datasets: [
      {
        data: [
          100,
          150,
          225,
          340,
          510,
          765,
        ],
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const handleStockPress = (symbol: string) => {
    // Navigate to stock detail
    console.log(`Navigate to stock: ${symbol}`);
  };

  const handleStartupPress = (id: string) => {
    // Navigate to startup detail
    console.log(`Navigate to startup: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Recommendations"
        subtitle="Powered by multi-layered AI analysis"
        showRefresh
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onRefresh={handleRefresh}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'stocks' && styles.activeTabButton]}
          onPress={() => setActiveTab('stocks')}
        >
          <Ionicons 
            name="trending-up" 
            size={18} 
            color={activeTab === 'stocks' ? '#4F46E5' : '#6b7280'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'stocks' && styles.activeTabText
            ]}
          >
            Stocks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'startups' && styles.activeTabButton]}
          onPress={() => setActiveTab('startups')}
        >
          <Ionicons 
            name="rocket" 
            size={18} 
            color={activeTab === 'startups' ? '#4F46E5' : '#6b7280'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'startups' && styles.activeTabText
            ]}
          >
            Startups
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'stocks' ? (
          <>
            <StockChart
              title="Projected Stock Growth (5-Year)"
              data={stockProjectionData}
            />
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Top Stock Picks</Text>
              <Text style={styles.sectionSubtitle}>
                Based on financial data, news, and market trends
              </Text>
              
              {recommendedStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  recommendation={stock.recommendation}
                  aiScore={stock.aiScore}
                  onPress={() => handleStockPress(stock.symbol)}
                />
              ))}
            </View>
            
            <View style={styles.aiInsightContainer}>
              <View style={styles.aiInsightHeader}>
                <Ionicons name="analytics" size={20} color="#4F46E5" />
                <Text style={styles.aiInsightTitle}>AI Market Insight</Text>
              </View>
              <Text style={styles.aiInsightText}>
                Our AI analysis indicates strong growth potential in the IT and financial sectors due to 
                increasing digital transformation initiatives and favorable government policies. 
                The recommended stocks show robust fundamentals and are well-positioned to benefit from 
                these trends over the next 1-5 years.
              </Text>
            </View>
          </>
        ) : (
          <>
            <StockChart
              title="Projected Startup Growth (5-Year)"
              data={startupProjectionData}
            />
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Promising Startups</Text>
              <Text style={styles.sectionSubtitle}>
                Vetted for growth potential and market fit
              </Text>
              
              {recommendedStartups.map((startup) => (
                <StartupCard
                  key={startup.id}
                  name={startup.name}
                  sector={startup.sector}
                  description={startup.description}
                  aiScore={startup.aiScore}
                  growthPotential={startup.growthPotential}
                  recommendation={startup.recommendation}
                  onPress={() => handleStartupPress(startup.id)}
                />
              ))}
            </View>
            
            <View style={styles.aiInsightContainer}>
              <View style={styles.aiInsightHeader}>
                <Ionicons name="analytics" size={20} color="#4F46E5" />
                <Text style={styles.aiInsightTitle}>AI Startup Insight</Text>
              </View>
              <Text style={styles.aiInsightText}>
                Our multi-layered AI analysis has identified these startups as having exceptional 
                growth potential based on their innovative solutions, addressable market size, 
                founding team expertise, and alignment with emerging market trends. 
                The agriculture and healthcare sectors show particularly strong potential for 
                disruptive innovation in the Indian market.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#4F46E5',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  aiInsightContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});