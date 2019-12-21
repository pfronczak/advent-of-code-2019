const readline = require('readline');
const Computer = require('./computer.js');

const rl = readline.createInterface({
    input: process.stdin
});


let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    let computer = new Computer(code.slice());
    computer.input.push(1);
    computer.run();
    console.log(computer.output);
});
