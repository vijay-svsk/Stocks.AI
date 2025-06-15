import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner-native';

// Define types for our context
type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  aiScore: number;
  reason: string;
};

type Startup = {
  id: string;
  name: string;
  sector: string;
  description: string;
  aiScore: number;
  growthPotential: number;
  recommendation: string;
  reason: string;
};

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

type ApiKeys = {
  openai: string;
  groq: string;
  gemini: string;
  openWeather: string;
  gnews: string;
  twelveData: string;
};

type AppContextType = {
  stocks: Stock[];
  startups: Startup[];
  portfolio: PortfolioItem[];
  recommendedStocks: Stock[];
  recommendedStartups: Startup[];
  apiKeys: ApiKeys;
  isLoading: boolean;
  lastRefreshed: Date | null;
  refreshData: () => Promise<void>;
  addToPortfolio: (item: Omit<PortfolioItem, 'currentPrice' | 'profitLoss' | 'profitLossPercent'>) => void;
  removeFromPortfolio: (symbol: string) => void;
  updateApiKey: (keyName: keyof ApiKeys, value: string) => void;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Default API keys
const DEFAULT_API_KEYS: ApiKeys = {
  openai: "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",
  groq: "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",
  gemini: "AIzaSyDTSYKB-7CItLUj33Bs49Dsxy8uzsYSqbQ",
  openWeather: "83f56e8ca3059972d8f951002e75ab40",
  gnews: "7240733133888b38f883840191b059a5",
  twelveData: "ac4f813b51604d8d844437633e071ac0"
};

// Sample data for initial state
const SAMPLE_STOCKS: Stock[] = [
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    price: 3850.25,
    change: 42.75,
    changePercent: 1.12,
    recommendation: 'buy',
    aiScore: 8.7,
    reason: 'Strong IT service demand and cloud migration trends'
  },
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    price: 2756.80,
    change: -15.20,
    changePercent: -0.55,
    recommendation: 'hold',
    aiScore: 7.5,
    reason: 'Oil price volatility affecting short-term outlook'
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    price: 1678.45,
    change: 22.30,
    changePercent: 1.35,
    recommendation: 'buy',
    aiScore: 8.2,
    reason: 'Strong credit growth and improving asset quality'
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys',
    price: 1456.70,
    change: -8.30,
    changePercent: -0.57,
    recommendation: 'hold',
    aiScore: 7.8,
    reason: 'Margin pressure despite strong deal pipeline'
  },
  {
    symbol: 'BAJFINANCE.NS',
    name: 'Bajaj Finance',
    price: 7245.60,
    change: 125.40,
    changePercent: 1.76,
    recommendation: 'buy',
    aiScore: 8.5,
    reason: 'Digital transformation driving customer acquisition'
  }
];

const SAMPLE_STARTUPS: Startup[] = [
  {
    id: '1',
    name: 'AgriTech Solutions',
    sector: 'Agriculture',
    description: 'AI-powered crop monitoring and yield optimization',
    aiScore: 8.9,
    growthPotential: 85,
    recommendation: 'Strong Buy',
    reason: 'Addressing critical food security needs with scalable technology'
  },
  {
    id: '2',
    name: 'HealthVision',
    sector: 'Healthcare',
    description: 'Remote diagnostic platform for rural healthcare',
    aiScore: 9.2,
    growthPotential: 92,
    recommendation: 'Strong Buy',
    reason: 'Solving accessibility issues in healthcare with proven technology'
  },
  {
    id: '3',
    name: 'EduLearn',
    sector: 'Education',
    description: 'Personalized learning platform with AI tutoring',
    aiScore: 7.8,
    growthPotential: 75,
    recommendation: 'Buy',
    reason: 'Growing edtech market but facing competition'
  },
  {
    id: '4',
    name: 'FinSecure',
    sector: 'Fintech',
    description: 'Blockchain-based payment security for rural banks',
    aiScore: 8.4,
    growthPotential: 80,
    recommendation: 'Buy',
    reason: 'Strong product-market fit with regulatory tailwinds'
  },
  {
    id: '5',
    name: 'CleanEnergy',
    sector: 'Renewable Energy',
    description: 'Affordable solar solutions for residential use',
    aiScore: 9.0,
    growthPotential: 88,
    recommendation: 'Strong Buy',
    reason: 'Aligned with government initiatives and growing demand'
  }
];

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(SAMPLE_STOCKS);
  const [startups, setStartups] = useState<Startup[]>(SAMPLE_STARTUPS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [recommendedStocks, setRecommendedStocks] = useState<Stock[]>(
    SAMPLE_STOCKS.filter(stock => stock.recommendation === 'buy').slice(0, 3)
  );
  const [recommendedStartups, setRecommendedStartups] = useState<Startup[]>(
    SAMPLE_STARTUPS.filter(startup => startup.recommendation === 'Strong Buy').slice(0, 3)
  );
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(new Date());

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, we would load from AsyncStorage or similar
        // For now, we'll use our sample data
        // We would also set up the refresh interval here
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();

    // Set up auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would fetch data from APIs here
      // For now, we'll simulate a delay and use our sample data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate updated data
      const updatedStocks = [...stocks].map(stock => ({
        ...stock,
        price: stock.price * (1 + (Math.random() * 0.04 - 0.02)),
        change: Math.random() * 20 - 10,
        changePercent: Math.random() * 2 - 1,
      }));
      
      setStocks(updatedStocks);
      setLastRefreshed(new Date());
      
      // Update portfolio prices
      if (portfolio.length > 0) {
        const updatedPortfolio = portfolio.map(item => {
          const stockData = updatedStocks.find(s => s.symbol === item.symbol);
          const currentPrice = stockData?.price || item.currentPrice;
          const profitLoss = (currentPrice - item.buyPrice) * item.shares;
          const profitLossPercent = ((currentPrice / item.buyPrice) - 1) * 100;
          
          return {
            ...item,
            currentPrice,
            profitLoss,
            profitLossPercent
          };
        });
        
        setPortfolio(updatedPortfolio);
      }
      
      // Show notification
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add item to portfolio
  const addToPortfolio = (item: Omit<PortfolioItem, 'currentPrice' | 'profitLoss' | 'profitLossPercent'>) => {
    const stockData = stocks.find(s => s.symbol === item.symbol);
    if (!stockData) {
      toast.error('Stock not found');
      return;
    }
    
    const currentPrice = stockData.price;
    const profitLoss = (currentPrice - item.buyPrice) * item.shares;
    const profitLossPercent = ((currentPrice / item.buyPrice) - 1) * 100;
    
    const newItem: PortfolioItem = {
      ...item,
      currentPrice,
      profitLoss,
      profitLossPercent
    };
    
    setPortfolio(prev => [...prev, newItem]);
    toast.success(`Added ${item.name} to portfolio`);
  };

  // Function to remove item from portfolio
  const removeFromPortfolio = (symbol: string) => {
    setPortfolio(prev => prev.filter(item => item.symbol !== symbol));
    toast.success('Removed from portfolio');
  };

  // Function to update API key
  const updateApiKey = (keyName: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
    toast.success(`Updated ${keyName} API key`);
  };

  const value = {
    stocks,
    startups,
    portfolio,
    recommendedStocks,
    recommendedStartups,
    apiKeys,
    isLoading,
    lastRefreshed,
    refreshData,
    addToPortfolio,
    removeFromPortfolio,
    updateApiKey
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};