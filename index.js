import bcrypt from "bcryptjs"; // パスワードハッシュ化のために使用

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/register" && request.method === "POST") {
      return await handleRegister(request, env);
    } else if (pathname === "/login" && request.method === "POST") {
      return await handleLogin(request, env);
    } else if (pathname === "/success") {
      return new Response(`<h1>成功</h1>`, { headers: { "Content-Type": "text/html" } });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
};

async function handleRegister(request, env) {
  const { email, password } = await request.json();

  // 入力チェック
  if (!validateEmail(email) || !validatePassword(password)) {
    return new Response("Invalid email or password format", { status: 400 });
  }

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザーをデータベースに登録
  try {
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    await env.USER_DB.prepare(query).bind(email, hashedPassword).run();
    return new Response("Registration successful", { status: 201 });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return new Response("Email already registered", { status: 409 });
    }
    return new Response("Database error", { status: 500 });
  }
}

async function handleLogin(request, env) {
  const { email, password } = await request.json();

  // 入力チェック
  if (!validateEmail(email) || !validatePassword(password)) {
    return new Response("Invalid email or password format", { status: 400 });
  }

  // データベースからユーザー情報を取得
  const query = "SELECT password FROM users WHERE email = ?";
  const result = await env.USER_DB.prepare(query).bind(email).first();

  if (result && await bcrypt.compare(password, result.password)) {
    return Response.redirect("/success", 302);
  } else {
    return new Response("Invalid credentials", { status: 401 });
  }
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^[a-zA-Z0-9]{8}$/;
  return regex.test(password);
}
