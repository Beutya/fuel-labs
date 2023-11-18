import { ErrorCode } from '@fuel-ts/errors';
import { concatBytes } from '@fuel-ts/utils';

import { concatWithDynamicData } from '../utilities';

import type { TypesOfCoder } from './abstract-coder';
import { Coder } from './abstract-coder';
import { OptionCoder } from './option';

type InputValueOf<TCoders extends Record<string, Coder>> = {
  [P in keyof TCoders]: TypesOfCoder<TCoders[P]>['Input'];
};
type DecodedValueOf<TCoders extends Record<string, Coder>> = {
  [P in keyof TCoders]: TypesOfCoder<TCoders[P]>['Decoded'];
};

export class StructCoder<TCoders extends Record<string, Coder>> extends Coder<
  InputValueOf<TCoders>,
  DecodedValueOf<TCoders>
> {
  name: string;
  coders: TCoders;

  constructor(name: string, coders: TCoders) {
    const encodedLength = Object.values(coders).reduce(
      (acc, coder) => acc + coder.encodedLength,
      0
    );
    super('struct', `struct ${name}`, encodedLength);
    this.name = name;
    this.coders = coders;
  }

  /**
   * Properties of structs need to be word-aligned.
   * Because some properties can be small bytes,
   * we need to pad them with zeros until they are aligned to a word-sized increment.
   */
  private static rightPadToSwayWordSize(encoded: Uint8Array) {
    return encoded.length % 8 === 0
      ? encoded
      : concatBytes([encoded, new Uint8Array(8 - (encoded.length % 8))]);
  }

  encode(value: InputValueOf<TCoders>) {
    const encodedFields = Object.keys(this.coders).map((fieldName) => {
      const fieldCoder = this.coders[fieldName];
      const fieldValue = value[fieldName];
      if (!(fieldCoder instanceof OptionCoder) && fieldValue == null) {
        this.throwError(
          ErrorCode.ENCODE_ERROR,
          `Invalid ${this.type}. Field "${fieldName}" not present.`
        );
      }
      const encoded = fieldCoder.encode(fieldValue);

      return StructCoder.rightPadToSwayWordSize(encoded);
    });

    return concatWithDynamicData([concatWithDynamicData(encodedFields)]);
  }

  decode(data: Uint8Array, offset: number): [DecodedValueOf<TCoders>, number] {
    let newOffset = offset;
    const decodedValue = Object.keys(this.coders).reduce((obj, fieldName) => {
      const fieldCoder = this.coders[fieldName];
      let decoded;
      [decoded, newOffset] = fieldCoder.decode(data, newOffset);

      // see StructCoder.rightPadToSwayWordSize method for explanation
      const offsetIsSwayWordIncrement = newOffset % 8 === 0;

      if (!offsetIsSwayWordIncrement) {
        newOffset += 8 - (newOffset % 8);
      }

      // eslint-disable-next-line no-param-reassign
      obj[fieldName as keyof DecodedValueOf<TCoders>] = decoded;
      return obj;
    }, {} as DecodedValueOf<TCoders>);

    return [decodedValue, newOffset];
  }
}
