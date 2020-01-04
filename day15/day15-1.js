const readline = require('readline');
const Computer = require('../day11/computer.js');

const rl = readline.createInterface({
    input: process.stdin
});

const mapGrid = new Map();

let codeStr = '';
rl.on('line', (input) => {
    codeStr += input;
}).on('close', () => {
    const code = codeStr.split(',').map(c => parseInt(c));
    let x = 0, y = 0;
    let moveDir;
    let computer = new Computer(
        code.slice(),
        () => {
            moveDir = Math.floor(Math.random() * 4) + 1;
            return moveDir;
        },
        (val) => {
            switch (val) {
                case 0:
                    let [wallX, wallY] = move[moveDir](x, y);
                    mapGrid.set(`${wallX},${wallY}`, val);
                    // printGrid(mapGrid, x, y);
                    break;
                case 1:
                    [x, y] = move[moveDir](x, y);
                    mapGrid.set(`${x},${y}`, val);
                    // printGrid(mapGrid, x, y);
                    break;
                case 2:
                    [x, y] = move[moveDir](x, y);
                    mapGrid.set(`${x},${y}`, val);
                    console.log('Found!');
                    printGrid(mapGrid, x, y);
                    console.log(findDistance(mapGrid, 0, 0, x, y));
                    process.exit();
                    break;
            }
        }
    );
    computer.run();
});

function findDistance(grid, fromX, fromY, toX, toY) {
    let distance = new Map();
    let queue = [];
    let visited = new Set();

    distance.set(`${fromX},${fromY}`, 0);
    queue.push(`${fromX},${fromY}`);
    while (queue.length > 0) {
        let node = queue.pop();
        if (node == `${toX},${toY}`) {
            return distance.get(node);
        }
        visited.add(node);
        let currentDist = distance.get(node);
        [1, 2, 3, 4]
            .map(dir => move[dir](...node.split(',').map(Number)))
            .filter(([ x, y ]) => grid.has(`${x},${y}`) && (grid.get(`${x},${y}`) == 1 || grid.get(`${x},${y}`) == 2))
            .forEach(([ neighX, neighY ]) => {
                let neighNode = `${neighX},${neighY}`;
                if (!distance.has(neighNode) || distance.get(neighNode) > currentDist + 1) {
                    distance.set(neighNode, currentDist + 1)
                }
                if (!visited.has(neighNode)) {
                    queue.push(neighNode);
                }
            })
    }
}

const move = {
    1: (x,y) => [ x, y - 1 ],
    2: (x,y) => [ x, y + 1 ],
    3: (x,y) => [ x - 1, y ],
    4: (x,y) => [ x + 1, y ],
}

function printGrid(grid, droidX, droidY) {
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
            if (x == droidX && y == droidY) {
                process.stdout.write('D');
            } else if (grid.has(`${x},${y}`)) {
                let char = charForTile[grid.get(`${x},${y}`)];
                if (x == 0 && y == 0) {
                    process.stdout.write(`\x1b[36m${char}\x1b[0m`);
                } else {
                    process.stdout.write(char);
                }
            } else {
                process.stdout.write(' ');
            }
        }
        process.stdout.write('\n');
    }
}

const charForTile = [ '#', '.', 'X' ];