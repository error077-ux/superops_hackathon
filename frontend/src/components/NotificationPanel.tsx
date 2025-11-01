// src/components/NotificationPanel.tsx - FIXED IMPORT

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Bell, X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // ← FIXED: changed from 'motion/react'

const API_BASE_URL = 'http://localhost:5000/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onCountChange: (count: number) => void;
}

export function NotificationPanel({ isOpen, onClose, unreadCount, onCountChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        onCountChange(data.unread_count);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/clear`, {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications([]);
        onCountChange(0);
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-green-500/10 border-green-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed top-20 right-6 z-40 w-96 h-[calc(100vh-120px)]"
      >
        <Card className="h-full flex flex-col bg-gray-900/95 border-gray-700 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAll}
                  className="text-gray-400 hover:text-white"
                >
                  Clear All
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer ${getSeverityColor(notification.severity)} ${
                      !notification.read ? 'bg-opacity-20' : 'opacity-60'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(notification.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
