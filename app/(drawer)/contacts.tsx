import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../constants/theme';
import { useSurvey } from '../../context/SurveyContext';
import * as Contacts from 'expo-contacts';
import { copyContactNumber } from '../../utils/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const { updateDraft } = useSurvey();
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setIsRefreshing(true);
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
      setContacts(data);
    }
    setIsRefreshing(false);
  };

  const handleCopy = async (number: string) => {
    const success = await copyContactNumber(number);
    if (success) Alert.alert('Copied!', 'Contact number copied to clipboard');
  };

  const handleAttach = (contact: Contacts.Contact, number: string) => {
    updateDraft({ contact: { name: contact.name || 'Unknown', number } });
    Alert.alert('Attached', `${contact.name} attached to survey.`, [{ text: 'OK', onPress: () => router.back() }]);
  };

  const avatarColors = [Colors.primary, Colors.accent, Colors.success, Colors.warning];
  const filteredContacts = contacts.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item, index }: { item: Contacts.Contact, index: number }) => {
    const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';
    const bgColor = avatarColors[index % avatarColors.length];
    const number = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : null;
    return (
      <TouchableOpacity style={styles.contactRow} onPress={() => number ? handleAttach(item, number) : null}>
        <View style={[styles.avatar, { backgroundColor: bgColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          {number ? <Text style={styles.contactNumber}>{number}</Text> : <Text style={styles.noNumber}>No Number</Text>}
        </View>
        {number && (
          <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopy(number)}>
            <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Contacts" showBack />
      {hasPermission === false ? (
        <View style={styles.centerContainer}>
          <Text style={styles.message}>Permission to access contacts was denied.</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput style={styles.searchInput} placeholder="Search contacts..." value={search} onChangeText={setSearch} />
            </View>
            <Text style={styles.counterText}>{filteredContacts.length} contacts found</Text>
          </View>
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.id || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchContacts} />}
            ListEmptyComponent={
              contacts.length === 0
                ? <EmptyState iconName="people-outline" message="No contacts found on device." />
                : <EmptyState iconName="search-outline" message="No contacts match your search." />
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 16, color: Colors.textPrimary },
  counterText: { marginTop: 8, color: Colors.textSecondary, fontSize: 14 },
  listContent: { flexGrow: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  contactNumber: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  noNumber: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  copyBtn: { padding: 8 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  message: { color: Colors.danger, fontSize: 16, textAlign: 'center' },
});
