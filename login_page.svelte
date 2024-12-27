<script>
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let error = '';

  async function login() {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      goto('/map');
    } else {
      error = 'ログイン失敗';
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="メールアドレス" required />
  <input type="password" bind:value={password} placeholder="パスワード" required />
  <button type="submit">ログイン</button>
</form>

<p style="color: red">{error}</p>
