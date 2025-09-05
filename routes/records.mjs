import express from 'express';
import { readJSON, writeJSON } from '../lib/storage.mjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();

const DEPTS_FILE = process.env.DEPARTMENTS_FILE || './data/departments.json';
const MUNIS_FILE = process.env.MUNICIPALITIES_FILE || './data/municipalities.json';
const RECORDS_FILE = path.resolve(process.env.RECORDS_FILE || './data/records.json');

router.get('/', async (req, res, next) => {
     try {
     const departments = (await readJSON(DEPTS_FILE)) || [];
     res.render('index', { 
          departments,
          title: 'Nuevo Registro'
     });
     } catch (err) {
     next(err);
     }
});

router.get('/list', async (req, res, next) => {
     try {
     const records = (await readJSON(RECORDS_FILE)) || [];
     res.render('list', { 
          records,
          title: 'Lista de Registros'
     });
     } catch (err) {
     next(err);
     }
});

router.get('/api/municipalities', async (req, res, next) => {
     try {
          const { department } = req.query;
          const municipalities = (await readJSON(MUNIS_FILE)) || [];
          const filtered = department
               ? municipalities.filter(m => String(m.department) === String(department))
               : municipalities;
               res.json(filtered);
          } catch (err) {
          next(err);
     }
});

router.post('/save', async (req, res, next) => {
     try {
     const { name, date, department, municipality } = req.body;
     if (!name || !date || !department || !municipality) {
          return res.status(400).send('Missing fields');
     }
     const records = (await readJSON(RECORDS_FILE)) || [];
     const id = records.length ? (Math.max(...records.map(r => r.id)) + 1) : 1;
     const newRecord = {
          id,
          name,
          date,
          department,
          municipality,
          createdAt: new Date().toISOString()
     };
     records.push(newRecord);
     await writeJSON(RECORDS_FILE, records);
     res.redirect('/list');
     } catch (err) {
     next(err);
     }
});

export default router;