// docsumm — summarise your documents with AI.
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const OpenAI = require('openai');
const auth = require('./auth');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, auth.hashPassword(password)]
    );
    res.json({ token: auth.createSession(result.rows[0].id) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'something went wrong' });
  }
});

app.post('/summarise', upload.single('document'), async (req, res) => {
  const userId = auth.getUserId(req);
  if (!userId) return res.status(401).json({ error: 'not logged in' });
  const body = req.file.buffer.toString('utf8');
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Summarise the document in 5 bullet points.' },
        { role: 'user', content: body },
      ],
    });
    const summary = completion.choices[0].message.content;
    await pool.query(
      'INSERT INTO documents (user_id, filename, body, summary) VALUES ($1, $2, $3, $4)',
      [userId, req.file.originalname, body, summary]
    );
    res.json({ summary });
  } catch (err) {
    console.log('summarise failed', err);
    res.status(500).json({ error: 'summarise failed' });
  }
});

app.get('/documents', async (req, res) => {
  const userId = auth.getUserId(req);
  if (!userId) return res.status(401).json({ error: 'not logged in' });
  const result = await pool.query(
    'SELECT id, filename, body, summary, created_at FROM documents WHERE user_id = $1',
    [userId]
  );
  res.json(result.rows);
});

app.listen(3000, () => console.log('docsumm listening on 3000'));
