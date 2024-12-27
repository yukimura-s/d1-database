export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/login" && request.method === "POST") {
      return await handleLogin(request, env);
    } else if (pathname === "/success") {
      return new Response(`<h1>成功</h1>`, { headers: { "Content-Type": "text/html" } });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
};

async function handleLogin(request, env) {
  const { email, password } = await request.json();

  if (!validateEmail(email) || !validatePassword(password)) {
    return new Response("Invalid email or password format", { status: 400 });
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  const result = await env.USER_DB.prepare(query).bind(email, password).first();

  if (result) {
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
