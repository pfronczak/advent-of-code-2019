console.log(isValidPassword('112233'));
console.log(isValidPassword('123444'));
console.log(isValidPassword('111122'));

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
	let streak = 1;
	for (var i = 1; i < pass.length; i++) {
		let digit = parseInt(pass.charAt(i));
		if (digit < prevDigit) return false;
		if (digit == prevDigit) {
			streak++;
		} else {
			if (streak == 2) hasDouble = true;
			streak = 1;
		}
		prevDigit = digit;
	}
	if (streak == 2) hasDouble = true;
	return hasDouble;
}