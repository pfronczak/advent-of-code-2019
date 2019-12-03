const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));

    for (let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb++) {
            const mem = code.slice();
            mem[1] = noun;
            mem[2] = verb;
            let result = run(mem);
            if (result == 19690720) {
                console.log(noun, verb, 100 * noun + verb);
                return;
            }
        }        
    }
});

function run(code) {
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
    return code[0];
}