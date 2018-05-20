class Answers {
    constructor(answers = {}) {
        this.values = answers;
    }

    extend(answers) {
        Object.assign(this.values, answers);
        return this.values;
    }
}

module.exports = Answers;
