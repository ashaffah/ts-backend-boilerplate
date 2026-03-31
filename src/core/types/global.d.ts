/** Prevent BigInt serialization issues
 *  ref:
 *  https://stackoverflow.com/a/78681416/13030162
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 */
/**
 * Extends the global `BigInt` interface to include a `toJSON` method.
 *
 * The `toJSON` method allows `BigInt` values to be serialized to JSON by converting them to a `number`.
 * Note: This may result in loss of precision for large `BigInt` values that exceed the safe integer range.
 */
declare global {
  interface BigInt {
    toJSON(): number;
  }
}

export {};
