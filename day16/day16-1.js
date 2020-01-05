const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const PHASE_COUNT = 100;

let inputStr = '';
rl.on('line', (input) => {
    inputStr += input;
}).on('close', () => {
    let inputSignal = inputStr.split('').map(c => parseInt(c));

    for (let i = 0; i < PHASE_COUNT; i++) {
    	inputSignal = fft(inputSignal);
    	console.log(inputSignal.join(''));
    }
    console.log(inputSignal.slice(0, 8).join(''));
});

function fft(input) {
	let result = [];
	for (let pos = 1; pos <= input.length; pos++) {
		const pattern = getPattern(pos);
		let sum = 0;
		for (let i = 0; i < input.length; i++) {
			sum += input[i] * pattern[(i + 1) % pattern.length];
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