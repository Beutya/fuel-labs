/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import { Interface, Contract } from "fuels";
import type { FooAbi, FooAbiInterface } from "../FooAbi";
const _abi = [
  {
    type: "function",
    name: "foo",
    inputs: [],
    outputs: [
      {
        type: "u64",
        name: "",
      },
    ],
  },
];

export class FooAbi__factory {
  static readonly abi = _abi;
  static createInterface(): FooAbiInterface {
    return new Interface(_abi) as unknown as FooAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): FooAbi {
    return new Contract(id, _abi, walletOrProvider) as unknown as FooAbi;
  }
}