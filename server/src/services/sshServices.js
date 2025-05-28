const { NodeSSH } = require('node-ssh');

const ssh = new NodeSSH();

const checkUpdates = async (server) => {
  try {
    await ssh.connect({
      host: server.ip,
      username: server.user,
      password: server.password
    });
    const result = await ssh.execCommand('sudo apt update && apt list --upgradable');
    await ssh.dispose();
    return { updatesAvailable: result.stdout.includes('upgradable') };
  } catch (error) {
    console.error(`Erreur SSH pour ${server.ip}:`, error);
    return { updatesAvailable: false };
  }
};

const updateServer = async (server) => {
  try {
    await ssh.connect({
      host: server.ip,
      username: server.user,
      password: server.password
    });
    await ssh.execCommand('sudo apt update && sudo apt upgrade -y');
    await ssh.dispose();
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de ${server.ip}:`, error);
  }
};

module.exports = { checkUpdates, updateServer };