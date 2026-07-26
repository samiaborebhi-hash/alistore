import fs from 'fs'

async function addPasswordLock() {
  const path = './public/instagram-dashboard.html'
  let html = fs.readFileSync(path, 'utf8')

  const lockCss = `
    /* SECURITY LOCK SCREEN STYLES */
    #lockScreenOverlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%);
      backdrop-filter: blur(25px);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .lock-card {
      background: rgba(30, 41, 59, 0.88);
      border: 1px solid rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      padding: 36px;
      width: 100%;
      max-width: 440px;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .lock-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      background: linear-gradient(135deg, var(--primary), var(--accent-pink));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      box-shadow: 0 0 30px var(--primary-glow);
    }

    .lock-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 14px 18px;
      color: #fff;
      font-size: 1.05rem;
      text-align: center;
      letter-spacing: 2px;
      outline: none;
      transition: var(--transition);
    }

    .lock-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 15px var(--primary-glow);
    }

    .lock-error {
      color: #ef4444;
      font-size: 0.85rem;
      font-weight: 700;
      display: none;
    }
`

  const lockHtml = `
  <!-- SECURITY LOCK SCREEN OVERLAY -->
  <div id="lockScreenOverlay">
    <div class="lock-card">
      <div class="lock-icon">🔒</div>
      <div>
        <h2 style="font-size: 1.3rem; font-weight: 800; color: #fff;">لوحة التسويق - محميّة بكلمة المرور</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">هذه الصفحة خاصة بالإدارة فقط. يرجى إدخال كلمة السر للفتح.</p>
      </div>
      <form onsubmit="handleUnlockSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <input type="password" id="passInput" class="lock-input" placeholder="أدخل كلمة المرور..." required>
        <span class="lock-error" id="lockError">❌ كلمة المرور غير صحيحة! حاول مجدداً.</span>
        <button type="submit" class="btn btn-primary" style="justify-content: center; padding: 12px; font-size: 0.95rem;">🔓 فتح لوحة التحكم</button>
      </form>
    </div>
  </div>
`

  const lockJs = `
    const MASTER_PASS = "AAaa1122@@";

    function checkAuth() {
      const isAuth = sessionStorage.getItem('DASH_UNLOCKED');
      if (isAuth === 'true') {
        const overlay = document.getElementById('lockScreenOverlay');
        if (overlay) overlay.style.display = 'none';
      }
    }

    function handleUnlockSubmit(e) {
      e.preventDefault();
      const val = document.getElementById('passInput').value;
      if (val === MASTER_PASS) {
        sessionStorage.getItem('DASH_UNLOCKED');
        sessionStorage.setItem('DASH_UNLOCKED', 'true');
        const overlay = document.getElementById('lockScreenOverlay');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s ease';
        setTimeout(function() { overlay.style.display = 'none'; }, 400);
        showToast("🔓 تم التحقق وفتح لوحة التحكم بنجاح!");
      } else {
        document.getElementById('lockError').style.display = 'block';
        document.getElementById('passInput').value = '';
        document.getElementById('passInput').focus();
      }
    }

    document.addEventListener('DOMContentLoaded', checkAuth);
`

  if (!html.includes('id="lockScreenOverlay"')) {
    html = html.replace('</style>', lockCss + '\n</style>')
    html = html.replace('<body>', '<body>\n' + lockHtml)
    html = html.replace('</script>', lockJs + '\n</script>')
    fs.writeFileSync(path, html, 'utf8')
    console.log('Successfully injected password lock into public/instagram-dashboard.html')
  } else {
    console.log('Lock screen already present')
  }
}

addPasswordLock()
