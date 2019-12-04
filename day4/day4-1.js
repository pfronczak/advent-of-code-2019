console.log(isValidPassword('111111'));
console.log(isValidPassword('223450'));
console.log(isValidPassword('123789'));

let count = 0;
for (var i = 138241; i <= 674034; i++) {
	if (isValidPassword(i.toString())) {
		count++;
	}
}
console.log(count);

function isValidPassword(pass) {
	let prevDigit = parseInt(pass.charAt(0));
	let hasDouble = false;
	for (var i = 1; i < pass.length; i++) {
		let digit = parseInt(pass.charAt(i));
		if (digit < prevDigit) return false;
		if (digit == prevDigit) hasDouble = true;
		prevDigit = digit;
	}
	return hasDouble;
}