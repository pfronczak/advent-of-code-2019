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
    for (let perm of getPermutations([5, 6, 7, 8, 9])) {
        lastOutput = 0;

        const amps = [];
        for (let i = 0; i < 5; i++) {
            let amp = new Computer(code.slice());
            amp.input.push(perm[i]);
            amps.push(amp);
        }

        do {
            for (let i = 0; i < 5; i++) {
                amps[i].input.push(lastOutput);
                amps[i].run();
            }
        } while (!amps[4].done);

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

class Computer {
    constructor(mem) {
        this.ip = 0;
        this.input = [];
        this.done = false;
        this.mem = mem;
    }

    run() {
        let opcode;
        do {
            let instrCode = this.mem[this.ip];
            opcode = instrCode % 100;
            let instruction = instructions[opcode];
            if (instruction) {
                const paramModes = [2, 3, 4].map(pow => Math.floor(instrCode / Math.pow(10, pow)) % 10);
                this.ip = instruction.execute(this.ip, this.input, this.mem.slice(this.ip + 1, this.ip + instruction.length), paramModes, this.mem);
            } else {
                throw new Error('Invalid op: ' + opcode);
            }
        } while (opcode != 99 && opcode != 4);
        if (opcode == 99) {
            this.done = true;
        }
    }
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