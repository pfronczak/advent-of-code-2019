const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

let fuelSum = 0;
rl.on('line', (input) => {
    let fuelForModule = fuelForMass(parseInt(input));
    // console.log(fuelForModule);
    for (let addedFuel = fuelForMass(fuelForModule); addedFuel >= 0; addedFuel = fuelForMass(addedFuel)) {
        fuelForModule += addedFuel;
        // console.log(addedFuel, fuelForModule);
    }
    fuelSum += fuelForModule;
}).on('close', () => {
    console.log(fuelSum);
});

function fuelForMass(m) {
    return Math.floor(m / 3) - 2;
}