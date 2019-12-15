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
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            for (let l = 0; l < image.length; l++) {
                if (image[l][y][x] != 2) {
                    if (image[l][y][x] == 0) {
                        process.stdout.write(' ');    
                    } else {
                        process.stdout.write('#');
                    }
                    break;
                }
            }
        }
        process.stdout.write('\n');
    }
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
