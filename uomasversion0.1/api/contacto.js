const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Método no permitido.' });
    }

    const { nombre, telefono, mensaje } = req.body;

    if (!nombre || !telefono) {
        return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios.' });
    }

    try {
        await resend.emails.send({
            from: 'Puerto Nuevo <onboarding@resend.dev>',
            to: ['poafromu@gmail.com'],
            subject: `Nuevo contacto: ${nombre}`,
            html: `
                <h2>Nuevo mensaje desde el formulario de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong> ${mensaje || '(sin mensaje)'}</p>
                <p><small>Fecha: ${new Date().toLocaleString('es-MX')}</small></p>
            `
        });

        res.json({ ok: true, mensaje: 'Gracias, nos pondremos en contacto pronto.' });
    } catch (err) {
        console.error('Error enviando el correo:', err);
        res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje.' });
    }
};
