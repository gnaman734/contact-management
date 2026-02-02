import { Contact, IContact } from '../models/contact.model';
import db from '../database/db';

export class ContactRepository {
  async create(contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO contacts (id, name, email, phone, tags, isFavorite, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        contactData.name,
        contactData.email || null,
        contactData.phone,
        JSON.stringify(contactData.tags),
        contactData.isFavorite ? 1 : 0,
        now,
        now,
        function(err: Error | null) {
          stmt.finalize();
          if (err) {
            reject(err);
          } else {
            resolve(new Contact(
              id,
              contactData.name,
              contactData.email,
              contactData.phone,
              contactData.tags,
              contactData.isFavorite,
              now,
              now
            ));
          }
        }
      );
    });
  }

  async findAll(filters: any = {}, sort: any = {}, page: number = 1, limit: number = 10): Promise<{ contacts: Contact[], total: number }> {
    return new Promise((resolve, reject) => {
      let whereClause = '1=1';
      const params: any[] = [];

      // Search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        whereClause += ` AND (
          LOWER(name) LIKE ? OR
          LOWER(email) LIKE ? OR
          phone LIKE ?
        )`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      // Filter by tag
      if (filters.tag) {
        whereClause += ` AND tags LIKE ?`;
        params.push(`%${filters.tag}%`);
      }

      // Filter by isFavorite
      if (filters.isFavorite !== undefined) {
        whereClause += ` AND isFavorite = ?`;
        params.push(filters.isFavorite ? 1 : 0);
      }

      // Get total count first
      const countStmt = db.prepare(`SELECT COUNT(*) as total FROM contacts WHERE ${whereClause}`);
      countStmt.get(params, (err: Error | null, row: any) => {
        if (err) {
          countStmt.finalize();
          reject(err);
          return;
        }

        const total = row.total;

        // Build sort clause
        let orderBy = 'createdAt DESC';
        if (sort.by) {
          const direction = sort.order === 'desc' ? 'DESC' : 'ASC';
          orderBy = `${sort.by} ${direction}`;
        }

        // Get paginated results
        const offset = (page - 1) * limit;
        const selectStmt = db.prepare(`
          SELECT * FROM contacts
          WHERE ${whereClause}
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?
        `);

        const allParams = [...params, limit, offset];
        selectStmt.all(allParams, (err: Error | null, rows: any[]) => {
          countStmt.finalize();
          selectStmt.finalize();

          if (err) {
            reject(err);
            return;
          }

          const contacts = rows.map(row => new Contact(
            row.id,
            row.name,
            row.email,
            row.phone,
            JSON.parse(row.tags),
            Boolean(row.isFavorite),
            row.createdAt,
            row.updatedAt
          ));

          resolve({ contacts, total });
        });
      });
    });
  }

  async findById(id: string): Promise<Contact | null> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
      stmt.get(id, (err: Error | null, row: any) => {
        stmt.finalize();
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new Contact(
            row.id,
            row.name,
            row.email,
            row.phone,
            JSON.parse(row.tags),
            Boolean(row.isFavorite),
            row.createdAt,
            row.updatedAt
          ));
        }
      });
    });
  }

  async findByEmail(email: string): Promise<Contact | null> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('SELECT * FROM contacts WHERE email = ?');
      stmt.get(email, (err: Error | null, row: any) => {
        stmt.finalize();
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new Contact(
            row.id,
            row.name,
            row.email,
            row.phone,
            JSON.parse(row.tags),
            Boolean(row.isFavorite),
            row.createdAt,
            row.updatedAt
          ));
        }
      });
    });
  }

  async update(id: string, updateData: Partial<Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Contact | null> {
    return new Promise((resolve, reject) => {
      // First check if contact exists
      this.findById(id).then(existing => {
        if (!existing) {
          resolve(null);
          return;
        }

        const now = new Date().toISOString();
        const updates: string[] = [];
        const params: any[] = [];

        if (updateData.name !== undefined) {
          updates.push('name = ?');
          params.push(updateData.name);
        }

        if (updateData.email !== undefined) {
          updates.push('email = ?');
          params.push(updateData.email);
        }

        if (updateData.phone !== undefined) {
          updates.push('phone = ?');
          params.push(updateData.phone);
        }

        if (updateData.tags !== undefined) {
          updates.push('tags = ?');
          params.push(JSON.stringify(updateData.tags));
        }

        if (updateData.isFavorite !== undefined) {
          updates.push('isFavorite = ?');
          params.push(updateData.isFavorite ? 1 : 0);
        }

        updates.push('updatedAt = ?');
        params.push(now);

        const stmt = db.prepare(`
          UPDATE contacts
          SET ${updates.join(', ')}
          WHERE id = ?
        `);

        params.push(id);
        stmt.run(params, (err: Error | null) => {
          stmt.finalize();
          if (err) {
            reject(err);
          } else {
            // Return updated contact
            this.findById(id).then(resolve).catch(reject);
          }
        });
      }).catch(reject);
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
      stmt.run(id, function(err: Error | null) {
        stmt.finalize();
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}