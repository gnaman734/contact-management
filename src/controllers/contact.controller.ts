import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contact.service';
import { ApiResponse } from '../utils/ApiResponse';

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, phone, tags = [], isFavorite = false } = req.body;

      const contact = await this.contactService.createContact(
        { name, email, phone, tags, isFavorite }
      );

      res.status(201).json(
        ApiResponse.success('Contact created successfully', contact)
      );
    } catch (error) {
      next(error);
    }
  };

  getContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, tag, isFavorite, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

      const filters: any = {};
      if (search) filters.search = search;
      if (tag) filters.tag = tag;
      if (isFavorite !== undefined) filters.isFavorite = isFavorite === 'true';

      const sort = { by: sortBy as string, order: sortOrder as string };

      const { contacts, total } = await this.contactService.getContacts(
        filters,
        sort,
        parseInt(page as string),
        parseInt(limit as string)
      );

      const totalPages = Math.ceil(total / parseInt(limit as string));

      res.json(
        ApiResponse.success('Contacts retrieved successfully', contacts, {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getContactById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const contact = await this.contactService.getContactById(id);

      res.json(
        ApiResponse.success('Contact retrieved successfully', contact)
      );
    } catch (error) {
      next(error);
    }
  };

  updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const contact = await this.contactService.updateContact(id, updateData);

      res.json(
        ApiResponse.success('Contact updated successfully', contact)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.contactService.deleteContact(id);

      res.json(
        ApiResponse.success('Contact deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}