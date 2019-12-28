const readline = require('readline');
const Computer = require('../day11/computer.js');

const rl = readline.createInterface({
    input: process.stdin
});

const screenGrid = new Map();

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    let outputCount = 0;
    let x, y;
    let computer = new Computer(
        code.slice(),
        () => {},
        (val) => {
            switch (outputCount % 3) {
                case 0:
                    x = val;
                    break;
                case 1:
                    y = val;
                    break;
                case 2:
                    screenGrid.set(`${x},${y}`, val);
                    break;
            }
            outputCount++;
        }
    );
    computer.run();
    printGrid(screenGrid);
    console.log(Array.from(screenGrid.values()).filter(tile => tile == 2).length);
});

function printGrid(grid) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (pos of grid.keys()) {
        let [x, y] = pos.split(',').map(Number);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (grid.has(`${x},${y}`)) {
                process.stdout.write(charForTile[grid.get(`${x},${y}`)]);
            } else {
                process.stdout.write(' ');
            }
        }
        process.stdout.write('\n');
    }
}

const charForTile = [ ' ', 'x', '#', '_', 'o' ];