import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Notification from './Notification';

export type NotificationData = {
  id: string;
  type: 'buy' | 'sell' | 'info';
  title: string;
  message: string;
  autoHide?: boolean;
  duration?: number;
};

type NotificationManagerProps = {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
};

const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          autoHide={notification.autoHide}
          duration={notification.duration}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

// Create a hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showBuyAlert = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'buy',
      title,
      message,
      autoHide: true,
      duration: 5000,
    });
  }, [addNotification]);

  const showSellAlert = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'sell',
      title,
      message,
      autoHide: true,
      duration: 5000,
    });
  }, [addNotification]);

  const showInfoAlert = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'info',
      title,
      message,
      autoHide: true,
      duration: 5000,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showBuyAlert,
    showSellAlert,
    showInfoAlert,
  };
};

export default NotificationManager;