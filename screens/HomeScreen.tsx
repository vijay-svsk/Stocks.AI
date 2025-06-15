import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import StockCard from '../components/StockCard';
import StartupCard from '../components/StartupCard';
import StockChart from '../components/StockChart';
import NotificationManager, { useNotifications } from '../components/NotificationManager';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { 
    stocks, 
    startups, 
    recommendedStocks, 
    recommendedStartups, 
    isLoading, 
    lastRefreshed, 
    refreshData 
  } = useAppContext();
  
  const { 
    notifications, 
    removeNotification, 
    showBuyAlert, 
    showSellAlert, 
    showInfoAlert 
  } = useNotifications();

  // Sample chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          Math.random() * 100 + 50,
          Math.random() * 100 + 50,
          Math.random() * 100 + 50,
          Math.random() * 100 + 50,
          Math.random() * 100 + 50,
          Math.random() * 100 + 50,
        ],
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Show a welcome notification on first load
  useEffect(() => {
    showInfoAlert(
      'Welcome to Stock & Startup Intelligence',
      'Your dashboard is ready. Data refreshes every 10 minutes.'
    );
  }, []);

  const handleRefresh = async () => {
    await refreshData();
    showInfoAlert('Dashboard Updated', 'Latest market data has been loaded');
  };

  const handleStockPress = (symbol: string) => {
    // Navigate to stock detail screen
    navigation.navigate('StockDetail', { symbol });
  };

  const handleStartupPress = (id: string) => {
    // Navigate to startup detail
    console.log(`Navigate to startup: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        subtitle="Your financial intelligence hub"
        showRefresh
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onRefresh={handleRefresh}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Market Overview Chart */}
        <StockChart
          title="Market Overview"
          data={chartData}
        />
        
        {/* Top Recommendations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Recommendations</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Recommend')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          
          {recommendedStocks.slice(0, 2).map((stock) => (
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
          
          {recommendedStartups.slice(0, 1).map((startup) => (
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
        
        {/* Recent Stocks */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Stocks</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Stocks')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          
          {stocks.slice(0, 3).map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              onPress={() => handleStockPress(stock.symbol)}
            />
          ))}
        </View>
        
        {/* Trending Startups */}
        <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Startups</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Startups')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          
          {startups.slice(0, 2).map((startup) => (
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
      </ScrollView>
      
      <NotificationManager 
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
});