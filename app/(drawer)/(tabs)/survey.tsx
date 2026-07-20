import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { AppHeader } from '../../../components/AppHeader';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { Colors } from '../../../constants/theme';
import { useSurvey } from '../../../context/SurveyContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Priority = 'Low' | 'Medium' | 'High';

export default function CreateSurveyScreen() {
  const insets = useSafeAreaInsets();
  const { draft, updateDraft } = useSurvey();
  
  const [siteName, setSiteName] = useState(draft.siteName || '');
  const [clientName, setClientName] = useState(draft.clientName || '');
  const [description, setDescription] = useState(draft.description || '');
  const [priority, setPriority] = useState<Priority>(draft.priority || 'Low');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const priorities: Priority[] = ['Low', 'Medium', 'High'];

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!siteName) newErrors.siteName = 'Site Name is required';
    if (!clientName) newErrors.clientName = 'Client Name is required';
    if (!description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setIsSaving(true);
      updateDraft({ siteName, clientName, description, priority });
      
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert("Success", "Survey draft saved successfully!", [
          { text: "OK", onPress: () => router.push('/(drawer)/(tabs)/') }
        ]);
      }, 1000);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'High': return Colors.danger;
      case 'Medium': return Colors.warning;
      case 'Low': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader title="New Survey" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Site Name</Text>
          <TextInput 
            style={[styles.input, errors.siteName && styles.inputError]}
            value={siteName}
            onChangeText={(t) => { setSiteName(t); setErrors({ ...errors, siteName: '' }); }}
            placeholder="Enter site name"
          />
          {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name</Text>
          <TextInput 
            style={[styles.input, errors.clientName && styles.inputError]}
            value={clientName}
            onChangeText={(t) => { setClientName(t); setErrors({ ...errors, clientName: '' }); }}
            placeholder="Enter client name"
          />
          {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={description}
            onChangeText={(t) => { setDescription(t); setErrors({ ...errors, description: '' }); }}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.chipRow}>
            {priorities.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  priority === p && { backgroundColor: getPriorityColor(p), borderColor: getPriorityColor(p) }
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: Colors.divider }]}
            value={draft.date.toLocaleDateString()}
            editable={false}
          />
        </View>

        <PrimaryButton 
          title="Save Survey" 
          onPress={handleSave} 
          loading={isSaving}
          style={{ marginTop: 16 }}
        />

      </ScrollView>
    </KeyboardAvoidingView>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  chipText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.surface,
  }
});
