import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import StockCard from '../components/StockCard';
import SearchBar from '../components/SearchBar';
import { useAppContext } from '../context/AppContext';

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
};

export default function StocksScreen() {
  const navigation = useNavigation<any>();
  const { stocks, isLoading, lastRefreshed, refreshData } = useAppContext();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  const handleSearch = useCallback((query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      setFilteredStocks(stocks);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter stocks based on query
    const filtered = stocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredStocks(filtered);
    
    // Create search results for dropdown
    const results = filtered.map(stock => ({
      id: stock.symbol,
      title: stock.symbol,
      subtitle: stock.name,
    }));
    
    setSearchResults(results);
  }, [stocks]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    const selected = stocks.find(stock => stock.symbol === result.id);
    if (selected) {
      setFilteredStocks([selected]);
    }
  }, [stocks]);

  const handleClearSearch = useCallback(() => {
    setFilteredStocks(stocks);
    setSearchResults([]);
  }, [stocks]);

  const handleRefresh = async () => {
    await refreshData();
    setFilteredStocks(stocks);
  };

  const handleStockPress = (symbol: string) => {
    // Navigate to stock detail screen
    navigation.navigate('StockDetail', { symbol });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Stocks"
        subtitle="Track and analyze Indian stocks"
        showRefresh
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onRefresh={handleRefresh}
      />
      
      <SearchBar
        placeholder="Search stocks by name or symbol..."
        onSearch={handleSearch}
        results={searchResults}
        onSelectResult={handleSelectResult}
        onClear={handleClearSearch}
      />
      
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <StockCard
            symbol={item.symbol}
            name={item.name}
            price={item.price}
            change={item.change}
            changePercent={item.changePercent}
            recommendation={item.recommendation}
            aiScore={item.aiScore}
            onPress={() => handleStockPress(item.symbol)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stocks found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});