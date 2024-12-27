import { Router } from 'itty-router';
import bcrypt from 'bcryptjs';
import jwt from '@tsndr/cloudflare-worker-jwt';

const router = Router();
const JWT_SECRET = 'your_secret_key'; // 環境変数に格納することを推奨

export default {
  async fetch(request, env) {
    return router.handle(request, env);
  }
};

router.post('/register', async (request, env) => {
  const { email, password } = await request.json();

  if (!email || !password || password.length < 8) {
    return new Response('Invalid input', { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await env.DB.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
      .bind(email, passwordHash)
      .run();
    return new Response('User registered', { status: 201 });
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
});

router.post('/login', async (request, env) => {
  const { email, password } = await request.json();

  try {
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return new Response('Invalid credentials', { status: 401 });
    }

    const token = await jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    return new Response(JSON.stringify({ token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error logging in', { status: 500 });
  }
});
