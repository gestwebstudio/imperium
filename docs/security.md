# Security: deployment and operations

## Admin authentication

The admin area uses opaque, database-backed sessions. The browser receives a
random token; only its SHA-256 hash is stored in `AdminSession`. The cookie is
`HttpOnly`, `SameSite=Strict`, limited to `/admin`, expires with the session and
is marked `Secure` in production. Protected layouts, every admin data-access
function and every mutating server action check the database session.

Configure the production environment before serving `/admin`:

- `ADMIN_PASSWORD_HASH`: bcrypt hash (required, fail-closed);
- `ADMIN_SESSION_TTL_HOURS`: session duration, default `8`, allowed `1..168`;
- `ADMIN_IMAGE_HOSTS`: comma-separated exact hostnames allowed for remote admin
  images; local images must use `/images/...`;
- `ADMIN_TRUSTED_PROXY_IP_HEADER`: optional header used for per-client login
  throttling. Set it only when a trusted reverse proxy overwrites that header.
  Otherwise all clients intentionally use one conservative shared bucket;
- `CSP_REPORT_ONLY=true`: temporary rollout mode only. Production should use the
  enforcing default after CSP reports have been reviewed.

Generate the password hash without placing the plaintext password in shell
history:

```sh
npm run admin:hash-password
```

The command reads from an interactive hidden prompt or stdin and prints only the
bcrypt hash. Never configure the removed `ADMIN_PASSWORD` variable. Run Prisma
migrations before starting a deployment. Rotating the password hash prevents new
logins with the old password; delete rows from `AdminSession` when an immediate
global logout is required.

## Headers and CSP

Global headers include CSP, clickjacking protection, MIME sniffing protection,
a restrictive Permissions Policy and a strict referrer policy. HSTS is emitted
only in production. CSP permits frames only from the exact services currently in
use (`https://yandex.ru` and `https://vk.com`). `style-src 'unsafe-inline'` is
currently required by Next.js and the UI libraries; it should be revisited when
nonce-based style support is practical. `script-src 'unsafe-inline'` is kept for
the current static-rendered Next.js bootstrap; introducing request nonces would
force public pages into dynamic rendering and is intentionally a separate task.
Production CSP does not allow `'unsafe-eval'`.

HSTS is configured as `max-age=31536000` only in production, without
`includeSubDomains` or `preload`. Confirm that the hosting platform does not add
a conflicting HSTS value before deployment.

Admin responses are dynamic, non-cacheable and receive `Cache-Control: private,
no-store`. Next.js Server Action origin checks remain enabled and request bodies
are capped at 1 MB. No permissive CORS policy is configured.

## Manual GitHub repository settings

These settings cannot be committed as files and must be enabled by a repository
administrator:

1. Enable Dependabot alerts and security updates.
2. Enable secret scanning and push protection.
3. Protect `catalog` (and the eventual production branch): require pull requests,
   at least one approval, resolved conversations and the `Security and quality`
   status check.
4. Block force pushes and branch deletion for protected branches.
5. Restrict Actions permissions to read-only by default and allow only required
   third-party actions.
6. Review repository collaborators and deploy keys regularly; use least
   privilege and require 2FA for the organization.

## Incident basics

- Suspected admin compromise: rotate `ADMIN_PASSWORD_HASH`, delete all
  `AdminSession` rows, review content changes and deployment logs.
- Leaked deployment secret: rotate it in the hosting provider, invalidate related
  sessions/tokens and remove it from Git history using the organization process.
- Unexpected CSP reports: verify the blocked origin before changing the allowlist;
  never add a wildcard as a quick fix.
