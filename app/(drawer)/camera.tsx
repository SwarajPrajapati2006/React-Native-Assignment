import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/theme';
import { useSurvey } from '../../context/SurveyContext';
import { router } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [isInitializing, setIsInitializing] = useState(true);
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<{uri: string, formattedTime: string, timestamp: string} | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { updateDraft } = useSurvey();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          const timestamp = new Date();
          setCapturedPhoto({ 
            uri: photo.uri, 
            timestamp: timestamp.toISOString(), 
            formattedTime: formatDate(timestamp) 
          });
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const handleRetake = () => setCapturedPhoto(null);

  const handleDelete = () => {
    Alert.alert("Delete photo?", "This cannot be undone", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setCapturedPhoto(null) }
    ]);
  };

  const handleSave = () => {
    if (capturedPhoto) {
      updateDraft({ photo: { uri: capturedPhoto.uri, timestamp: capturedPhoto.timestamp } });
      Alert.alert("Saved", "Photo saved to survey draft.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AppHeader title="Camera" showBack />
        <View style={styles.centerContainer}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <PrimaryButton title="Grant Permission" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AppHeader title="Captured Photo" showBack />
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
          <View style={styles.timestampOverlay}>
            <Text style={styles.timestampText}>{capturedPhoto.formattedTime}</Text>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleRetake}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: Colors.success }]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Camera" showBack />
      {isInitializing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.cameraWrapper}>
          <CameraView style={StyleSheet.absoluteFillObject} facing={facing} ref={cameraRef} />
          <View style={styles.overlayContainer} pointerEvents="box-none">
            <View style={styles.topControlRow}>
              <TouchableOpacity style={styles.iconCircle} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomControlRow}>
              <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  message: { textAlign: 'center', paddingBottom: 20, fontSize: 16, color: Colors.textPrimary },
  cameraWrapper: { flex: 1, position: 'relative' },
  overlayContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20 },
  topControlRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 },
  bottomControlRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 30 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  captureButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.surface },
  previewContainer: { flex: 1, position: 'relative' },
  preview: { flex: 1, width: '100%' },
  timestampOverlay: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  timestampText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'rgba(0,0,0,0.85)' },
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  dangerButton: { backgroundColor: Colors.danger, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
