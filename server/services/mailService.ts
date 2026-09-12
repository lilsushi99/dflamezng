import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;
let initErrorLogged = false;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    if (!initErrorLogged) {
      console.warn('[MailService] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASSWORD missing) - booking emails will not be sent.');
      initErrorLogged = true;
    }
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

function firstName(fullName: string): string {
  return (fullName || '').trim().split(/\s+/)[0] || 'there';
}

interface BookingEmailInput {
  name: string;
  email: string;
  phone: string;
  project_location: string;
  budget?: string;
  project_brief: string;
}

/**
 * Sends the studio notification + client confirmation for a new booking.
 * Never throws - a booking must still succeed and be stored even if SMTP
 * is unreachable or misconfigured; failures are logged server-side only.
 */
export async function sendBookingEmails(booking: BookingEmailInput): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const studioEmail = process.env.STUDIO_NOTIFICATION_EMAIL || process.env.SMTP_USER!;
  const clientFirstName = firstName(booking.name);

  try {
    await t.sendMail({
      from: fromAddress,
      to: studioEmail,
      subject: `New Booking Request — ${booking.name}`,
      text: [
        `New booking request received:`,
        ``,
        `Name: ${booking.name}`,
        `Email: ${booking.email}`,
        `Phone/WhatsApp: ${booking.phone}`,
        `Project Location: ${booking.project_location}`,
        `Budget: ${booking.budget || 'Not specified'}`,
        ``,
        `Project Brief:`,
        booking.project_brief,
      ].join('\n'),
    });
  } catch (e) {
    console.warn('[MailService] Failed to send studio notification email:', e);
  }

  try {
    await t.sendMail({
      from: fromAddress,
      to: booking.email,
      subject: `We've received your booking request`,
      text: `Hello ${clientFirstName}, we have received your message and would get back to you as soon as possible.`,
    });
  } catch (e) {
    console.warn('[MailService] Failed to send client confirmation email:', e);
  }
}
