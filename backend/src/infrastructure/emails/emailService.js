// backend/src/infrastructure/email/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? 'TrabajoYa <onboarding@resend.dev>';

/**
 * Email de confirmación al candidato
 */
export async function sendApplicationConfirmation({ candidateName, candidateEmail, jobTitle, jobLocation }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: candidateEmail,
      subject: `✅ Postulación recibida — ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1A1F3C;">¡Hola, ${candidateName}! 👋</h2>
          <p style="color: #6B7280;">Tu postulación fue recibida con éxito.</p>

          <div style="background: #FFF8F5; border-left: 4px solid #FF5733; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-weight: 700; color: #1A1F3C;">${jobTitle}</p>
            <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">📍 ${jobLocation}</p>
          </div>

          <p style="color: #6B7280;">El empleador revisará tu perfil y se pondrá en contacto si eres seleccionado. ¡Mucha suerte!</p>

          <hr style="border: none; border-top: 1px solid #EDE8E5; margin: 32px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            TrabajoYa — Plataforma de empleos en Barranquilla
          </p>
        </div>
      `,
    });
  } catch (err) {
    // No bloqueamos la postulación si el email falla
    console.error('Error enviando email al candidato:', err.message);
  }
}

/**
 * Notificación al empleador cuando alguien se postula
 */
export async function sendEmployerNotification({ employerEmail, employerName, candidateName, candidateEmail, candidatePhone, jobTitle, message }) {
  if (!employerEmail) return; // Si no tenemos email del empleador, skip

  try {
    await resend.emails.send({
      from: FROM,
      to: employerEmail,
      subject: `👤 Nueva postulación — ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1A1F3C;">Nueva postulación recibida 🎉</h2>
          <p style="color: #6B7280;">Alguien se postuló a tu vacante <strong>${jobTitle}</strong>.</p>

          <div style="background: #F9FAFB; border: 1px solid #EDE8E5; padding: 20px; border-radius: 12px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; color: #1A1F3C;">${candidateName}</h3>
            <p style="margin: 4px 0; color: #6B7280; font-size: 14px;">📧 <a href="mailto:${candidateEmail}" style="color: #FF5733;">${candidateEmail}</a></p>
            ${candidatePhone ? `<p style="margin: 4px 0; color: #6B7280; font-size: 14px;">📞 ${candidatePhone}</p>` : ''}
            ${message ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #EDE8E5;">
                <p style="font-size: 13px; font-weight: 600; color: #9CA3AF; margin: 0 0 6px;">MENSAJE DEL CANDIDATO</p>
                <p style="color: #1A1F3C; font-size: 14px; margin: 0;">${message}</p>
              </div>
            ` : ''}
          </div>

          <hr style="border: none; border-top: 1px solid #EDE8E5; margin: 32px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            TrabajoYa — Plataforma de empleos en Barranquilla
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Error enviando email al empleador:', err.message);
  }
}