#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char BASE_PATTERN[] = { 0, 1, 0, -1 };

char getPatternVal(long position, long elem) {
	return BASE_PATTERN[(elem / position) % 4];
}

void printArray(char* arr, long length) {
	for (int i = 0; i < length; i++) {
		printf("%d", arr[i]);
	}
	printf("\n");	
}

void fft(char *input, char *output, const long inputLength) {
	for (long pos = 1; pos <= inputLength; pos++) {
		if (pos % 100 == 0) {
			printf("   Pos %ld...\n", pos);
		}
		long sum = 0;
		for (long i = 0; i < inputLength; i++) {
			sum += input[i] * getPatternVal(pos, i + 1);
		}
		output[pos - 1] = abs(sum) % 10;
	}
}

int main() {
	char *inputStr = "03036732577212944063491565474664";

	const int SIGNAL_REPEAT = 10000;
	const int PHASE_COUNT = 100;

	const int inputStrLength = strlen(inputStr);
	const long inputLength = SIGNAL_REPEAT * inputStrLength;
	char inputSignal[inputLength];
    for (int i = 0; i < SIGNAL_REPEAT; i++) {
    	for (int j = 0; j < inputStrLength; j++) {
	    	inputSignal[i * inputStrLength + j] = inputStr[j] - '0';
    	}
    }

    char *currentInput = inputSignal;
    char currentOutput[inputLength];
    char *currentOutputPtr = currentOutput;
    for (int i = 0; i < PHASE_COUNT; i++) {
    	printf("Phase %d...\n", i + 1);
    	fft(currentInput, currentOutputPtr, inputLength);

    	char *tmp = currentInput;
    	currentInput = currentOutputPtr;
    	currentOutputPtr = tmp;

	    printArray(currentInput, inputLength);
    }


	return 0;
}
