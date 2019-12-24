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
    const x0 = 20, y0 = 21;    // Solution for part 1
    // const x0 = 11, y0 = 13;    // Solution for part 1 (test5)
    const pos = keyFor(x0, y0);
    let neighbours = [];
    for (let pos2 of asteroids.keys()) {
        if (pos2 == pos) continue;
        let [neighX, neighY] = coordsFor(pos2);
        neighbours.push({
            distance: Math.hypot((neighX - x0), (neighY - y0)),
            slope: angleClockwise(Math.atan2((y0 - neighY), (neighX -x0))),
            x: neighX,
            y: neighY,
        });
    }
    neighbours.sort((a, b) => a.slope == b.slope ? a.distance - b.distance : a.slope - b.slope);
    let neighboursBySlope = new Map();
    for (let neigh of neighbours) {
        if (!neighboursBySlope.has(neigh.slope)) {
            neighboursBySlope.set(neigh.slope, []);
        }
        neighboursBySlope.get(neigh.slope).push(neigh);
    }

    let destroyIdx = 1;
    for (let [slope, asteroids] of neighboursBySlope) {
        // console.log(destroyIdx, asteroids[0]);
        if (destroyIdx == 200) {
            console.log(asteroids[0]);
            break;
        }
        asteroids.shift();
        if (asteroids.length == 0) {
            neighboursBySlope.delete(slope);
        }
        destroyIdx++;
    }
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

function angleClockwise(r) {
    return (2.5 * Math.PI - (r < 0 ? 2 * Math.PI + r : r)) % (2 * Math.PI);
}