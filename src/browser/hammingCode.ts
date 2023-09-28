import hammingcode from 'hamming-code'
const cache: Map<number, boolean[]> = new Map()
export function getErrorCorrectionCode(input: number) {
	return cache.get(input)!
}

for (let input = 0; input < 2048; input++) {
	const binary = input.toString(2).padStart(11, '0')
	const encoded = hammingcode.encode(binary) as string
	const bitset = encoded.split('').map(s => s === '1')
	const parity = (bitset.filter(s => s).length % 2) !== 0
	bitset.push(parity);
	cache.set(input, bitset)
}