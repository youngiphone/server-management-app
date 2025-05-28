import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [servers, setServers] = useState([]);
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState({ name: '', ip: '', user: '', password: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/api/servers')
      .then(response => setServers(response.data))
      .catch(error => console.error('Erreur lors de la récupération des serveurs:', error));
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddServer = async () => {
    if (newServer.name && newServer.ip && newServer.user && newServer.password) {
      try {
        const response = await axios.post('http://localhost:3000/api/servers', newServer);
        setServers([...servers, response.data]);
        setNewServer({ name: '', ip: '', user: '', password: '' });
        setIsAddingServer(false);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du serveur:', error);
      }
    }
  };

  const updateServer = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/servers/${id}/update`);
      setServers(servers.map(server =>
        server.id === id ? { ...server, status: 'up-to-date', updatesAvailable: false } : server
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du serveur:', error);
    }
  };

  const updateAllServers = async () => {
    try {
      await axios.post('http://localhost:3000/api/servers/update-all');
      setServers(servers.map(server => ({ ...server, status: 'up-to-date', updatesAvailable: false })));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de tous les serveurs:', error);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Serveurs Ubuntu</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <button
          onClick={() => setIsAddingServer(true)}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Ajouter un serveur
        </button>

        {isAddingServer && (
          <div className="mb-6 p-4 bg-gray-800 dark:bg-gray-200 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Ajouter un serveur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du serveur"
                value={newServer.name}
                onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                className="p-2 rounded bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900"
              />
              <input
                type="text"
                placeholder="Adresse IP"
                value={newServer.ip}
                onChange={(e) => setNewServer({ ...newServer, ip: e.target.value })}
                className="p-2 rounded bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900"
              />
              <input
                type="text"
                placeholder="Utilisateur"
                value={newServer.user}
                onChange={(e) => setNewServer({ ...newServer, user: e.target.value })}
                className="p-2 rounded bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newServer.password}
                onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                className="p-2 rounded bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsAddingServer(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleAddServer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        <button
          onClick={updateAllServers}
          className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Mettre à jour tous les serveurs
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map(server => (
            <div key={server.id} className="p-4 bg-gray-800 dark:bg-gray-200 rounded shadow">
              <h2 className="text-xl font-semibold">{server.name}</h2>
              <p className="text-gray-400 dark:text-gray-600">IP: {server.ip}</p>
              <p className="text-gray-400 dark:text-gray-600">Utilisateur: {server.user}</p>
              <p className={`mt-2 ${server.status === 'up-to-date' ? 'text-green-500' : server.status === 'updates-available' ? 'text-yellow-500' : 'text-gray-500'}`}>
                Statut: {server.status === 'checking' ? 'Vérification...' : server.status === 'updating' ? 'Mise à jour...' : server.status === 'up-to-date' ? 'À jour' : 'Mises à jour disponibles'}
              </p>
              {server.updatesAvailable && (
                <button
                  onClick={() => updateServer(server.id)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  disabled={server.status === 'updating'}
                >
                  Mettre à jour
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;