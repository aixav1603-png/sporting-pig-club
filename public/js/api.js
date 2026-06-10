// ===== API Communication Layer =====
const API_BASE_URL = 'http://localhost:5000/api';

// Detectar si se está ejecutando en host estático
function isStaticHost() {
  const origin = window.location.origin;
  return origin.includes('file://') || origin.includes('github.io') || origin.includes('127.0.0.1:5500');
}

// Simular datos cuando se ejecuta en host estático
function handleStaticSimulation(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = sessionStorage.getItem('authToken');
      const user = JSON.parse(sessionStorage.getItem('pigfitUser') || '{}');

      if (endpoint === '/api/auth/login' || endpoint === '/api/auth/register') {
        resolve({
          message: 'Éxito en simulación',
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 100),
            name: 'Mock User',
            email: 'mock@example.com',
            role: 'Athlete'
          }
        });
      } else if (endpoint === '/api/dashboard') {
        const role = user.role || 'Athlete';
        
        if (role === 'Admin') {
          resolve({
            title: 'Panel de administración',
            role: 'Admin',
            stats: [
              { label: 'Total de usuarios', value: 42 },
              { label: 'Entrenadores activos', value: 5 },
              { label: 'Atletas registrados', value: 37 },
              { label: 'Estado del sistema', value: 'Online' }
            ],
            extraData: {
              allUsers: [
                { id: 1, name: 'Admin Pig', email: 'admin@pigfit.com', role: 'Admin', createdAt: '2024-01-01' },
                { id: 2, name: 'Coach Hammy', email: 'coach@pigfit.com', role: 'Coach', createdAt: '2024-01-02' },
                { id: 3, name: 'Truffles Athlete', email: 'athlete@pigfit.com', role: 'Athlete', createdAt: '2024-01-03' }
              ]
            }
          });
        } else if (role === 'Coach') {
          resolve({
            title: 'Panel de entrenador',
            role: 'Coach',
            stats: [
              { label: 'Atletas asignados', value: 12 },
              { label: 'Entrenamientos planificados', value: 8 },
              { label: 'Rendimiento promedio', value: '78.5%' },
              { label: 'Sesiones esta semana', value: 14 }
            ],
            extraData: {
              athletes: [
                { id: 3, name: 'Truffles', email: 'truffles@mail.com', progress: 75, status: 'Excelente' },
                { id: 4, name: 'Peppa', email: 'peppa@mail.com', progress: 60, status: 'Requiere revisión' },
                { id: 5, name: 'George', email: 'george@mail.com', progress: 85, status: 'Excelente' }
              ]
            }
          });
        } else {
          resolve({
            title: 'Mi progreso',
            role: 'Athlete',
            stats: [
              { label: 'Sesiones esta semana', value: 4 },
              { label: 'Calorías quemadas', value: '1850' },
              { label: 'Cumplimiento de objetivos', value: '78.5%' },
              { label: 'Récords personales', value: 7 }
            ],
            extraData: {
              nextWorkouts: [
                { name: 'Entrenamiento de fuerza', date: 'Hoy', time: '14:00' },
                { name: 'Cardio', date: 'Mañana', time: '10:00' },
                { name: 'Flexibilidad y estiramientos', date: 'Miércoles', time: '16:00' }
              ]
            }
          });
        }
      } else if (endpoint === '/api/users') {
        resolve([
          { id: 1, name: 'Admin Pig', email: 'admin@pigfit.com', role: 'Admin', createdAt: '2024-01-01' },
          { id: 2, name: 'Coach Hammy', email: 'coach@pigfit.com', role: 'Coach', createdAt: '2024-01-02' },
          { id: 3, name: 'Truffles Athlete', email: 'athlete@pigfit.com', role: 'Athlete', createdAt: '2024-01-03' }
        ]);
      } else {
        resolve({ success: true, data: 'Mock response' });
      }
    }, 300);
  });
}

// Función principal de API
async function apiRequest(endpoint, options = {}) {
  // Si estamos en host estático, usar simulación
  if (isStaticHost()) {
    console.log('🔄 Usando simulación de datos (Host Estático)');
    return handleStaticSimulation(endpoint);
  }

  const url = API_BASE_URL + endpoint;
  const token = sessionStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token && !endpoint.includes('/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}
