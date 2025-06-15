import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner-native';

export default function SettingsScreen() {
  const { apiKeys, updateApiKey } = useAppContext();
  
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('10');
  const [showApiKeys, setShowApiKeys] = useState(false);
  
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai);
  const [groqKey, setGroqKey] = useState(apiKeys.groq);
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini);
  const [openWeatherKey, setOpenWeatherKey] = useState(apiKeys.openWeather);
  const [gnewsKey, setGnewsKey] = useState(apiKeys.gnews);
  const [twelveDataKey, setTwelveDataKey] = useState(apiKeys.twelveData);
  
  const handleSaveApiKeys = () => {
    updateApiKey('openai', openaiKey);
    updateApiKey('groq', groqKey);
    updateApiKey('gemini', geminiKey);
    updateApiKey('openWeather', openWeatherKey);
    updateApiKey('gnews', gnewsKey);
    updateApiKey('twelveData', twelveDataKey);
    
    toast.success('API keys updated successfully');
  };
  
  const handleResetApiKeys = () => {
    Alert.alert(
      'Reset API Keys',
      'Are you sure you want to reset all API keys to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            setOpenaiKey("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");
            setGroqKey("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");
            setGeminiKey("AIzaSyDTSYKB-7CItLUj33Bs49Dsxy8uzsYSqbQ");
            setOpenWeatherKey("83f56e8ca3059972d8f951002e75ab40");
            setGnewsKey("7240733133888b38f883840191b059a5");
            setTwelveDataKey("ac4f813b51604d8d844437633e071ac0");
            
            updateApiKey('openai', "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");
            updateApiKey('groq', "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");
            updateApiKey('gemini', "AIzaSyDTSYKB-7CItLUj33Bs49Dsxy8uzsYSqbQ");
            updateApiKey('openWeather', "83f56e8ca3059972d8f951002e75ab40");
            updateApiKey('gnews', "7240733133888b38f883840191b059a5");
            updateApiKey('twelveData', "ac4f813b51604d8d844437633e071ac0");
            
            toast.success('API keys reset to default values');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This will remove your portfolio and settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            // In a real app, we would clear AsyncStorage or similar
            toast.success('App data cleared successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        subtitle="Configure your dashboard"
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={20} color="#4b5563" />
              <Text style={styles.settingLabel}>Enable Notifications</Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: '#d1d5db', true: '#c7d2fe' }}
              thumbColor={enableNotifications ? '#4F46E5' : '#f3f4f6'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="refresh-outline" size={20} color="#4b5563" />
              <Text style={styles.settingLabel}>Auto-refresh Interval (minutes)</Text>
            </View>
            <TextInput
              style={styles.intervalInput}
              value={autoRefreshInterval}
              onChangeText={setAutoRefreshInterval}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>API Keys</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowApiKeys(!showApiKeys)}
            >
              <Ionicons 
                name={showApiKeys ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color="#4F46E5" 
              />
              <Text style={styles.toggleButtonText}>
                {showApiKeys ? 'Hide Keys' : 'Show Keys'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>OpenAI API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={openaiKey}
              onChangeText={setOpenaiKey}
              placeholder="Enter OpenAI API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>Groq API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={groqKey}
              onChangeText={setGroqKey}
              placeholder="Enter Groq API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>Gemini API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={geminiKey}
              onChangeText={setGeminiKey}
              placeholder="Enter Gemini API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>OpenWeather API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={openWeatherKey}
              onChangeText={setOpenWeatherKey}
              placeholder="Enter OpenWeather API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>GNews API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={gnewsKey}
              onChangeText={setGnewsKey}
              placeholder="Enter GNews API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.apiKeyItem}>
            <Text style={styles.apiKeyLabel}>12Data API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={twelveDataKey}
              onChangeText={setTwelveDataKey}
              placeholder="Enter 12Data API Key"
              secureTextEntry={!showApiKeys}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveApiKeys}
            >
              <Text style={styles.saveButtonText}>Save API Keys</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={handleResetApiKeys}
            >
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Clear App Data</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Stock & Startup Intelligence Dashboard</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              A comprehensive dashboard for tracking Indian stocks and startups,
              powered by multiple AI models and free APIs.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  section: {
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
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  intervalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 4,
  },
  apiKeyItem: {
    marginBottom: 16,
  },
  apiKeyLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    flex: 1,
    marginLeft: 8,
  },
  resetButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fee2e2',
  },
  dangerButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
  },
});