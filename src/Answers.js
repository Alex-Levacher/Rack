const util = require('util');

class Answers {
    constructor(answers = {}) {
        this.values = answers;
    }

    extend(answers) {
        Object.assign(this.values, answers);
        return this.values;
    }

    wrap(promise) {
        return new Promise(((res, rej) => {
            promise
            .then(answer => res(this.extend(answer)))
            .catch(err => rej(err));
        }));
    }

    [util.inspect.custom]() {
        return this.values;
    }
}

module.exports = Answers;
