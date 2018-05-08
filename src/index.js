const shell = require('shelljs');
const Inquirer = require('inquirer');
const moment = require('moment');
const path = require('path');
const ora = require('ora');
require('colors');

const pwd = process.env.PWD;
const config = require(path.join(pwd, '.rackrc.json'));
const hostNames = Object.entries(config.hosts).map(([key]) => key);

const save = {};

const commandRef = {
    Backup: 'mongodump',
    Restore: 'mongorestore'
};

const questions = [
    {
        type: 'list',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['Backup', 'Restore'],
        filter(val) {
            return commandRef[val];
        }
    },
    {
        type: 'list',
        name: 'hostname',
        message: 'Which hostname?',
        choices: hostNames,
        filter(val) {
            save.host = val;
            return config.hosts[val].url;
        }
    }
];

let saveAnswers = null;

Inquirer.prompt(questions).then((answers) => {
    saveAnswers = answers;
    return Inquirer.prompt({
        type: 'list',
        name: 'bdd',
        message: 'Which BDD?',
        choices: config.hosts[save.host].databases
    });
}).then((answers) => {
    Object.assign(saveAnswers, answers);
    const date = moment().format('DDMM-HHmm');
    if (saveAnswers.command === 'mongodump') {
        return Inquirer.prompt({
            type: 'input',
            name: 'file',
            message: 'What is the file name?',
            default: `${date}--${saveAnswers.bdd}.${config.hosts[save.host].fileName}.zip`
        });
    }
    const optionsFiles = shell.ls(config.path);
    if (!optionsFiles.length) throw new Error('There is no archive to restore');
    return Inquirer.prompt({
        type: 'list',
        name: 'file',
        message: `Select the archive to restore into ${saveAnswers.hostname}`,
        choices: optionsFiles
    });
})
.then((ans) => {
    Object.assign(ans, saveAnswers);
    const spinner = ora(`Processing ${ans.command} ...`).start();
    const dumpPath = path.resolve(config.path, ans.file);
    const drop = ans.command === 'mongorestore' ? '--drop' : '';
    const { password, username } = config.hosts[save.host];
    const command = `${ans.command} -h ${ans.hostname} -u ${username} -p ${password} -d ${ans.bdd} --gzip ${drop} --archive="${dumpPath}"`;

    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            spinner.fail(`Error during ${ans.command}`);
            console.log('Program stderr:', stderr); /* eslint no-console: 0 */
        } else {
            spinner.succeed(`${ans.command} done`);
        }
    });
})
.catch((err) => {
    console.log(`❌ Error : ${err.message}`); /* eslint no-console: 0 */
});
