import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';
import { copySurveyId, copyContactNumber, copyLocation, pasteNotes, clearClipboard } from '../../utils/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClipboardScreen() {
  const insets = useSafeAreaInsets();
  const [lastResult, setLastResult] = useState<string>('Ready to test clipboard functions.');

  const testCopySurveyId = async () => {
    const success = await copySurveyId('SRV-2026-999');
    if (success) { setLastResult('Copied Survey ID: SRV-2026-999'); Alert.alert('Success', 'Survey ID copied.'); }
  };
  const testCopyContact = async () => {
    const success = await copyContactNumber('+1-555-0199');
    if (success) { setLastResult('Copied Contact: +1-555-0199'); Alert.alert('Success', 'Contact number copied.'); }
  };
  const testCopyLocation = async () => {
    const success = await copyLocation(40.7128, -74.0060);
    if (success) { setLastResult('Copied Location: 40.7128, -74.0060'); Alert.alert('Success', 'Location copied.'); }
  };
  const testPaste = async () => {
    const text = await pasteNotes();
    if (text) setLastResult(`Pasted content: "${text}"`);
    else setLastResult('Clipboard is empty or contains non-text data.');
  };
  const testClear = async () => {
    const success = await clearClipboard();
    if (success) { setLastResult('Clipboard cleared.'); Alert.alert('Success', 'Clipboard cleared.'); }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Clipboard Utilities" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.resultCard}>
          <Text style={styles.resultTitle}>Last Action Result:</Text>
          <Text style={styles.resultText}>{lastResult}</Text>
        </Card>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        <View style={styles.buttonContainer}><PrimaryButton title="Copy Dummy Survey ID" onPress={testCopySurveyId} /></View>
        <View style={styles.buttonContainer}><PrimaryButton title="Copy Dummy Contact" onPress={testCopyContact} /></View>
        <View style={styles.buttonContainer}><PrimaryButton title="Copy Dummy Location" onPress={testCopyLocation} /></View>
        <View style={styles.buttonContainer}><PrimaryButton title="Paste Clipboard Content" onPress={testPaste} style={{ backgroundColor: Colors.accent }} /></View>
        <View style={styles.buttonContainer}><PrimaryButton title="Clear Clipboard" onPress={testClear} style={{ backgroundColor: Colors.danger }} /></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  resultCard: { backgroundColor: Colors.primaryDark },
  resultTitle: { color: Colors.surface, fontSize: 14, opacity: 0.8, marginBottom: 4 },
  resultText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16, marginBottom: 12 },
  buttonContainer: { marginBottom: 12 },
});
