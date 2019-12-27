const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const STEPS = 1000;
const moons = [];

rl.on('line', (input) => {
    let [, x, y, z] = input.match(/<x=(.*), y=(.*), z=(.*)>/).map(Number);
    moons.push({
        x, y, z,
        vx: 0, vy: 0, vz: 0
    })
}).on('close', () => {
    console.log(moons);
    for (let i = 1; i <= STEPS; i++) {
        simulate(moons);
        // console.log(`Step ${i}:`);
        // console.log(moons);
    }
    console.log(moons);
    console.log(totalEnergy(moons));
});

function simulate(moons) {
    // gravity
    for (let i = 0; i < moons.length - 1; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            for (let axis of ['x', 'y', 'z']) {
                if (moons[i][axis] > moons[j][axis]) {
                    moons[i]['v' + axis] -= 1;
                    moons[j]['v' + axis] += 1;
                } else if (moons[i][axis] < moons[j][axis]) {
                    moons[i]['v' + axis] += 1;
                    moons[j]['v' + axis] -= 1;
                }
            }
        }
    }
    // apply velocity
    for (let moon of moons) {
        for (let axis of ['x', 'y', 'z']) {
            moon[axis] += moon['v' + axis];
        }
    }
}

function totalEnergy(moons) {
    return moons.reduce((total, moon) =>
        total + ((Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z))
        * (Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz)))
    , 0)
}