const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

let fuelSum = 0;
rl.on('line', (input) => {
    fuelSum += Math.floor(parseInt(input) / 3) - 2;
}).on('close', () => {
    console.log(fuelSum);
});