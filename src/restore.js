const Inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const { exec, ls } = require('shelljs');

const listBackups = require('./listBackups');

const COMMAND = 'mongorestore';

const askHostname = hostNames => Inquirer.prompt({
    type: 'list',
    name: 'hostname',
    message: 'Which hostname?',
    choices: hostNames
});

const askDatabases = databases => Inquirer.prompt({
    type: 'list',
    name: 'bdd',
    message: 'Which Database?',
    choices: databases
});

const askBackup = backups => Inquirer.prompt({
    type: 'list',
    name: 'backup',
    message: 'Select the backup you want to restore?',
    choices: backups
});

module.exports = (answers, config) => {
    const hostNames = Object.entries(config.hosts).map(([key]) => key);

    answers.wrap(askHostname(hostNames))
    .then(() => answers.wrap(askDatabases(config.hosts[answers.values.hostname].databases)))
    .then(() => answers.wrap(askBackup(listBackups(config.path))))
    .then((ans) => {
        const spinner = ora(`Processing ${COMMAND} ...`).start();
        const backupPath = path.resolve(config.path, ans.backup);
        const databases = ls(backupPath);

        if (!databases.length || databases.length > 1) {
            throw new Error('There is an error with you backups');
        }

        const database = databases[0];
        const { password, username, url } = config.hosts[ans.hostname];
        const command = `${COMMAND} -h ${url} -u ${username} -p ${password} -d ${ans.bdd}  --gzip --drop --nsFrom=${database} --nsTo=${ans.bdd} ${backupPath}/${database}`;
        const mongoRestoreCb = (code, stdout, stderr) => {
            if (code !== 0) {
                spinner.fail(`Error during ${ans.command}`);
                return spinner.fail(stderr);
            }
            return spinner.succeed(`${ans.command} finished`);
        };

        exec(command, { silent: true }, mongoRestoreCb);
    });
};
