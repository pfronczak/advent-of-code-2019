const readline = require('readline');
const Computer = require('./computer.js');

const rl = readline.createInterface({
    input: process.stdin
});

const paintedGrid = new Map();

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    let x = 0, y = 0, dir = 0;
    let paint = true;
    let computer = new Computer(
        code.slice(),
        () => onInput(`${x},${y}`),
        (val) => {
            if (paint) {
                paintedGrid.set(`${x},${y}`, val);
                paint = false;
            } else {
                if (val == 1) {
                    dir = (dir + 1) % 4;
                } else if (val == 0) {
                    dir = (dir + 4 - 1) % 4;
                }
                [x, y] = move[dir](x, y);
                paint = true;
            }
        }
    );
    paintedGrid.set(`${x},${y}`, 1);
    computer.run();
    console.log(paintedGrid.size);
    printGrid(paintedGrid);
});

function onInput(currentPos) {
    if (paintedGrid.has(currentPos)) {
        return paintedGrid.get(currentPos);
    }
    return 0;
}

const move = {
    0: (x,y) => [ x, y - 1 ],
    1: (x,y) => [ x + 1, y ],
    2: (x,y) => [ x, y + 1 ],
    3: (x,y) => [ x - 1, y ],
}

function printGrid(grid) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (pos of grid.keys()) {
        let [x, y] = pos.split(',').map(n => parseInt(n));
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (grid.has(`${x},${y}`) && grid.get(`${x},${y}`) == 1) {
                process.stdout.write('#');
            } else {
                process.stdout.write(' ');
            }
        }
        process.stdout.write('\n');
    }
}