/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type {
  Interface,
  FunctionFragment,
  DecodedValue,
  Contract,
  BytesLike,
  BigNumberish,
  InvokeFunction,
  BN,
} from "fuels";

interface BarAbiInterface extends Interface {
  functions: {
    bar: FunctionFragment;
  };

  encodeFunctionData(functionFragment: "bar", values?: undefined): Uint8Array;

  decodeFunctionData(functionFragment: "bar", data: BytesLike): DecodedValue;
}

export class BarAbi extends Contract {
  interface: BarAbiInterface;
  functions: {
    bar: InvokeFunction<[], string>;
  };
}