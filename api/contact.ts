import nodemailer from 'nodemailer';
import { env } from 'node:process';

interface ContactRequest {
  method?: string;
  body?: unknown;
}

interface ContactResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ContactResponse;
  json(payload: unknown): void;
}

interface Inquiry {
  name: string;
  email: string;
  instagramHandle: string;
  details: string;
  company?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export default async function handler(req: ContactRequest, res: ContactResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  if (!isRecord(req.body)) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const body = req.body as Partial<Inquiry>;
  if (typeof body.company === 'string' && body.company.trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const instagramHandle =
    typeof body.instagramHandle === 'string' ? body.instagramHandle.trim() : '';
  const details = typeof body.details === 'string' ? body.details.trim() : '';

  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    instagramHandle.length > 100 ||
    !details ||
    details.length > 5000
  ) {
    return res.status(400).json({ error: 'Please check the form fields and try again.' });
  }

  const gmailUser = env.GMAIL_USER;
  const appPassword = env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  const to = env.CONTACT_TO_EMAIL;
  if (!gmailUser || !appPassword || !to) {
    console.error('Contact email is not configured: set GMAIL_USER, GMAIL_APP_PASSWORD, and CONTACT_TO_EMAIL.');
    return res.status(500).json({ error: 'Email is not configured yet. Please try again later.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: appPassword },
    });

    await transporter.sendMail({
      from: { name: 'Portfolio Contact', address: gmailUser },
      to,
      replyTo: email,
      subject: 'Portfolio inquiry from ' + name.replace(/[\r\n]+/g, ' ').slice(0, 80),
      text: [
        'Name: ' + name,
        'Email: ' + email,
        'Instagram: ' + (instagramHandle || 'Not provided'),
        '',
        'Project details:',
        details,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Gmail SMTP failed to send a portfolio inquiry:', error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
    if (code === 'EAUTH') {
      return res.status(502).json({
        error: 'Gmail rejected the sign-in. Check GMAIL_USER and the App Password saved in Vercel.',
      });
    }
    return res.status(502).json({
      error: 'Gmail could not send the inquiry. Check the Vercel function logs for details.',
    });
  }
}