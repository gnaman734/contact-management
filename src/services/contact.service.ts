import { ApiError } from '../utils/ApiError';

const contacts: any[] = []; // Temporary in-memory storage

export class ContactService {
  async createContact(contactData: any): Promise<any> {
    // Validate required fields
    if (!contactData.name || !contactData.phone) {
      throw new ApiError(400, 'Name and phone are required');
    }

    // Check if email already exists (only if email is provided)
    if (contactData.email) {
      const existingContact = contacts.find(contact => contact.email === contactData.email);
      if (existingContact) {
        throw new ApiError(409, 'Email already exists');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email)) {
        throw new ApiError(400, 'Invalid email format');
      }
    }

    // Validate phone (basic)
    if (contactData.phone.length < 10) {
      throw new ApiError(400, 'Phone number must be at least 10 digits');
    }

    const newContact = { id: Date.now().toString(), ...contactData };
    contacts.push(newContact);
    return newContact;
  }

  async getContacts(): Promise<any[]> {
    return contacts;
  }

  async getContactById(id: string): Promise<any | undefined> {
    return contacts.find(contact => contact.id === id);
  }

  async updateContact(id: string, updateData: any): Promise<any | undefined> {
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    if (contactIndex === -1) return undefined;

    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      // Check if email already exists for another contact
      const existingContact = contacts.find(contact => contact.email === updateData.email);
      if (existingContact && existingContact.id !== id) {
        throw new ApiError(409, 'Email already exists');
      }
    }

    // Validate phone if provided
    if (updateData.phone && updateData.phone.length < 10) {
      throw new ApiError(400, 'Phone number must be at least 10 digits');
    }

    contacts[contactIndex] = { ...contacts[contactIndex], ...updateData };
    return contacts[contactIndex];
  }

  async deleteContact(id: string): Promise<boolean> {
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    if (contactIndex === -1) return false;

    contacts.splice(contactIndex, 1);
    return true;
  }
}