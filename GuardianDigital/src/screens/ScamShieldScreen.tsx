import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

export default function ScamShieldScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.alertBox}>
        <Text style={styles.icon}>🛑</Text>
        <Text style={styles.warningTitle}>¡ENLACE PELIGROSO BLOQUEADO!</Text>
        <Text style={styles.warningBody}>
          Este mensaje intenta hacerse pasar por un banco para robar tus claves. El Guardián Digital bloqueó el acceso para proteger tu dinero.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.safeBtn}
        onPress={() => {
          Vibration.vibrate(50);
          navigation.goBack();
        }}
      >
        <Text style={styles.safeBtnText}>✅ Cerrar y Estar a Salvo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#450A0A', padding: 20, justifyContent: 'center' },
  alertBox: {
    backgroundColor: '#7F1D1D',
    padding: 24,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FACC15',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 64, marginBottom: 12 },
  warningTitle: {
    color: '#FACC15',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  warningBody: { color: '#FFFFFF', fontSize: 20, lineHeight: 28, textAlign: 'center' },
  safeBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: 'center',
  },
  safeBtnText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
});