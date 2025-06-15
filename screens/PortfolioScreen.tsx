import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner-native';

// Import the PortfolioItem type from AppContext
type PortfolioItem = {
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  buyDate: string;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
};

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
};

export default function PortfolioScreen() {
  const navigation = useNavigation();
  const { 
    stocks, 
    portfolio, 
    isLoading, 
    lastRefreshed, 
    refreshData, 
    addToPortfolio, 
    removeFromPortfolio 
  } = useAppContext();
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{symbol: string, name: string} | null>(null);
  const [shares, setShares] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split('T')[0]);
  
  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.buyPrice * item.shares), 0);
  const currentValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.shares), 0);
  const totalProfitLoss = currentValue - totalInvestment;
  const totalProfitLossPercent = totalInvestment > 0 ? ((currentValue / totalInvestment) - 1) * 100 : 0;

  const handleSearch = (query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter stocks based on query
    const filtered = stocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
    );
    
    // Create search results for dropdown
    const results = filtered.map(stock => ({
      id: stock.symbol,
      title: stock.symbol,
      subtitle: stock.name,
    }));
    
    setSearchResults(results);
  };

  const handleSelectResult = (result: SearchResult) => {
    const stock = stocks.find(s => s.symbol === result.id);
    if (stock) {
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name
      });
      setBuyPrice(stock.price.toString());
      setModalVisible(true);
    }
  };

  const handleAddToPortfolio = () => {
    if (!selectedStock) return;
    
    const sharesNum = parseFloat(shares);
    const buyPriceNum = parseFloat(buyPrice);
    
    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast.error('Please enter a valid number of shares');
      return;
    }
    
    if (isNaN(buyPriceNum) || buyPriceNum <= 0) {
      toast.error('Please enter a valid buy price');
      return;
    }
    
    addToPortfolio({
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: sharesNum,
      buyPrice: buyPriceNum,
      buyDate,
    });
    
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedStock(null);
    setShares('');
    setBuyPrice('');
    setBuyDate(new Date().toISOString().split('T')[0]);
  };

  const handleRemoveFromPortfolio = (symbol: string) => {
    Alert.alert(
      'Remove from Portfolio',
      'Are you sure you want to remove this stock from your portfolio?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeFromPortfolio(symbol),
          style: 'destructive',
        },
      ]
    );
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => {
    const isProfit = item.profitLoss >= 0;
    
    return (
      <View style={styles.portfolioItem}>
        <View style={styles.portfolioItemHeader}>
          <View>
            <Text style={styles.portfolioItemSymbol}>{item.symbol}</Text>
            <Text style={styles.portfolioItemName}>{item.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveFromPortfolio(item.symbol)}
          >
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.portfolioItemDetails}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Shares</Text>
            <Text style={styles.detailValue}>{item.shares}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Buy Price</Text>
            <Text style={styles.detailValue}>₹{item.buyPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Current</Text>
            <Text style={styles.detailValue}>₹{item.currentPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.portfolioItemFooter}>
          <View>
            <Text style={styles.detailLabel}>Total Value</Text>
            <Text style={styles.totalValue}>
              ₹{(item.currentPrice * item.shares).toFixed(2)}
            </Text>
          </View>
          <View style={styles.profitLossContainer}>
            <Text style={styles.detailLabel}>Profit/Loss</Text>
            <View style={styles.profitLossRow}>
              <Ionicons 
                name={isProfit ? 'caret-up' : 'caret-down'} 
                size={16} 
                color={isProfit ? '#16a34a' : '#dc2626'} 
              />
              <Text style={[
                styles.profitLossValue,
                isProfit ? styles.profit : styles.loss
              ]}>
                ₹{Math.abs(item.profitLoss).toFixed(2)} ({Math.abs(item.profitLossPercent).toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Portfolio"
        subtitle="Track your investments"
        showRefresh
        isLoading={isLoading}
        lastRefreshed={lastRefreshed}
        onRefresh={handleRefresh}
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Investment</Text>
          <Text style={styles.summaryValue}>₹{totalInvestment.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current Value</Text>
          <Text style={styles.summaryValue}>₹{currentValue.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Profit/Loss</Text>
          <View style={styles.profitLossRow}>
            {totalProfitLoss !== 0 && (
              <Ionicons 
                name={totalProfitLoss >= 0 ? 'caret-up' : 'caret-down'} 
                size={16} 
                color={totalProfitLoss >= 0 ? '#16a34a' : '#dc2626'} 
              />
            )}
            <Text style={[
              styles.summaryProfitLoss,
              totalProfitLoss > 0 ? styles.profit : 
              totalProfitLoss < 0 ? styles.loss : {}
            ]}>
              {totalProfitLoss !== 0 ? `₹${Math.abs(totalProfitLoss).toFixed(2)} (${Math.abs(totalProfitLossPercent).toFixed(2)}%)` : '₹0.00 (0.00%)'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.addContainer}>
        <Text style={styles.addTitle}>Add to Portfolio</Text>
        <SearchBar
          placeholder="Search for a stock to add..."
          onSearch={handleSearch}
          results={searchResults}
          onSelectResult={handleSelectResult}
          onClear={() => setSearchResults([])}
        />
      </View>
      
      <FlatList
        data={portfolio}
        keyExtractor={(item) => item.symbol}
        renderItem={renderPortfolioItem}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Your portfolio is empty. Search for stocks to add them to your portfolio.
            </Text>
          </View>
        }
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Portfolio</Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {selectedStock && (
              <View style={styles.selectedStockContainer}>
                <Text style={styles.selectedStockSymbol}>{selectedStock.symbol}</Text>
                <Text style={styles.selectedStockName}>{selectedStock.name}</Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of Shares</Text>
              <TextInput
                style={styles.input}
                value={shares}
                onChangeText={setShares}
                keyboardType="numeric"
                placeholder="Enter number of shares"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Buy Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={buyPrice}
                onChangeText={setBuyPrice}
                keyboardType="numeric"
                placeholder="Enter buy price"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Buy Date</Text>
              <TextInput
                style={styles.input}
                value={buyDate}
                onChangeText={setBuyDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToPortfolio}
            >
              <Text style={styles.addButtonText}>Add to Portfolio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryProfitLoss: {
    fontSize: 16,
    fontWeight: '600',
  },
  profitLossRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profit: {
    color: '#16a34a',
  },
  loss: {
    color: '#dc2626',
  },
  addContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  portfolioItem: {
    backgroundColor: '#fff',
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
  portfolioItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  portfolioItemSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  portfolioItemName: {
    fontSize: 14,
    color: '#6b7280',
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  portfolioItemDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  portfolioItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  profitLossContainer: {
    alignItems: 'flex-end',
  },
  profitLossValue: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  selectedStockContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  selectedStockSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  selectedStockName: {
    fontSize: 14,
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});