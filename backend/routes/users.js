const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../db/users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function saveUsers(users) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users:', err);
    throw err;
  }
}

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await readUsers();
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST /api/users - Crear nuevo usuario (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña requeridos' });
    }

    const users = await readUsers();
    const userExists = users.some(u => u.email === email);

    if (userExists) {
      return res.status(400).json({ error: 'El email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password: hashedPassword,
      role: role || 'Athlete',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/users/:id - Actualizar usuario (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = parseInt(req.params.id);

    const users = await readUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await saveUsers(users);

    res.json({
      message: 'Usuario actualizado',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - Eliminar usuario (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const deletedUser = users.splice(userIndex, 1);
    await saveUsers(users);

    res.json({
      message: 'Usuario eliminado exitosamente',
      user: deletedUser[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
