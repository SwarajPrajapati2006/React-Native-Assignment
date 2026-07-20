import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../../components/AppHeader';
import { Card } from '../../../components/Card';
import { PriorityBadge } from '../../../components/PriorityBadge';
import { Colors } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const quickActions = [
    { title: 'New Survey', icon: 'add-circle', route: '/(drawer)/(tabs)/survey' },
    { title: 'Open Camera', icon: 'camera', route: '/(drawer)/camera' },
    { title: 'Location', icon: 'location', route: '/(drawer)/location' },
    { title: 'Contacts', icon: 'people', route: '/(drawer)/contacts' },
  ];

  const recentSurveys = [
    { id: '1', siteName: 'Site A', client: 'Client X', priority: 'High', date: 'Today' },
    { id: '2', siteName: 'Site B', client: 'Client Y', priority: 'Medium', date: 'Yesterday' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome */}
        <Text style={styles.greeting}>{greeting}, Student!</Text>
        
        {/* Student Details */}
        <Card>
          <Text style={styles.cardTitle}>Student Profile</Text>
          <Text style={styles.text}>Name: John Doe</Text>
          <Text style={styles.text}>ID: 123456</Text>
          <Text style={styles.text}>Course: React Native</Text>
        </Card>

        {/* Survey Count */}
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Today's Surveys</Text>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <Ionicons name={action.icon as any} size={32} color={Colors.accent} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Surveys */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent Surveys</Text>
          <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/history')}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentSurveys.map(survey => (
          <Card key={survey.id} style={styles.compactCard}>
            <View>
              <Text style={styles.cardTitle}>{survey.siteName}</Text>
              <Text style={styles.text}>{survey.client} • {survey.date}</Text>
            </View>
            <PriorityBadge priority={survey.priority as any} />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  statLabel: {
    fontSize: 16,
    color: Colors.surface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  compactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
});
