const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});


let lastOutput;

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));

    let maxOutput = 0;
    let maxPerm;
    for (let perm of getPermutations([0, 1, 2, 3, 4])) {
        lastOutput = 0;
        for (let i = 0; i < 5; i++) {
            run(code.slice(), [perm[i], lastOutput]);
        }
        if (lastOutput > maxOutput) {
            maxOutput = lastOutput;
            maxPerm = perm;
        }
    }
    console.log(maxOutput, maxPerm);
});

function getPermutations(items) {
    const result = [];
    if (items.length == 1) {
        result.push([ items[0] ]);
        return result;
    }
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        subPerms = getPermutations([...items.slice(0, i), ...items.slice(i + 1)]);
        for (perm of subPerms) {
            result.push([ item, ...perm ]);
        }
    }
    return result;
}

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
            mem[params[0]] = input.shift();
            return ip + 2;
        }
    },
    4: {    // output
        length: 2,
        execute: (ip, input, params, paramModes, mem) => {
            let arg1 = getArgValue(params[0], paramModes[0], mem);
            // console.log(arg1);
            lastOutput = arg1;
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