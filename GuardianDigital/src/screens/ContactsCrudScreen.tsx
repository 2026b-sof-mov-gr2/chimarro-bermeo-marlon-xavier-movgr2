import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Switch,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeContact, getContacts, saveContacts } from '../storage/contactsStorage';

const CARD_COLORS = ['#1D4ED8', '#047857', '#6D28D9', '#B45309'];

const safeVibrate = (pattern: number | number[]) => {
  try {
    Vibration.vibrate(pattern);
  } catch (e) {
    // Evita crash si el emulador o dispositivo restringe vibración
  }
};

export default function ContactsCrudScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getContacts();
    setContacts(data);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setRelation('');
    setSelectedColor(CARD_COLORS[0]);
    setIsEmergency(false);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Datos incompletos', 'Por favor ingresa el nombre y el número de teléfono.');
      return;
    }

    safeVibrate(50);
    let updatedList: SafeContact[];

    if (editingId) {
      updatedList = contacts.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: name.trim(),
              phone: phone.trim(),
              relation: relation.trim() || 'Familiar',
              color: selectedColor,
              isEmergency,
            }
          : item
      );
    } else {
      const newContact: SafeContact = {
        id: Date.now().toString(),
        name: name.trim(),
        phone: phone.trim(),
        relation: relation.trim() || 'Familiar',
        color: selectedColor,
        isEmergency,
      };
      updatedList = [...contacts, newContact];
    }

    setContacts(updatedList);
    await saveContacts(updatedList);
    resetForm();
  };

  const handleEdit = (contact: SafeContact) => {
    safeVibrate(40);
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelation(contact.relation);
    setSelectedColor(contact.color);
    setIsEmergency(contact.isEmergency);
  };

  const handleDelete = (id: string, contactName: string) => {
    Alert.alert(
      'Eliminar contacto seguro',
      `¿Seguro que deseas quitar a ${contactName} de la pantalla principal?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Eliminar',
          style: 'destructive',
          onPress: async () => {
            safeVibrate(80);
            const filtered = contacts.filter((c) => c.id !== id);
            setContacts(filtered);
            await saveContacts(filtered);
            if (editingId === id) resetForm();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Volver al Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contactos Seguros (Lista Blanca)</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formHeader}>
          {editingId ? '✏️ Editando Contacto' : '➕ Agregar Nuevo Contacto'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre (ej. Hijo Carlos)"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono (ej. 0991234567)"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Parentesco (ej. Médico, Hija, Vecino)"
          placeholderTextColor="#94A3B8"
          value={relation}
          onChangeText={setRelation}
        />

        <View style={styles.colorRow}>
          <Text style={styles.label}>Color de botón:</Text>
          {CARD_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.colorCircleSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Es contacto de emergencia SOS?</Text>
          <Switch
            value={isEmergency}
            onValueChange={setIsEmergency}
            trackColor={{ false: '#475569', true: '#DC2626' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {editingId ? 'Guardar Cambios' : 'Guardar Contacto'}
            </Text>
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.listSectionTitle}>
        Contactos autorizados ({contacts.length})
      </Text>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={[styles.contactItem, { borderLeftColor: item.color }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>
                {item.name} {item.isEmergency ? '🚨' : ''}
              </Text>
              <Text style={styles.contactSub}>
                {item.phone} • {item.relation}
              </Text>
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Text style={styles.actionText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 16 },
  header: { marginBottom: 12, marginTop: 8 },
  backBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backBtnText: { color: '#38BDF8', fontSize: 18, fontWeight: 'bold' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  formCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  formHeader: { color: '#F8FAFC', fontSize: 19, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontSize: 18,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  colorRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 12 },
  label: { color: '#E2E8F0', fontSize: 16, fontWeight: '600' },
  colorCircle: { width: 34, height: 34, borderRadius: 17 },
  colorCircleSelected: { borderWidth: 3, borderColor: '#FFFFFF' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  cancelBtn: {
    backgroundColor: '#475569',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },
  cancelBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  listSectionTitle: { color: '#94A3B8', fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  contactItem: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  contactSub: { color: '#CBD5E1', fontSize: 16, marginTop: 2 },
  itemActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  actionText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});