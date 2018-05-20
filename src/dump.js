/* eslint no-console: 0 */

const Inquirer = require('inquirer');
const moment = require('moment');
const path = require('path');
const ora = require('ora');
const shell = require('shelljs');

const COMMAND = 'mongodump';
let sAnwsers = null;

const askHostname = hostNames => wrapper(Inquirer.prompt({
    type: 'list',
    name: 'hostname',
    message: 'Which hostname?',
    choices: hostNames
}));

const askDatabases = databases => wrapper(Inquirer.prompt({
    type: 'list',
    name: 'bdd',
    message: 'Which BDD?',
    choices: databases
}));

const askFilename = filename => wrapper(Inquirer.prompt({
    type: 'input',
    name: 'file',
    message: 'What is the file name?',
    default: filename
}));

const wrapper = prom => new Promise((rs, rj) => {
    prom
    .then(answer => rs(sAnwsers.extend(answer)))
    .catch(err => rj(err));
});


module.exports = (answers, config) => {
    const hostNames = Object.entries(config.hosts).map(([key]) => key);
    const date = moment().format('DDMM-HHmm');
    sAnwsers = answers;

    askHostname(hostNames)
    .then(ans => askDatabases(config.hosts[ans.hostname].databases))
    .then(ans => askFilename(`BETA-${date}--${ans.bdd}.${config.hosts[ans.hostname].fileName}`))
    .then((ans) => {
        const spinner = ora(`Processing ${COMMAND} ...`).start();
        const dumpPath = path.resolve(config.path, ans.file);
        const { password, username, url } = config.hosts[ans.hostname];
        const command = `${COMMAND} -h ${url} -u ${username} -p ${password} -d ${ans.bdd} --gzip --out ${dumpPath}`;

        shell.exec(command, { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                spinner.fail(`Error during ${ans.command}`);
                console.error(stderr);
            } else {
                spinner.succeed(`${ans.command} done`);
            }
        });
    })
    .catch(err => console.log(`❌ Error : ${err.message || err}`));
};
