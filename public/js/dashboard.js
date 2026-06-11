// ===== Dashboard Module =====

function getDashboardPageForRole(role) {
  if (role === 'Admin') return 'dashboard_admin.html';
  if (role === 'Coach') return 'dashboard_coach.html';
  return 'dashboard_usuario.html';
}

// Verificar autenticación al cargar
function requireAuth() {
  const token = sessionStorage.getItem('authToken');
  const userJson = sessionStorage.getItem('pigfitUser');

  if (!token || !userJson) {
    console.log('No autenticado, redirigiendo a login...');
    window.location.href = 'login.html';
    return null;
  }

  const user = JSON.parse(userJson);
  const currentPage = window.location.pathname.split('/').pop();
  const expectedPage = getDashboardPageForRole(user.role);
  const dashboardPages = ['dashboard_admin.html', 'dashboard_coach.html', 'dashboard_usuario.html'];

  if (dashboardPages.includes(currentPage) && currentPage !== expectedPage) {
    window.location.href = expectedPage;
    return null;
  }

  return user;
}

// Cargar dashboard
async function loadDashboard() {
  const user = requireAuth();
  if (!user) return;

  try {
    document.getElementById('user-info').textContent = `${user.name} (${user.role})`;

    const dashboard = await apiRequest('/dashboard', {
      method: 'GET'
    });

    document.getElementById('dashboard-title').textContent = dashboard.title;
    renderDashboardCards(dashboard.stats);
    renderExtraData(dashboard);

    if (user.role === 'Admin') {
      loadUsersList();
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    alert('Error al cargar el dashboard: ' + error.message);
  }
}

function renderDashboardCards(stats) {
  const container = document.getElementById('dashboard-cards');
  container.innerHTML = '';

  stats.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-content">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderExtraData(dashboard) {
  const extraContainer = document.getElementById('extra-container');
  if (!extraContainer) return;

  const role = dashboard.role;

  if (role === 'Admin' && dashboard.extraData.allUsers) {
    // Ya manejado por loadUsersList
  } else if (role === 'Coach' && dashboard.extraData.athletes) {
    renderAthletesList(dashboard.extraData.athletes);
  } else if (role === 'Athlete' && dashboard.extraData.nextWorkouts) {
    renderNextWorkouts(dashboard.extraData.nextWorkouts);
  }
}

function renderAthletesList(athletes) {
  const container = document.getElementById('extra-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'athletes-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Progreso</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${athletes.map(athlete => `
        <tr>
          <td>${athlete.name}</td>
          <td>${athlete.email}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${athlete.progress}%"></div>
            </div>
            <small>${athlete.progress}%</small>
          </td>
          <td><span class="badge">${athlete.status}</span></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
}

function renderNextWorkouts(workouts) {
  const container = document.getElementById('extra-container');
  container.innerHTML = '';

  workouts.forEach(workout => {
    const card = document.createElement('div');
    card.className = 'workout-card-upcoming';
    card.innerHTML = `
      <h4>${workout.name}</h4>
      <p><strong>Fecha:</strong> ${workout.date}</p>
      <p><strong>Hora:</strong> ${workout.time}</p>
    `;
    container.appendChild(card);
  });
}

// ===== Admin User Management =====

async function loadUsersList() {
  try {
    const users = await apiRequest('/users', { method: 'GET' });
    renderUsersList(users);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function renderUsersList(users) {
  window.currentUserList = users;
  const tbody = document.querySelector('#users-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge">${user.role}</span></td>
      <td>${new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
      <td>
        <button onclick="window.editUser(${user.id})" class="btn btn-small btn-secondary">✏️ Editar</button>
        <button onclick="window.deleteUser(${user.id})" class="btn btn-small btn-danger">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function resetUserForm() {
  const addUserForm = document.getElementById('add-user-form');
  const userForm = document.getElementById('user-form');
  if (!userForm || !addUserForm) return;

  userForm.reset();
  document.getElementById('user-id').value = '';
  document.getElementById('user-password').value = '';
  addUserForm.style.display = 'none';
}

window.editUser = function(userId) {
  const user = window.currentUserList?.find(u => u.id === userId);
  const addUserForm = document.getElementById('add-user-form');
  const userForm = document.getElementById('user-form');
  const formTitle = document.getElementById('user-form-title');

  if (!user || !userForm || !addUserForm || !formTitle) return;

  addUserForm.style.display = 'block';
  formTitle.textContent = 'Editar usuario';
  document.getElementById('user-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-role').value = user.role;
  document.getElementById('user-password').value = '';
};

window.deleteUser = async function(userId) {
  if (!confirm('¿Eliminar este usuario definitivamente?')) return;

  try {
    await apiRequest(`/users/${userId}`, { method: 'DELETE' });
    alert('✅ Usuario eliminado');
    loadUsersList();
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
};

// Manejo del formulario de agregar usuario
const addUserBtn = document.getElementById('add-user-btn');
const addUserForm = document.getElementById('add-user-form');
const userForm = document.getElementById('user-form');
const cancelFormBtn = document.getElementById('cancel-form');

if (addUserBtn) {
  addUserBtn.addEventListener('click', () => {
    resetUserForm();
    addUserForm.style.display = 'block';
    const formTitle = document.getElementById('user-form-title');
    if (formTitle) formTitle.textContent = 'Nuevo usuario';
  });
}

if (cancelFormBtn) {
  cancelFormBtn.addEventListener('click', () => {
    resetUserForm();
  });
}

if (userForm) {
  userForm.addEventListener('submit', handleSaveUser);
}

async function handleSaveUser(e) {
  e.preventDefault();

  const userId = document.getElementById('user-id').value;
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const role = document.getElementById('user-role').value;

  if (!name || !email || !role) {
    alert('⚠️ Completa los campos requeridos');
    return;
  }

  try {
    if (userId) {
      const body = { name, email, role };
      if (password) body.password = password;

      await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      });
      alert('✅ Usuario actualizado');
    } else {
      if (!password) {
        alert('⚠️ La contraseña es requerida para nuevos usuarios');
        return;
      }
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      alert('✅ Usuario creado');
    }

    resetUserForm();
    loadUsersList();
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
}

// ===== Logout =====
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('pigfitUser');
    window.location.href = 'login.html';
  });
}

// ===== Navigation Sidebar =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remover active de todos
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Obtener sección
    const section = item.dataset.section;

    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-section').forEach(s => {
      s.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const selectedSection = document.getElementById(section + '-section');
    if (selectedSection) {
      selectedSection.classList.add('active');
    }
  });
});

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', loadDashboard);
