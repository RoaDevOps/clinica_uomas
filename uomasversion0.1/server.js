require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Le dice a Express que sirva todo lo que está en la carpeta "public"
app.use(express.static('public'));

// Permite que el servidor entienda datos enviados en formato JSON
app.use(express.json());

// Ruta donde llegará el formulario de contacto
app.post('/api/contacto', async (req, res) => {
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

        console.log('✅ Correo enviado, contacto de:', nombre);
        res.json({ ok: true, mensaje: 'Gracias, nos pondremos en contacto pronto.' });
    } catch (err) {
        console.error('Error enviando el correo:', err);
        res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
