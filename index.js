import bcrypt from 'bcryptjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ユーザー登録エンドポイント
    if (url.pathname === "/api/signup" && request.method === "POST") {
      const { email, password } = await request.json();

      // メールアドレスの重複チェック
      const { results } = await env.DB.prepare(
        "SELECT * FROM Users WHERE email = ?"
      ).bind(email).all();

      if (results.length > 0) {
        return new Response(JSON.stringify({ success: false, error: "Email already exists" }), { status: 400 });
      }

      // パスワードのハッシュ化
      const hashedPassword = bcrypt.hashSync(password, 10);

      // ユーザー情報をデータベースに挿入
      await env.DB.prepare(
        "INSERT INTO Users (email, password) VALUES (?, ?)"
      ).bind(email, hashedPassword).run();

      return new Response(JSON.stringify({ success: true }), { status: 201 });
    }

    // ログインエンドポイント
    if (url.pathname === "/api/login" && request.method === "POST") {
      const { email, password } = await request.json();

      const { results } = await env.DB.prepare(
        "SELECT * FROM Users WHERE email = ?"
      ).bind(email).all();

      if (results.length > 0) {
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (isPasswordValid) {
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
      }

      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }

    return new Response("Not Found", { status: 404 });
  },
};
