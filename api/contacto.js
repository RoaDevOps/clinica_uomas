const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Método no permitido.' });
    }

    const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
    const telefono = typeof req.body?.telefono === 'string' ? req.body.telefono.trim() : '';
    const mensaje = typeof req.body?.mensaje === 'string' ? req.body.mensaje.trim() : '';

    if (!nombre || !telefono) {
        return res.status(400).json({ ok: false, error: 'Nombre y teléfono son obligatorios.' });
    }

    if (nombre.length < 2 || nombre.length > 80) {
        return res.status(400).json({ ok: false, error: 'El nombre no tiene una longitud válida.' });
    }

    const telefonoNormalizado = telefono.replace(/[\s().-]/g, '');
    if (!/^\+?\d{8,15}$/.test(telefonoNormalizado)) {
        return res.status(400).json({ ok: false, error: 'Ingresa un número de teléfono válido.' });
    }

    if (mensaje.length > 1500) {
        return res.status(400).json({ ok: false, error: 'El mensaje es demasiado largo.' });
    }

    try {
        await resend.emails.send({
            // onboarding@resend.dev se mantiene hasta verificar una dirección del dominio en Resend.
            from: 'Una Oportunidad Más <onboarding@resend.dev>',
            to: ['poafromu@gmail.com'],
            subject: `Nuevo contacto: ${nombre.slice(0, 80)}`,
            html: `
                <h2>Nuevo mensaje desde Una Oportunidad Más</h2>
                <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
                <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
                <p><strong>Mensaje:</strong> ${escapeHtml(mensaje || '(sin mensaje)').replace(/\n/g, '<br>')}</p>
                <p><small>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</small></p>
            `
        });

        return res.status(200).json({ ok: true, mensaje: 'Gracias, nos pondremos en contacto pronto.' });
    } catch (err) {
        console.error('Error enviando el correo:', err);
        return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje.' });
    }
};
