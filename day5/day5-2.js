const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const INPUT = 5;

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    run(code, INPUT);
});


function run(mem, input) {
    let ip = 0;
    let opcode;
    do {
        let instrCode = mem[ip];
        opcode = instrCode % 100;
        let instruction = instructions[opcode];
        if (instruction) {
            const paramModes = [2, 3, 4].map(pow => Math.floor(instrCode / Math.pow(10, pow)) % 10);
            ip = instruction.execute(ip, input, mem.slice(ip + 1, ip + instruction.length), paramModes, mem);
        } else {
            throw new Error('Invalid op: ' + opcode);
        }
    } while (opcode != 99);
}

const instructions = {
    1: {    // add
        length: 4,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 + arg2;
            return ip + 4;
        }
    },
    2: {    // multiply
        length: 4,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 * arg2;
            return ip + 4;
        }
    },
    3: {    // input
        length: 2,
        execute: (ip, input, params, paramModes, mem) => {
            mem[params[0]] = input;
            return ip + 2;
        }
    },
    4: {    // output
        length: 2,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            console.log(arg1);
            return ip + 2;
        }
    },
    5: {    // jump-if-true
        length: 3,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            return arg1 != 0 ? arg2 : ip + 3;
        }
    },
    6: {    // jump-if-false
        length: 3,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            return arg1 == 0 ? arg2 : ip + 3;
        }
    },
    7: {    // less-than
        length: 4,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 < arg2 ? 1 : 0;
            return ip + 4;
        }
    },
    8: {    // equals
        length: 4,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            let arg2 = getArgValue(params[1], paramModes[1], mem);
            mem[params[2]] = arg1 == arg2 ? 1 : 0;
            return ip + 4;
        }
    },
    99: {
        length: 1,
        execute: (ip) => ip + 1
    }
}

function getArgValue(param, paramMode, mem) {
    return paramMode ? param : mem[param];
}

// Tests:
console.log('--tests--');
run([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8);   // 1
run([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 9);   // 0
run([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 0); // 0
run([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 5); // 1
console.log('--tests end--');
