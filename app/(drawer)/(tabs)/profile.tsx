import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../../components/AppHeader';
import { Colors } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../../components/EmptyState';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Profile" />
      <EmptyState iconName="person-circle-outline" message="Profile Settings Coming Soon" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
