import { ErrorCode } from '@fuel-ts/errors';
import { toNumber, toBytes } from '@fuel-ts/math';

import { Coder } from './abstract-coder';

type NumberCoderType = 'u8' | 'u16' | 'u32';

export class NumberCoder extends Coder<number, number> {
  // This is to align the bits to the total bytes
  // See https://github.com/FuelLabs/fuel-specs/blob/master/specs/protocol/abi.md#unsigned-integers
  length: number;
  paddingLength: number;
  baseType: NumberCoderType;

  constructor(baseType: NumberCoderType, isArray = false) {
    const paddingLength = isArray ? 1 : 8;

    super('number', baseType, paddingLength);
    this.baseType = baseType;
    switch (baseType) {
      case 'u8':
        this.length = 1;
        break;
      case 'u16':
        this.length = 2;
        break;
      case 'u32':
      default:
        this.length = 4;
        break;
    }

    this.paddingLength = paddingLength;
  }

  encode(value: number | string): Uint8Array {
    let bytes;

    try {
      bytes = toBytes(value);
    } catch (error) {
      this.throwError(ErrorCode.ENCODE_ERROR, `Invalid ${this.baseType}.`);
    }

    if (bytes.length > this.length) {
      this.throwError(ErrorCode.ENCODE_ERROR, `Invalid ${this.baseType}, too many bytes.`);
    }

    return toBytes(bytes, this.paddingLength);
  }

  decode(data: Uint8Array, offset: number): [number, number] {
    let bytes = data.slice(offset, offset + this.paddingLength);
    bytes = bytes.slice(this.paddingLength - this.length, this.paddingLength);

    return [toNumber(bytes), offset + this.paddingLength];
  }
}
