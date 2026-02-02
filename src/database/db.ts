import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/contacts.db');

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH);

// Function to initialize database
export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Enable WAL mode for better performance
    db.run('PRAGMA journal_mode = WAL', (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create contacts table
      db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT NOT NULL,
          tags TEXT NOT NULL,
          isFavorite INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create indexes for better performance
        db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`, (err) => {
          if (err) {
            reject(err);
            return;
          }

          db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name)`, (err) => {
            if (err) {
              reject(err);
              return;
            }

            db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone)`, (err) => {
              if (err) {
                reject(err);
                return;
              }

              db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_createdAt ON contacts(createdAt)`, (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              });
            });
          });
        });
      });
    });
  });
};

export default db;