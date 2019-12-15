const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const WIDTH = 25, HEIGHT = 6;

let imageStr = '';
rl.on('line', (input) => {
    imageStr += input;
}).on('close', () => {
    const image = fillImage(imageStr);
    let minZeroes = Infinity;
    let minZeroesLayer;
    for (const layer of image) {
        let zeroesCount = 0;
        for (const row of layer) {
            for (const digit of row) {
                if (digit == 0) zeroesCount++;
            }
        }
        if (zeroesCount < minZeroes) {
            minZeroes = zeroesCount;
            minZeroesLayer = layer;
        }
    }
    console.log(minZeroesLayer);
    let onesCount = 0, twosCount = 0;
    for (const row of minZeroesLayer) {
        for (const digit of row) {
            if (digit == 1) onesCount++;
            if (digit == 2) twosCount++;
        }
    }
    console.log(onesCount, twosCount, onesCount * twosCount);
});

function fillImage(imageStr) {
    let result = [];
    let layer = [];
    let row = [];
    layer.push(row);
    result.push(layer);
    let x = 0, y = 0;
    for (const digit of imageStr) {
        if (x == WIDTH) {
            row = [];
            x = 0;
            y++;
            if (y == HEIGHT) {
                y = 0;
                layer = [];
                result.push(layer);
            }
            layer.push(row);
        }
        row.push(parseInt(digit));
        x++;
    }
    return result;
}
