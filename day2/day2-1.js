const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));

    code[1] = 12;
    code[2] = 2;

    let i = 0;
    let opcode;
    do {
        opcode = code[i];
        if (opcode == 1) {
            code[code[i + 3]] = code[code[i + 1]] + code[code[i + 2]];
            i += 4;
        } else if (opcode == 2) {
            code[code[i + 3]] = code[code[i + 1]] * code[code[i + 2]];
            i += 4;
        } else if (opcode != 99) {
            throw new Error('Invalid op: ' + opcode);
        }
    } while (opcode != 99);
    console.log(code[0]);
});