import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotificationType = 'buy' | 'sell' | 'info';

type NotificationProps = {
  type: NotificationType;
  title: string;
  message: string;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
};

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onDismiss,
  autoHide = true,
  duration = 5000,
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    if (autoHide) {
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const hideNotification = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };
  
  const getIconName = () => {
    switch (type) {
      case 'buy':
        return 'trending-up';
      case 'sell':
        return 'trending-down';
      case 'info':
      default:
        return 'information-circle';
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case 'buy':
        return '#16a34a';
      case 'sell':
        return '#dc2626';
      case 'info':
      default:
        return '#3b82f6';
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'buy':
        return 'rgba(22, 163, 74, 0.1)';
      case 'sell':
        return 'rgba(220, 38, 38, 0.1)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.1)';
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        { opacity: animation, transform: [{ translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        })}] }
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
        <Ionicons name="close" size={20} color="#6b7280" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
  },
  closeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;