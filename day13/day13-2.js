const readline = require('readline');
const Computer = require('../day11/computer.js');

const rl = readline.createInterface({
    input: process.stdin
});

const screenGrid = new Map();
let score = 0;

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    let mem = code.slice();
    mem[0] = 2;
    let outputCount = 0;
    let x, y;
    let ballX, paddleX;
    let computer = new Computer(
        mem,
        () => {
            printGrid(screenGrid);                
            process.stdout.write(`Score: ${score}\n`);
            process.stdout.moveCursor(0, -25);

            if (ballX < paddleX) return -1;
            if (ballX > paddleX) return 1;
            return 0;
        },
        (val) => {
            switch (outputCount % 3) {
                case 0:
                    x = val;
                    break;
                case 1:
                    y = val;
                    break;
                case 2:
                    if (x == -1 && y == 0) score = val;
                    else {
                        screenGrid.set(`${x},${y}`, val);
                        if (val == 4) {
                            ballX = x;
                        }
                        if (val == 3) {
                            paddleX = x;
                        }
                    }
                    break;
            }
            outputCount++;
        }
    );
    computer.run();
    process.stdout.moveCursor(0, 25);
    console.log(`Final Score: ${score}\n`);
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