const menuButton = document.querySelector('.menu-btn');
const navigation = document.querySelector('.navlinks');

// Menú responsive
if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        navigation.classList.toggle('open');
    });

    navigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navigation.classList.remove('open');
        });
    });
}

// Formulario de contacto
const contactForm = document.getElementById('form-contacto');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const nombre = contactForm.querySelector('#nombre').value.trim();
        const telefono = contactForm.querySelector('#telefono').value.trim();
        const mensaje = contactForm.querySelector('#mensaje').value.trim();

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        formStatus.textContent = '';

        try {
            const response = await fetch('/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    telefono,
                    mensaje
                })
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                formStatus.textContent = data.mensaje || 'Gracias. Te contactaremos pronto.';
                formStatus.className = 'form-status form-status--success';
                contactForm.reset();
            } else {
                formStatus.textContent = data.error || 'No se pudo enviar el mensaje.';
                formStatus.className = 'form-status form-status--error';
            }
        } catch (error) {
            formStatus.textContent = 'No se pudo conectar. Puedes escribirnos por WhatsApp.';
            formStatus.className = 'form-status form-status--error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensaje';
        }
    });
}
