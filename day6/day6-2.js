const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin
});

const orbitMap = new Map();

rl.on('line', (input) => {
    [obj1, obj2] = input.split(')').map(getOrCreateNode);
    obj1.children.push(obj2);
    obj2.parent = obj1;
}).on('close', () => {
	const yourPath = pathToRoot(orbitMap.get('YOU'));
	const santasPath = pathToRoot(orbitMap.get('SAN'));
	console.log(yourPath.map(n => n.id), santasPath.map(n => n.id));

	for (var i = yourPath.length - 1; i >= 0; i--) {
		if (yourPath[i].id != santasPath[i - yourPath.length + santasPath.length].id) break;
	}
	let commonAncestorPos = i + 1;
	const transfersFromYou = commonAncestorPos;
	const transfersToSanta = commonAncestorPos + santasPath.length - yourPath.length;
	console.log(transfersFromYou, transfersToSanta, transfersFromYou + transfersToSanta)
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

function pathToRoot(node) {
	const path = [];
	while (node.parent) {
		path.push(node.parent);
		node = node.parent;
	}
	return path;
}