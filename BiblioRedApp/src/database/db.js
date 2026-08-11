// Base de datos local con SQLite (expo-sqlite, API asíncrona actual).
// Aquí se crea la tabla de usuarios, se inserta un usuario de prueba
// y se valida el login de forma LOCAL (sin API todavía).
import * as SQLite from 'expo-sqlite';

let dbInstance = null;

// Abre (una sola vez) la base de datos.
export async function getDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('bancolibro.db');
  }
  return dbInstance;
}

// Crea la tabla y siembra el usuario por defecto si no existe.
export async function initDB() {
  const db = await getDB();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT,
      rol TEXT
    );
  `);

  // ¿Ya hay usuarios? Si no, insertamos el de prueba.
  const fila = await db.getFirstAsync('SELECT COUNT(*) AS total FROM usuarios');
  if (!fila || fila.total === 0) {
    await db.runAsync(
      'INSERT INTO usuarios (usuario, password, nombre, rol) VALUES (?, ?, ?, ?)',
      ['admin', '1234', 'Miguel Mendoza', 'Administrador']
    );
    // Puedes añadir más usuarios aquí si quieres:
    // await db.runAsync('INSERT INTO usuarios (usuario, password, nombre, rol) VALUES (?, ?, ?, ?)',
    //   ['biblio', '1234', 'Encargado', 'Bibliotecario']);
  }
}

// Valida credenciales contra SQLite. Devuelve el usuario o null.
export async function validarUsuario(usuario, password) {
  const db = await getDB();
  const fila = await db.getFirstAsync(
    'SELECT id, usuario, nombre, rol FROM usuarios WHERE usuario = ? AND password = ?',
    [usuario, password]
  );
  return fila || null;
}
