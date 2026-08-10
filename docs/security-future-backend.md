# Security checklist for the future backend

The public lead forms in the current project are UI mocks. They do not persist or
deliver production leads and must not be treated as a production-ready backend.
Do not enable real submissions until the controls below are implemented.

## Lead forms

- Validate every field again on the server with explicit length and format
  limits; reject unknown fields and oversized request bodies.
- Add abuse controls appropriate to traffic: persistent rate limiting, bot
  protection, a honeypot and CAPTCHA where justified, replay resistance and
  monitoring.
- Validate the required consent server-side and retain the consent version/time
  needed for the legal audit trail.
- Add CSRF/origin protection to any endpoint outside Next.js Server Actions.
- Store the minimum necessary personal data, define retention/deletion rules and
  obtain the required consent.
- Encrypt transport and protected storage, restrict operator access and keep an
  audit trail without logging form contents or personal data.
- Return neutral errors to users and alert operators without exposing provider or
  database details.

## File and image upload

- Do not trust filename, extension or browser MIME type. Verify magic bytes and
  allow only an explicit set of formats.
- Enforce byte, pixel and file-count limits before expensive processing; protect
  image libraries against decompression bombs.
- Generate server-side filenames, store uploads outside executable/static roots
  until validated and prevent path traversal and overwrite.
- Strip metadata when appropriate, re-encode images, scan files and serve them
  from an isolated origin with safe content-disposition and content-type headers.
- Use short-lived signed upload/download URLs and least-privilege storage roles.
- Never accept `data:`, `javascript:`, `file:`, plain HTTP or protocol-relative
  URLs as substitutes for uploads.

## 1C/API integration

- Authenticate service-to-service calls with rotatable credentials stored only
  in the secret manager; never expose them through `NEXT_PUBLIC_*` variables.
- Use an exact trusted-host allowlist, TLS, strict timeouts, bounded retries with
  backoff and circuit breaking. Protect any server-side URL fetching against
  SSRF, including redirects and DNS rebinding.
- Validate and normalize every 1C response against a versioned schema. Treat it
  as untrusted input, including rich text and image URLs.
- Use stable characteristic keys rather than display labels or array positions.
- Make writes idempotent, verify webhook signatures/timestamps and reject replay.
- Apply least-privilege database/service accounts and separate read/write access.
- Define stale-data, partial-failure and reconciliation behavior; monitor lag and
  failed synchronization without logging credentials or personal data.
- Paginate and cap result sizes; do not fetch the full catalogue for favorites or
  comparison when endpoints by ID become available.
- Cap both request and response body sizes and define credential/signature token
  rotation before launch.

## Before launch

- Add integration tests for valid, malformed, oversized, unauthorized and
  rate-limited requests.
- Add backups, restore drills, audit logging, alerting, vulnerability scanning and
  an incident-response owner.
- Perform a privacy/legal review and an external security review of the final
  deployment architecture.
