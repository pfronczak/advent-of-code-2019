const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const reactions = new Map();
const oreCapacity = 1000000000000;

rl.on('line', (line) => {
    let [, inputsStr, qty, output] = line.match(/(.*) => (\d+) (\w+)/);
    let inputs = inputsStr.split(', ').map(inputQty => {
        let [, qty, input] = inputQty.match(/(\d+) (\w+)/);
        return {
            qty: parseInt(qty),
            input
        }
    });
    reactions.set(output, {
        outputQty: parseInt(qty),
        inputs
    })
}).on('close', () => {
    console.log(reactions);
    let storage = new Map();
    let orePerFuel = requiredOreFor(1, 'FUEL', storage);
    console.log(orePerFuel);
    let oreRequired = 0;
    let fuelAmount = Math.floor(oreCapacity / orePerFuel);
    let lastGoodFuelAmount;
    while (oreRequired < oreCapacity) {
        storage.clear();
        oreRequired = requiredOreFor(fuelAmount, 'FUEL', storage);
        console.log(fuelAmount, oreRequired);
        if (oreRequired < oreCapacity) lastGoodFuelAmount = fuelAmount;
        fuelAmount += 1000;
    }
    fuelAmount = lastGoodFuelAmount;
    oreRequired = 0;
    while (oreRequired < oreCapacity) {
        storage.clear();
        oreRequired = requiredOreFor(fuelAmount, 'FUEL', storage);
        console.log(fuelAmount, oreRequired);
        if (oreRequired < oreCapacity) lastGoodFuelAmount = fuelAmount;
        fuelAmount++;
    }
    console.log(lastGoodFuelAmount);
});

function requiredOreFor(qty, output, storage) {
    if (storage.has(output)) {
        let requestedQty = qty;
        qty -= storage.get(output);
        storage.set(output, storage.get(output) - requestedQty);
        if (storage.get(output) <= 0) storage.delete(output);
        if (qty <= 0) return 0;
    }
    if (output == 'ORE') {
        return qty;
    }
    let reaction = reactions.get(output);

    let outputMultiplier = Math.ceil(qty / reaction.outputQty);
    let requiredOre = 
        reaction.inputs.reduce((sum, input) => 
            sum + requiredOreFor(outputMultiplier * input.qty, input.input, storage)
        , 0);

    let producedOutput = outputMultiplier * reaction.outputQty;
    if (producedOutput > qty) {
        if (!storage.has(output)) {
            storage.set(output, 0);
        }
        storage.set(output, storage.get(output) + producedOutput - qty);
    }
    return requiredOre;
}