const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    run(code);
});

const INPUT = 1;

function run(mem) {
    let ip = 0;
    let opcode;
    do {
        let instrCode = mem[ip];
        opcode = instrCode % 100;
        let instruction = instructions[opcode];
        if (instruction) {
            const paramModes = [2, 3, 4].map(pow => Math.floor(instrCode / Math.pow(10, pow)) % 10);
            instruction.execute(INPUT, mem.slice(ip + 1, ip + instruction.length), paramModes, mem);
            ip += instruction.length;
        } else {
            throw new Error('Invalid op: ' + opcode);
        }
    } while (opcode != 99);
}

const instructions = {
    1: {
        length: 4,
        execute: (input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 + arg2;
        }
    },
    2: {
        length: 4,
        execute: (input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 * arg2;
        }
    },
    3: {
        length: 2,
        execute: (input, params, paramModes, mem) => {
            mem[params[0]] = input;
        }
    },
    4: {
        length: 2,
        execute: (input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            console.log(arg1);
        }
    },
    99: {
        length: 1,
        execute: () => {}
    }
}

function getArgValue(param, paramMode, mem) {
    return paramMode ? param : mem[param];
}