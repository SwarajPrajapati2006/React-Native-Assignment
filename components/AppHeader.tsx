import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack = false }: AppHeaderProps) {
  const navigation = useNavigation<any>();

  const handleMenuPress = () => {
    // 1. Try finding any parent with openDrawer / toggleDrawer helper functions
    let current: any = navigation;
    while (current) {
      if (typeof current.openDrawer === 'function') {
        current.openDrawer();
        return;
      }
      if (typeof current.toggleDrawer === 'function') {
        current.toggleDrawer();
        return;
      }
      current = current.getParent();
    }

    // 2. Dispatch DrawerActions directly to the 2nd level parent (Drawer above Tabs)
    const drawerLevel = navigation.getParent()?.getParent();
    if (drawerLevel) {
      drawerLevel.dispatch(DrawerActions.toggleDrawer());
      return;
    }

    // 3. Dispatch to 1st level parent
    const tabLevel = navigation.getParent();
    if (tabLevel) {
      tabLevel.dispatch(DrawerActions.toggleDrawer());
      return;
    }

    // 4. Fallback dispatch
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.surface} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={Colors.surface} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 4,
  },
  rightPlaceholder: {
    width: 32,
  }
});
