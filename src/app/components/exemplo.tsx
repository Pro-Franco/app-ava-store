import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Button,
  Checkbox,
  Provider as PaperProvider
} from 'react-native-paper';

export default function Exemplo() {
  const [selectedValue, setSelectedValue] = useState('option1');
  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event: any, selectedDate: any) => {
    const currentTime = selectedDate || time;

    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.label}>ComboBox (Picker):</Text>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Opção 1" value="option1" />
          <Picker.Item label="Opção 2" value="option2" />
          <Picker.Item label="Opção 3" value="option3" />
        </Picker>

        <Text style={styles.label}>Checkbox:</Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => setChecked(!checked)}
          />
          <Text>Eu aceito os termos</Text>
        </View>

        <Text style={styles.label}>Data Selecionada:</Text>
        <Text>{date.toLocaleDateString()}</Text>
        <Button
          mode="contained"
          onPress={() => setShowDatePicker(true)}
          style={styles.button}
        >
          Selecionar Data
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Hora Selecionada:</Text>
        <Text>{time.toLocaleTimeString()}</Text>
        <Button
          mode="contained"
          onPress={() => setShowTimePicker(true)}
          style={styles.button}
        >
          Selecionar Hora
        </Button>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <Button mode="contained" onPress={openModal} style={styles.button}>
          Ver Resumo
        </Button>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Resumo das Escolhas</Text>
              <Text>Opção selecionada: {selectedValue}</Text>
              <Text>Aceitou os termos: {checked ? 'Sim' : 'Não'}</Text>
              <Text>Data: {date.toLocaleDateString()}</Text>
              <Text>Hora: {time.toLocaleTimeString()}</Text>

              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
    backgroundColor: '#ffffff' // branco puro
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32', // verde escuro para títulos
    marginTop: 28,
    marginBottom: 8,
    fontFamily: 'System'
  },
  picker: {
    height: 52,
    width: '100%',
    backgroundColor: '#e8f5e9', // verde claro suave
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14
  },
  button: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#388e3c', // verde médio
    elevation: 3,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    color: '#ffffff' // branco puro
  },
  textSelected: {
    fontSize: 16,
    color: '#1b5e20', // verde mais escuro para textos normais
    fontFamily: 'System',
    marginBottom: 6
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.7)', // verde escuro translúcido
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: '#ffffff', // branco limpo
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '700',
    color: '#2e7d32', // verde escuro
    fontFamily: 'System'
  },
  modalText: {
    fontSize: 17,
    marginBottom: 12,
    color: '#388e3c', // verde médio
    fontWeight: '500'
  },
  closeButton: {
    marginTop: 28,
    backgroundColor: '#2e7d32', // verde escuro forte
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#1b5e20',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 7
  },
  closeButtonText: {
    color: '#ffffff', // branco
    fontWeight: '700',
    fontSize: 17
  }
});

/*
npx expo install @react-native-community/datetimepicker
npx expo install react-native-paper
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
//npx expo install react-native-picker/picker

npm install @react-native-picker/picker --legacy-peer-deps

*/
