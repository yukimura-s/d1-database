<script>
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let error = '';

  async function signup() {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      goto('/login');
    } else {
      const data = await res.json();
      error = data.error || '登録に失敗しました';
    }
  }
</script>

<form on:submit|preventDefault={signup}>
  <input type="email" bind:value={email} placeholder="メールアドレス" required />
  <input type="password" bind:value={password} placeholder="パスワード (8文字以上)" required minlength="8" />
  <button type="submit">登録</button>
</form>

<p style="color: red">{error}</p>
