const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const wires = [];
rl.on('line', (input) => {
    wires.push(input.split(','));
}).on('close', () => {
    const grid = new Map();
    followWire(wires[0], grid);
    const crosses = followWire(wires[1], grid);

    let minDist = Infinity;
    let minDistCross;
    for (let cross of crosses) {
        let dist = manhattanDist(cross, '0,0');
        if (dist > 0 && dist < minDist) {
            minDist = dist;
            minDistCross = cross;
        }
    }
    console.log(minDistCross, minDist);
});

function followWire(wire, grid) {
    const crosses = [];
    let x = 0, y = 0;
    for (let segment of wire) {
        let dir = segment.charAt(0);
        let count = parseInt(segment.substring(1));
        for (let i = 0; i < count; i++) {
            let key = `${x},${y}`;
            if (grid.has(key)) {
                crosses.push(key);
            }
            grid.set(key, true);
            [x, y] = move[dir](x, y);
        }
    }
    return crosses;
}

const move = {
    U: (x,y) => [ x, y - 1 ],
    D: (x,y) => [ x, y + 1 ],
    L: (x,y) => [ x - 1, y ],
    R: (x,y) => [ x + 1, y ],
}

function manhattanDist(a, b) {
    const [ ax, ay ] = a.split(',');
    const [ bx, by ] = b.split(',');
    return Math.abs(bx - ax) + Math.abs(by - ay);
}