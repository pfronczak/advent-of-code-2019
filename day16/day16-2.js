const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const SIGNAL_REPEAT = 10000;
const PHASE_COUNT = 100;

let inputStr = '';
rl.on('line', (input) => {
    inputStr += input;
}).on('close', () => {
    const inputPart = inputStr.split('').map(c => parseInt(c));
    let inputSignal = [];
    for (let i = 0; i < SIGNAL_REPEAT; i++) {
    	inputSignal = inputSignal.concat(inputPart);
    }

    for (let i = 0; i < PHASE_COUNT; i++) {
    	console.log(`Phase ${(i + 1)}...`);
    	inputSignal = fft(inputSignal);
    	// console.log(inputSignal.join(''));
    }
    console.log(inputSignal.slice(0, 8).join(''));
});

function fft(input) {
	let result = [];
	for (let pos = 1; pos <= input.length; pos++) {
		if (pos % 100 == 0) console.log(`   Pos ${(pos)}...`);
		let sum = 0;
		for (let i = 0; i < input.length; i++) {
			sum += input[i] * getPatternVal(pos, i + 1);
		}
		result.push(Math.abs(sum) % 10);
	}
	return result;
}

const BASE_PATTERN = [0, 1, 0, -1];

function getPattern(position) {
	let result = [];
	for (let val of BASE_PATTERN) {
		for (let i = 0; i < position; i++) {
			result.push(val);
		}
	}
	return result;
}

function getPatternVal(position, elem) {
	return BASE_PATTERN[Math.floor(elem / position) % 4];
}