import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import StartupCard from '../components/StartupCard';
import SearchBar from '../components/SearchBar';
import { useAppContext } from '../context/AppContext';

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
};

export default function StartupsScreen() {
  const navigation = useNavigation();
  const { startups, isLoading, lastRefreshed, refreshData } = useAppContext();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredStartups, setFilteredStartups] = useState(startups);

  const handleSearch = useCallback((query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      setFilteredStartups(startups);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter startups based on query
    const filtered = startups.filter(
      startup => 
        startup.name.toLowerCase().includes(lowerQuery) || 
        startup.sector.toLowerCase().includes(lowerQuery) ||
        startup.description.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredStartups(filtered);
    
    // Create search results for dropdown
    const results = filtered.map(startup => ({
      id: startup.id,
      title: startup.name,
      subtitle: startup.sector,
    }));
    
    setSearchResults(results);
  }, [startups]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    const selected = startups.find(startup => startup.id === result.id);
    if (selected) {
      setFilteredStartups([selected]);
    }
  }, [startups]);

  const handleClearSearch = useCallback(() => {
    setFilteredStartups(startups);
    setSearchResults([]);
  }, [startups]);

  const handleRefresh = async () => {
    await refreshData();
    setFilteredStartups(startups);
  };

  const handleStartupPress = (id: string) => {
    // Navigate to startup detail
    console.log(`Navigate to startup: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Startups"
        subtitle="Discover promising Indian startups"
        showRefresh
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onRefresh={handleRefresh}
      />
      
      <SearchBar
        placeholder="Search startups by name or sector..."
        onSearch={handleSearch}
        results={searchResults}
        onSelectResult={handleSelectResult}
        onClear={handleClearSearch}
      />
      
      <FlatList
        data={filteredStartups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StartupCard
            name={item.name}
            sector={item.sector}
            description={item.description}
            aiScore={item.aiScore}
            growthPotential={item.growthPotential}
            recommendation={item.recommendation}
            onPress={() => handleStartupPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No startups found</Text>
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