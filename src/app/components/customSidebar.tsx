import React from 'react';
import { Pressable, Text, View } from 'react-native';

type SidebarItem = {
  label: string;
  onPress: () => void;
};

type CustomSidebarProps = {
  items: SidebarItem[];
};

export const CustomSidebar: React.FC<CustomSidebarProps> = ({ items }) => {
  return (
    <View style={{ padding: 10 }}>
      {items.map((item: SidebarItem, index: number) => (
        <Pressable
          key={index}
          onPress={item.onPress}
          style={{ marginVertical: 10 }}
        >
          <Text>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

/*
<CustomSidebar
      items={[
        { label: 'Home', onPress: () => router.push('/') },
        { label: 'Profile', onPress: () => router.push('/profile') },
      ]}
    />
*/
