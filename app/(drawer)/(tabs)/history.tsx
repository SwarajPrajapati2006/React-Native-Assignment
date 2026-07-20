import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppHeader } from '../../../components/AppHeader';
import { Card } from '../../../components/Card';
import { PriorityBadge } from '../../../components/PriorityBadge';
import { EmptyState } from '../../../components/EmptyState';
import { Colors } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SurveyDraft } from '../../../context/SurveyContext';

type SavedSurvey = SurveyDraft & { id: string };

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [surveys, setSurveys] = useState<SavedSurvey[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  useEffect(() => {
    const dummySurveys: SavedSurvey[] = [
      { id: '1', siteName: 'Central Park', clientName: 'City Parks', description: 'Inspection', priority: 'High', date: new Date(), photo: null, location: null, contact: null, notes: '' },
      { id: '2', siteName: 'Main St Bridge', clientName: 'DOT', description: 'Structural check', priority: 'Medium', date: new Date(), photo: null, location: null, contact: null, notes: '' },
      { id: '3', siteName: 'Library Roof', clientName: 'City Govt', description: 'Leak inspection', priority: 'Low', date: new Date(), photo: null, location: null, contact: null, notes: '' },
    ];
    setSurveys(dummySurveys);
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Survey', 'Are you sure you want to delete this survey?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => setSurveys(prev => prev.filter(s => s.id !== id))
      }
    ]);
  };

  const filteredSurveys = surveys.filter(s => {
    const matchesSearch = s.siteName.toLowerCase().includes(search.toLowerCase()) || 
                          s.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || s.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: SavedSurvey }) => (
    <TouchableOpacity onPress={() => router.push(`/(drawer)/preview?id=${item.id}` as any)}>
      <Card style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.siteName}</Text>
          <Text style={styles.cardSubtitle}>{item.clientName} • {item.date.toLocaleDateString()}</Text>
          <View style={{ marginTop: 8 }}>
            <PriorityBadge priority={item.priority} />
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color={Colors.danger} />
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="History" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search site or client..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <View style={styles.filterRow}>
          {['All', 'Low', 'Medium', 'High'].map(f => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList 
        data={filteredSurveys}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState iconName="document-text-outline" message="No surveys found." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.surface,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
});
