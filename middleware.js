import { geolocation, next } from '@vercel/functions';

const ALLOWED_COUNTRY = 'NG';

// Skip middleware entirely for static assets (JS/CSS/images/fonts etc.) so
// the blocked page below can still render its inline styles, and so static
// assets aren't needlessly routed through middleware.
export const config = {
  matcher: '/((?!assets/).*)',
};

function blockedResponse() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service not available in this region | Swift Trade</title>
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080808;
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    text-align: center;
    padding: 24px;
  }
  .card {
    max-width: 460px;
    width: 100%;
    background: #111111;
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 48px 36px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 24px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(246, 70, 93, 0.1);
    color: #F6465D;
    border: 1px solid rgba(246, 70, 93, 0.25);
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.02em;
    margin: 0 0 12px;
    color: #ffffff;
  }
  p {
    color: #888888;
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0 0 8px;
  }
  .brand {
    color: #0ECB81;
    font-weight: 600;
  }
  .footer {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #1a1a1a;
    color: #333333;
    font-size: 0.8rem;
  }
</style>
</head>
<body>
  <div class="card">
    <img src="/favicon.png" alt="Swift Trade" class="logo" />
    <div class="badge">Access restricted</div>
    <h1>Service not available in this region</h1>
    <p><span class="brand">Swift Trade</span> currently operates exclusively within Nigeria.</p>
    <p>We're unable to serve requests from your current location.</p>
    <div class="footer">Swift Trade &mdash; Nigeria's crypto &amp; gift card exchange</div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 403,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export default function middleware(request) {
  const url = new URL(request.url);

  // Let root-level static files (favicon, icons, manifest, etc.) through untouched.
  if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
    return next();
  }

  const { country } = geolocation(request);

  // If country can't be determined (local dev, non-Vercel deploy, edge
  // outage), fail open rather than locking out legitimate Nigerian users.
  if (country && country !== ALLOWED_COUNTRY) {
    return blockedResponse();
  }

  return next();
}
