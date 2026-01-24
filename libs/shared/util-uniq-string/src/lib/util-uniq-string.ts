import {customAlphabet} from "nanoid";

export function injectUniqStringGenerator() {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    return customAlphabet(alphabet, 15);
}
