const Inquirer = require('inquirer');
const path = require('path');

const Answers = require('./Answers');
const dump = require('./dump');
const restore = require('./restore');

const config = require(path.join(process.env.PWD, '.rackrc.json'));

const questions = [
    {
        type: 'list',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['Backup', 'Restore']
    }
];

function main() {
    const answers = new Answers();
    const options = {
        Backup: dump,
        Restore: restore
    };

    Inquirer.prompt(questions)
    .then(ans => answers.extend(ans))
    .then(ans => options[ans.command](answers, config));
}
main();
