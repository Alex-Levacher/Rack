const { ls } = require('shelljs');

const listBackups = (path) => {
    const backups = ls(path);
    if (!backups.length) {
        throw new Error('There is no backups to restore');
    }
    return backups;
};

module.exports = listBackups;
