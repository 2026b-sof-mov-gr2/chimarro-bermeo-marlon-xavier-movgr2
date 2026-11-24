import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { SafeContact, getContacts } from '../storage/contactsStorage';

export default function HomeLauncherScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 15000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchContacts = async () => {
        const stored = await getContacts();
        setContacts(stored);
      };
      fetchContacts();
    }, [])
  );

  const handleCall = (name: string, phone: string) => {
    Vibration.vibrate(60);
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', `No se pudo iniciar la llamada a ${name}`)
    );
  };

  const handleEmergencySOS = () => {
    Vibration.vibrate([100, 200, 100, 200]);
    const emergencyContact = contacts.find((c) => c.isEmergency) || contacts[0];
    if (emergencyContact) {
      Alert.alert(
        '🚨 ALERTA SOS ACTIVADA',
        `Llamando a contacto principal: ${emergencyContact.name} (${emergencyContact.phone})`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Llamar Ahora',
            onPress: () => Linking.openURL(`tel:${emergencyContact.phone}`),
          },
        ]
      );
    } else {
      Linking.openURL('tel:911');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.clockText}>{currentTime}</Text>
          <Text style={styles.dateText}>Domingo, 22 Nov • Wi-Fi Activo</Text>
        </View>
        <TouchableOpacity
          style={styles.crudNavBtn}
          onPress={() => navigation.navigate('ContactsCrud')}
        >
          <Text style={styles.crudNavText}>⚙️ Contactos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Llamar a mi Familia</Text>
        <View style={styles.grid}>
          {contacts.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={[styles.contactCard, { backgroundColor: person.color }]}
              onPress={() => handleCall(person.name, person.phone)}
            >
              <Text style={styles.avatarCircle}>
                {person.name.charAt(0).toUpperCase()}
              </Text>
              <Text style={styles.cardName}>{person.name}</Text>
              <Text style={styles.cardRelation}>{person.relation}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Mis Aplicaciones</Text>

        <TouchableOpacity
          style={[styles.bigAppBtn, { backgroundColor: '#15803D' }]}
          onPress={() => Linking.openURL('whatsapp://send?text=Hola')}
        >
          <Text style={styles.bigAppText}>💬 Abrir WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigAppBtn, { backgroundColor: '#B45309' }]}
          onPress={() => navigation.navigate('ScamShield')}
        >
          <Text style={styles.bigAppText}>🛡️ Probar Escudo Anti-Estafas</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.sosBtn} onPress={handleEmergencySOS}>
        <Text style={styles.sosText}>🚨 NECESITO AYUDA (SOS)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', paddingHorizontal: 16, paddingBottom: 12 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  clockText: { color: '#FFFFFF', fontSize: 34, fontWeight: 'bold' },
  dateText: { color: '#38BDF8', fontSize: 16, fontWeight: '600', marginTop: 2 },
  crudNavBtn: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  crudNavText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 20 },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  contactCard: {
    width: '48%',
    minHeight: 145,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 54,
    marginBottom: 8,
  },
  cardName: { color: '#FFFFFF', fontSize: 21, fontWeight: 'bold', textAlign: 'center' },
  cardRelation: { color: '#E2E8F0', fontSize: 15, marginTop: 2 },
  bigAppBtn: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  bigAppText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  sosBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  sosText: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', letterSpacing: 0.5 },
});