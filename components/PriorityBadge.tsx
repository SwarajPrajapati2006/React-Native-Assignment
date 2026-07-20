import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export type Priority = 'Low' | 'Medium' | 'High';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const getColor = () => {
    switch (priority) {
      case 'High': return Colors.danger;
      case 'Medium': return Colors.warning;
      case 'Low': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  const color = getColor();

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{priority}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
