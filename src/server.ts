import app from './app';
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log('Routes disponibles:');
  console.log(`  - GET http://localhost:${PORT}/health`);
  console.log(`  - GET http://localhost:${PORT}/test-db`);
  console.log(`  - GET http://localhost:${PORT}/api/info`);
  console.log(`  - GET http://localhost:${PORT}/api/competences`);
});