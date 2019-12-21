module.exports = class Computer {
    constructor(mem) {
        this.ip = 0;
        this.relativeBase = 0;
        this.input = [];
        this.output = [];
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
                this.ip = instruction.execute(this, this.mem.slice(this.ip + 1, this.ip + instruction.length), paramModes);
            } else {
                throw new Error(`Invalid op: ${opcode}`);
            }
        } while (opcode != 99);
        if (opcode == 99) {
            this.done = true;
        }
    }
}

const instructions = {
    1: {    // add
        length: 4,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            setMemValue(params[2], paramModes[2], arg1 + arg2, computer);
            return computer.ip + 4;
        }
    },
    2: {    // multiply
        length: 4,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            setMemValue(params[2], paramModes[2], arg1 * arg2, computer);
            return computer.ip + 4;
        }
    },
    3: {    // input
        length: 2,
        execute: (computer, params, paramModes) => {
            setMemValue(params[0], paramModes[0], computer.input.shift(), computer);
            return computer.ip + 2;
        }
    },
    4: {    // output
        length: 2,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            // console.log(arg1);
            computer.output.push(arg1);
            return computer.ip + 2;
        }
    },
    5: {    // jump-if-true
        length: 3,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            return arg1 != 0 ? arg2 : computer.ip + 3;
        }
    },
    6: {    // jump-if-false
        length: 3,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            return arg1 == 0 ? arg2 : computer.ip + 3;
        }
    },
    7: {    // less-than
        length: 4,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            setMemValue(params[2], paramModes[2], arg1 < arg2 ? 1 : 0, computer);
            return computer.ip + 4;
        }
    },
    8: {    // equals
        length: 4,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            let arg2 = getArgValue(params[1], paramModes[1], computer);
            setMemValue(params[2], paramModes[2], arg1 == arg2 ? 1 : 0, computer);
            return computer.ip + 4;
        }
    },
    9: {    // relative base offset
        length: 2,
        execute: (computer, params, paramModes) => {
            let arg1 = getArgValue(params[0], paramModes[0], computer);
            computer.relativeBase += arg1;
            return computer.ip + 2;
        }
    },
    99: {
        length: 1,
        execute: (computer) => computer.ip + 1
    }
}

function getArgValue(param, paramMode, { mem, relativeBase }) {
    if (paramMode == 0) {   // position mode
        return mem[param] || 0;
    } else if (paramMode == 1) {    // immediate mode
        return param;
    } else if (paramMode == 2) {    // relative mode
        return mem[relativeBase + param] || 0;
    } else {
        throw new Error(`Invalid parameter mode: ${paramMode}`);
    }
    return null;
}

function setMemValue(param, paramMode, value, { mem, relativeBase }) {
    if (paramMode == 0) {
        mem[param] = value;
    } else if (paramMode == 2) {
        mem[param + relativeBase] = value;                
    }
}