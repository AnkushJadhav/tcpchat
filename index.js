const Discovery = require("./modules/discovery");
const Registry = require("./modules/registry");

const inquirer = require('inquirer');

function main() {
    try {
        global.REGISTRY = new Registry();
        const discovery = new Discovery(9000);

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'identity',
                    message: "What's your name?"
                }
            ])
            .then(answers => {
                discovery.Start(answers.identity);
            })
            .catch(error => {
                if (error.isTtyError) {
                    console.error("cant run");
                } else {
                    console.error(error);
                }
            });
    }
    catch (err) {
        console.log(err);
    }
}

main();