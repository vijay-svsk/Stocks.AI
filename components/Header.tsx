import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  showRefresh?: boolean;
  showBack?: boolean;
  isLoading?: boolean;
  lastRefreshed?: Date | null;
  onRefresh?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showRefresh = false,
  showBack = false,
  isLoading = false,
  lastRefreshed,
  onRefresh,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.titleContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {showRefresh && (
        <View style={styles.refreshContainer}>
          {lastRefreshed && (
            <Text style={styles.lastRefreshed}>
              Last updated: {formatDate(lastRefreshed)}
            </Text>
          )}
          
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#4F46E5" />
            ) : (
              <Ionicons name="refresh" size={20} color="#4F46E5" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  } else {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  refreshContainer: {
    alignItems: 'flex-end',
  },
  lastRefreshed: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;