import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the database directory exists
const dbPath = join(__dirname, 'oralvis.db');

// Create database instance with error handling
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database with tables and default users
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('technician', 'dentist')),
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        }
      });

      // Create scans table
      db.run(`
        CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name TEXT NOT NULL,
          patient_id TEXT NOT NULL,
          scan_type TEXT NOT NULL,
          region TEXT NOT NULL,
          image_url TEXT NOT NULL,
          uploaded_by INTEGER NOT NULL,
          upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating scans table:', err.message);
          reject(err);
        }
      });

      // Create default users
      const saltRounds = 10;
      const techPassword = bcrypt.hashSync('password123', saltRounds);
      const dentistPassword = bcrypt.hashSync('password123', saltRounds);

      db.run(`
        INSERT OR IGNORE INTO users (email, password, role, name) 
        VALUES (?, ?, ?, ?)
      `, ['tech@oralvis.com', techPassword, 'technician', 'John Smith'], function(err) {
        if (err) {
          console.error('Error inserting technician:', err.message);
          reject(err);
        }
      });

      db.run(`
        INSERT OR IGNORE INTO users (email, password, role, name) 
        VALUES (?, ?, ?, ?)
      `, ['dentist@oralvis.com', dentistPassword, 'dentist', 'Dr. Sarah Johnson'], function(err) {
        if (err) {
          console.error('Error inserting dentist:', err.message);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
};

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

export default db;