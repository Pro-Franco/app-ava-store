import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabItem = {
  label: string;
};

type TabMenuProps = {
  tabs: TabItem[];
  onTabChange?: (tab: TabItem) => void;
};

export const TabMenu: React.FC<TabMenuProps> = ({ tabs = [], onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      {tabs.map((tab: TabItem, idx: number) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            setActiveIndex(idx);
            onTabChange && onTabChange(tab);
          }}
          style={[styles.tab, activeIndex === idx && styles.activeTab]}
        >
          <Text>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  tab: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  activeTab: { backgroundColor: '#ccc' }
});
