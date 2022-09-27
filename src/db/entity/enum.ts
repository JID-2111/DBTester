// Enum is in a separate file so the Entity isn't also imported when used
// Causes issues with Electron when imported in front end

enum DBProvider {
  PostgreSQL = 'PostgreSQL',
}

export default DBProvider;
