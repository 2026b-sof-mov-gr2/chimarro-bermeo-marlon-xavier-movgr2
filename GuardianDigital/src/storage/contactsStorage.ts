import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SafeContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  color: string;
  isEmergency: boolean;
}

const STORAGE_KEY = '@guardian_safe_contacts_v1';

const DEFAULT_CONTACTS: SafeContact[] = [
  {
    id: '1',
    name: 'Hijo Carlos',
    phone: '0991234567',
    relation: 'Familiar Principal',
    color: '#1D4ED8',
    isEmergency: true,
  },
  {
    id: '2',
    name: 'Hija María',
    phone: '0987654321',
    relation: 'Familiar',
    color: '#047857',
    isEmergency: false,
  },
];

export const getContacts = async (): Promise<SafeContact[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS));
    return DEFAULT_CONTACTS;
  } catch (e) {
    console.error('Error leyendo contactos:', e);
    return DEFAULT_CONTACTS;
  }
};

export const saveContacts = async (contacts: SafeContact[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Error guardando contactos:', e);
  }
};