/**
 * AgriFetch production server — Node 22 built-ins only, zero npm deps.
 * Serves the Vite SPA from ./dist and handles POST /api/enquiry via Resend.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000
const FROM = process.env.RESEND_FROM_EMAIL || 'enquiries@agrifetch.com'
const TO   = process.env.ENQUIRY_TO_EMAIL   || 'info@agrifetch.com'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
}

function sendFile(res, filePath) {
  const ext  = path.extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'
  const isAsset = filePath.includes(`${path.sep}assets${path.sep}`)
  res.writeHead(200, {
    'Content-Type':  mime,
    'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  fs.createReadStream(filePath).pipe(res)
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function plainText(name, company, email, product, message) {
  return [
    'New enquiry from the AgriFetch website.',
    '',
    `Name:    ${name}`,
    `Company: ${company || '—'}`,
    `Email:   ${email}`,
    `Product: ${product || 'Not specified'}`,
    '',
    'Message',
    '-------',
    message,
  ].join('\n')
}

function htmlEmail(name, company, email, product, message) {
  const e = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#060f0c;font-family:'Segoe UI',system-ui,sans-serif;color:#e6f4ee">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:32px auto">
  <tr>
    <td style="background:#0d1f19;border:1px solid #1e3d2f;border-radius:12px;padding:32px">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7aab8a">
        AgriFetch &mdash; Website Enquiry
      </p>
      <h1 style="margin:0 0 24px;font-size:20px;color:#b8f600">New Enquiry Received</h1>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#7aab8a;width:90px">Name</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#e6f4ee">${e(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#7aab8a">Company</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#e6f4ee">${e(company) || '&mdash;'}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#7aab8a">Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px">
            <a href="mailto:${e(email)}" style="color:#b8f600;text-decoration:none">${e(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#7aab8a">Product</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3d2f;font-size:13px;color:#e6f4ee">${e(product) || 'Not specified'}</td>
        </tr>
      </table>
      <p style="margin:20px 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#7aab8a">Message</p>
      <div style="background:#112518;border-left:3px solid #b8f600;border-radius:6px;padding:14px 16px;font-size:14px;line-height:1.6;color:#e6f4ee;white-space:pre-wrap">${e(message)}</div>
      <p style="margin:24px 0 0;font-size:11px;color:#7aab8a">
        Reply directly to this email to respond to ${e(name)}.
      </p>
    </td>
  </tr>
</table>
</body>
</html>`
}

async function handleEnquiry(req, res) {
  let raw = ''
  for await (const chunk of req) raw += chunk

  let body
  try { body = JSON.parse(raw) } catch {
    return json(res, 400, { detail: 'Invalid JSON.' })
  }

  const name    = String(body.name    ?? '').trim()
  const company = String(body.company ?? '').trim()
  const email   = String(body.email   ?? '').trim()
  const product = String(body.product ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !email || !message)
    return json(res, 422, { detail: 'name, email, and message are required.' })
  if (name.length > 120 || company.length > 120 || message.length > 4000)
    return json(res, 422, { detail: 'One or more fields exceed the maximum length.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json(res, 422, { detail: 'Invalid email address.' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return json(res, 503, { detail: 'Email delivery is not configured.' })

  const subject = `AgriFetch Enquiry — ${name}${company ? ` (${company})` : ''}`

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:     `AgriFetch <${FROM}>`,
        to:       [TO],
        reply_to: [email],
        subject,
        text: plainText(name, company, email, product, message),
        html: htmlEmail(name, company, email, product, message),
      }),
    })
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text())
      return json(res, 502, { detail: 'Failed to deliver your enquiry.' })
    }
    res.writeHead(204)
    res.end()
  } catch (err) {
    console.error('Resend fetch error:', err)
    json(res, 502, { detail: 'Failed to deliver your enquiry.' })
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (req.method === 'GET' && pathname === '/healthz') {
    return json(res, 200, { status: 'ok' })
  }

  if (req.method === 'POST' && pathname === '/api/enquiry') {
    return handleEnquiry(req, res)
  }

  if (req.method === 'GET') {
    const candidate = path.join(DIST, pathname === '/' ? 'index.html' : pathname)
    try {
      const stat = fs.statSync(candidate)
      return sendFile(res, stat.isDirectory() ? path.join(candidate, 'index.html') : candidate)
    } catch {
      return sendFile(res, path.join(DIST, 'index.html'))
    }
  }

  res.writeHead(405)
  res.end()
})

server.listen(PORT, () => console.log(`AgriFetch listening on :${PORT}`))
