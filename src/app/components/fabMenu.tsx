import React, { useState } from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';

export function FabMenu() {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <Provider>
      <Portal>
        <FAB.Group
          visible={true}
          open={fabOpen}
          icon={fabOpen ? 'calendar-today' : 'plus'}
          actions={[
            { icon: 'plus', onPress: () => console.log('Add') },
            { icon: 'email', onPress: () => console.log('Email') }
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          onPress={() => {
            if (fabOpen) {
              console.log('FAB Pressed!');
            }
          }}
        />
      </Portal>
    </Provider>
  );
}
