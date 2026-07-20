import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { SurveyProvider } from '../context/SurveyContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SurveyProvider>
        <Slot />
      </SurveyProvider>
    </GestureHandlerRootView>
  );
}
