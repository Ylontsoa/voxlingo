import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Modal, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { requestNotificationPermission, scheduleDailyReminder, cancelReminders } from '../../services/notifications';

const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

export default function ReminderToggle() {
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(19);
  const [showPicker, setShowPicker] = useState(false);

  async function handleToggle(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Permission refusee', 'Active les notifications dans les parametres.');
        return;
      }
      const success = await scheduleDailyReminder(hour, 0);
      if (success) {
        setEnabled(true);
      } else {
        Alert.alert('Erreur', 'Impossible de programmer le rappel.');
      }
    } else {
      await cancelReminders();
      setEnabled(false);
    }
  }

  async function handleHourChange(newHour: number) {
    setHour(newHour);
    setShowPicker(false);
    if (enabled) {
      await cancelReminders();
      await scheduleDailyReminder(newHour, 0);
    }
  }

  return (
    <View>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
            <FontAwesome name="bell" size={16} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>Rappel quotidien</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={[styles.subtitle, { color: theme.primary }]}>
                Tous les jours a {hour}h00
              </Text>
            </TouchableOpacity>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ true: theme.primary }}
          />
        </View>
      </View>

      {/* Picker d'heure */}
      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setShowPicker(false)}>
          <View style={[styles.pickerContainer, { backgroundColor: theme.surface }]}>
            <Text style={[styles.pickerTitle, { color: theme.text }]}>Choisir l'heure</Text>
            <View style={styles.hoursGrid}>
              {HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => handleHourChange(h)}
                  style={[
                    styles.hourChip,
                    { backgroundColor: h === hour ? theme.primary : theme.primaryLight }
                  ]}
                >
                  <Text style={[styles.hourText, { color: h === hour ? '#fff' : theme.primary }]}>
                    {h}h00
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  pickerTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  hoursGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  hourChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  hourText: { fontSize: 14, fontWeight: '600' },
  cancelBtn: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  cancelText: { fontSize: 15, fontWeight: '500' },
});