import { quadgrams } from "./Quadgrams";
import { FastString } from "../utils/FastString";
import { Alphabet } from "../utils/Alphabet";

/**
 * Decodes the given string with the given alphabet.
 *
 * @param encoded    The encoded string to decode.
 * @return alphabet  The alphabet to use for decoding.
 * @return The decoded string.
 */
function decode(encoded: string, alphabet: number[]): string {
    let decoded = "";
    for (let i = 0, len = encoded.length; i !== len; ++i) {
        const code = encoded.charCodeAt(i);
        if (code > 96 && code < 123) {
            decoded += String.fromCharCode(alphabet[code - 97 + 1] + 96);
        } else if (code > 64 && code < 91) {
            decoded += String.fromCharCode(alphabet[code - 65 + 1] + 64);
        } else {
            decoded += String.fromCharCode(code);
        }
    }
    return decoded;
}

export function crack(encoded: string): void {
    let alphabet = Alphabet.createRandom();
    let fastEncoded = FastString.fromString(encoded);
    const decoded = fastEncoded.substitute(alphabet, new FastString());
    let score = quadgrams.getScore(decoded);
    let bestScore = score;
    const fudgeFactor = 0.2 * fastEncoded.length;
    const initialDivisor = 1;
    const divisorIncrement = 1;
    let tries = 0;
    const maxTries = 50000;
    const cycles = 50;
    let newAlphabet = new Alphabet();
    while (tries < maxTries) {
        let divisor = initialDivisor;
        alphabet.clone(newAlphabet);
        for (let cycle = 0; cycle !== cycles; ++cycle) {
            ++tries;
            let a = 1 + Math.round(Math.random() * 25);
            let b = 1 + Math.round(Math.random() * 25);
            newAlphabet.swap(a, b);
            const newScore = quadgrams.getScore(fastEncoded.substitute(newAlphabet, decoded));
            if (newScore > bestScore) {
                bestScore = newScore;
                console.log(newScore, decode(encoded, newAlphabet),
                    newAlphabet.toString(),
                    newAlphabet.clone().invert().toString());
            }
            if (newScore > score - (fudgeFactor / divisor)) {
                score = newScore;
                newAlphabet.clone(alphabet);
            } else {
                newAlphabet.swap(a, b);
            }
            divisor += divisorIncrement;
        }
    }
}
