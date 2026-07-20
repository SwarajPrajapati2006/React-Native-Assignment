import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Colors } from '../../constants/theme';
import { useSurvey } from '../../context/SurveyContext';
import * as Location from 'expo-location';
import { copyLocation } from '../../utils/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { updateDraft } = useSurvey();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => { fetchLocation(); }, []);

  const fetchLocation = async () => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsFetching(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      updateDraft({ location: { latitude: loc.coords.latitude, longitude: loc.coords.longitude, accuracy: loc.coords.accuracy || 0 } });
    } catch (e) {
      setErrorMsg('Failed to fetch location. Please ensure location services are enabled.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCopyLocation = async () => {
    if (location) {
      const success = await copyLocation(location.coords.latitude, location.coords.longitude);
      if (success) Alert.alert("Copied!", "Location copied to clipboard");
    }
  };

  const handleSave = () => {
    Alert.alert("Saved", "Location saved to survey draft.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Location" showBack />
      <View style={styles.content}>
        {errorMsg ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <PrimaryButton title="Retry" onPress={fetchLocation} style={{ marginTop: 16 }} />
          </View>
        ) : isFetching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching Location...</Text>
          </View>
        ) : location ? (
          <>
            <Card>
              <View style={styles.row}>
                <Text style={styles.label}>Latitude:</Text>
                <Text style={styles.value}>{location.coords.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.label}>Longitude:</Text>
                <Text style={styles.value}>{location.coords.longitude.toFixed(6)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.label}>Accuracy:</Text>
                <Text style={styles.value}>± {location.coords.accuracy?.toFixed(2)} meters</Text>
              </View>
            </Card>
            <View style={styles.buttonGroup}>
              <PrimaryButton title="Refresh Location" onPress={fetchLocation} />
              <PrimaryButton title="Copy Location" onPress={handleCopyLocation} style={{ backgroundColor: Colors.accent }} />
              <PrimaryButton title="Save & Return" onPress={handleSave} style={{ backgroundColor: Colors.success }} />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.danger, fontSize: 16, textAlign: 'center' },
  loadingText: { marginTop: 16, color: Colors.textSecondary, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 4 },
  label: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  value: { fontSize: 16, color: Colors.textSecondary },
  buttonGroup: { marginTop: 24, gap: 12 },
});
