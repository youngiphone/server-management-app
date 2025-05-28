const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const serverRoutes = require('./routes/servers');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/servers', serverRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});