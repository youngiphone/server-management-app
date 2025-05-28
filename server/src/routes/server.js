const express = require('express');
const { checkUpdates, updateServer } = require('../services/sshService');

const router = express.Router();
let servers = [
  { id: 1, name: 'Serveur 1', ip: '192.168.1.10', user: 'admin', password: 'password', status: 'checking', updatesAvailable: false },
  { id: 2, name: 'Serveur 2', ip: '192.168.1.11', user: 'admin', password: 'password', status: 'checking', updatesAvailable: false }
];

router.get('/', async (req, res) => {
  const updatedServers = await Promise.all(servers.map(async server => {
    const result = await checkUpdates(server);
    return { ...server, status: result.updatesAvailable ? 'updates-available' : 'up-to-date', updatesAvailable: result.updatesAvailable };
  }));
  servers = updatedServers;
  res.json(servers);
});

router.post('/', async (req, res) => {
  const newServer = {
    id: servers.length + 1,
    ...req.body,
    status: 'checking',
    updatesAvailable: false
  };
  servers.push(newServer);
  const result = await checkUpdates(newServer);
  servers = servers.map(s => s.id === newServer.id ? { ...s, status: result.updatesAvailable ? 'updates-available' : 'up-to-date', updatesAvailable: result.updatesAvailable } : s);
  res.json(newServer);
});

router.post('/:id/update', async (req, res) => {
  const serverId = parseInt(req.params.id);
  const server = servers.find(s => s.id === serverId);
  if (!server) return res.status(404).json({ error: 'Serveur non trouvé' });
  await updateServer(server);
  servers = servers.map(s => s.id === serverId ? { ...s, status: 'up-to-date', updatesAvailable: false } : s);
  res.json({ message: 'Serveur mis à jour' });
});

router.post('/update-all', async (req, res) => {
  await Promise.all(servers.map(async server => {
    if (server.updatesAvailable) {
      await updateServer(server);
    }
  }));
  servers = servers.map(s => ({ ...s, status: 'up-to-date', updatesAvailable: false }));
  res.json({ message: 'Tous les serveurs ont été mis à jour' });
});

module.exports = router;