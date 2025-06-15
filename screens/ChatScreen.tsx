import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function ChatScreen() {
  const { stocks, startups, apiKeys } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI financial assistant. Ask me anything about stocks, startups, or market trends.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // In a real app, we would use the OpenAI API here
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let responseText = '';
      const query = inputText.toLowerCase();
      
      if (query.includes('stock') || query.includes('tcs') || query.includes('reliance') || query.includes('hdfc')) {
        const stockMentioned = stocks.find(
          stock => 
            query.includes(stock.symbol.toLowerCase()) || 
            query.includes(stock.name.toLowerCase())
        );
        
        if (stockMentioned) {
          responseText = `${stockMentioned.name} (${stockMentioned.symbol}) is currently trading at ₹${stockMentioned.price.toFixed(2)}. It has ${stockMentioned.change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(stockMentioned.changePercent).toFixed(2)}% today. Based on our AI analysis, we ${stockMentioned.recommendation.toUpperCase()} this stock due to ${stockMentioned.reason}.`;
        } else {
          responseText = 'Based on our analysis of Indian stocks, the IT and financial sectors are showing strong performance this quarter. Would you like specific information about any particular stock?';
        }
      } else if (query.includes('startup') || query.includes('agri') || query.includes('health') || query.includes('edu')) {
        const startupMentioned = startups.find(
          startup => 
            query.includes(startup.name.toLowerCase()) || 
            query.includes(startup.sector.toLowerCase())
        );
        
        if (startupMentioned) {
          responseText = `${startupMentioned.name} is a promising startup in the ${startupMentioned.sector} sector. ${startupMentioned.description}. Our AI gives it a score of ${startupMentioned.aiScore.toFixed(1)}/10 with a growth potential of ${startupMentioned.growthPotential}%. We ${startupMentioned.recommendation} this startup because ${startupMentioned.reason}.`;
        } else {
          responseText = 'The Indian startup ecosystem is thriving, particularly in AgriTech, HealthTech, and EdTech sectors. These startups are addressing critical needs with innovative solutions and have strong growth potential. Would you like information about any specific startup or sector?';
        }
      } else if (query.includes('market') || query.includes('trend')) {
        responseText = 'Current market trends show strong performance in technology and healthcare sectors, while energy and traditional retail are facing challenges. The Indian market is showing resilience despite global economic pressures, with domestic consumption driving growth. Foreign institutional investors have been net buyers in recent weeks, indicating positive sentiment.';
      } else if (query.includes('recommend') || query.includes('suggest') || query.includes('buy')) {
        const topStock = stocks.find(stock => stock.recommendation === 'buy');
        responseText = `Based on our AI analysis, we recommend considering ${topStock?.name} (${topStock?.symbol}) which is currently trading at ₹${topStock?.price.toFixed(2)}. It has an AI score of ${topStock?.aiScore.toFixed(1)}/10 due to ${topStock?.reason}. Always conduct your own research before making investment decisions.`;
      } else {
        responseText = 'I can help you with information about Indian stocks, startups, market trends, and investment recommendations. Feel free to ask specific questions about any company, sector, or market conditions.';
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your request. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';
    
    return (
      <View style={[
        styles.messageContainer,
        isAI ? styles.aiMessageContainer : styles.userMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isAI ? styles.aiMessageBubble : styles.userMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isAI ? styles.aiMessageText : styles.userMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Header
        title="AI Chat"
        subtitle="Ask about stocks, startups, and market trends"
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about stocks, startups, or market trends..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={!inputText.trim() ? '#9ca3af' : '#ffffff'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginTop: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
});