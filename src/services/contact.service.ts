import { ContactRepository } from '../repositories/contact.repository';
import { Contact, IContact } from '../models/contact.model';
import { ApiError } from '../utils/ApiError';

export class ContactService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    // Validate required fields
    if (!contactData.name || !contactData.phone) {
      throw new ApiError(400, 'Name and phone are required');
    }

    // Check if email already exists (only if email is provided)
    if (contactData.email) {
      const existingContact = await this.contactRepository.findByEmail(contactData.email);
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

    return await this.contactRepository.create(contactData);
  }

  async getContacts(
    filters: any = {},
    sort: any = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ contacts: Contact[], total: number }> {
    return await this.contactRepository.findAll(filters, sort, page, limit);
  }

  async getContactById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }
    return contact;
  }

  async updateContact(id: string, updateData: Partial<Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Contact> {
    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      // Check if email already exists for another contact
      const existingContact = await this.contactRepository.findByEmail(updateData.email);
      if (existingContact && existingContact.id !== id) {
        throw new ApiError(409, 'Email already exists');
      }
    }

    // Validate phone if provided
    if (updateData.phone && updateData.phone.length < 10) {
      throw new ApiError(400, 'Phone number must be at least 10 digits');
    }

    const contact = await this.contactRepository.update(id, updateData);
    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }
    return contact;
  }

  async deleteContact(id: string): Promise<void> {
    const deleted = await this.contactRepository.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'Contact not found');
    }
  }
}