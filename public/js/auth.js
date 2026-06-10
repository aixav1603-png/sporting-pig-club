// ===== Authentication Module =====

// Para login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

// Para register
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    sessionStorage.setItem('authToken', response.token);
    sessionStorage.setItem('pigfitUser', JSON.stringify(response.user));

    redirectByRole(response.user.role);
  } catch (error) {
    alert('Error de login: ' + error.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');

  if (!name || !email || !password || !role) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    sessionStorage.setItem('authToken', response.token);
    sessionStorage.setItem('pigfitUser', JSON.stringify(response.user));

    redirectByRole(response.user.role);
  } catch (error) {
    alert('Error de registro: ' + error.message);
  }
}

function redirectByRole(role) {
  if (role === 'Admin') {
    window.location.href = 'dashboard_admin.html';
  } else if (role === 'Coach') {
    window.location.href = 'dashboard_coach.html';
  } else {
    window.location.href = 'dashboard_usuario.html';
  }
}

window.logout = function() {
  if (confirm('¿Deseas cerrar sesión?')) {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('pigfitUser');
    window.location.href = 'login.html';
  }
};
