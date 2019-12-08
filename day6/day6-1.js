const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const orbitMap = new Map();
let orbitCount = 0;

rl.on('line', (input) => {
    [obj1, obj2] = input.split(')');
    getOrCreateNode(obj1).children.push(getOrCreateNode(obj2));
}).on('close', () => {
	visit(orbitMap.get('COM'));
	console.log(orbitCount);
	// console.log(orbitMap);
});

function getOrCreateNode(id) {
	if (orbitMap.has(id)) {
		return orbitMap.get(id)
	}
	let node = {
		id,
		children: []
	}
	orbitMap.set(id, node);
	return node;
}

function visit(node, parentDist = -1) {
	node.distance = parentDist + 1;
	orbitCount += node.distance;
	for (child of node.children) {
		visit(child, node.distance);
	}
}