const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const asteroids = new Map();

let x = 0, y = 0;
rl.on('line', (input) => {
    x = 0;
    for (let char of input) {
        if (char === '#') asteroids.set(keyFor(x, y), char);
        x++;
    }
    y++;
}).on('close', () => {
    // console.log(asteroids);
    let maxDetected = 0;
    let bestX, bestY;
    for (let pos of asteroids.keys()) {
        let [x0, y0] = coordsFor(pos);
        let neighbours = [];
        for (let pos2 of asteroids.keys()) {
            if (pos2 == pos) continue;
            let [neighX, neighY] = coordsFor(pos2);
            neighbours.push({
                distance: Math.hypot((neighX - x0), (neighY - y0)),
                slope: Math.atan2((neighY - y0), (neighX -x0))
            });
        }
        neighbours.sort((a, b) => a.distance - b.distance);
        let seenSlopes = new Set();
        for (let neigh of neighbours) {
            if (!seenSlopes.has(neigh.slope)) {
                seenSlopes.add(neigh.slope);
            }
        }
        if (seenSlopes.size > maxDetected) {
            maxDetected = seenSlopes.size;
            bestX = x0;
            bestY = y0;
        }
    }
    console.log(bestX, bestY, maxDetected);
});

function keyFor(x, y) {
    return y * 1000 + x;
}

function coordsFor(key) {
    return [
        key % 1000,
        Math.floor(key / 1000)
    ];
}