import { bn, type Contract } from 'fuels';

import { SnippetProjectEnum } from '../../../projects';
import { createAndDeployContractFromProject } from '../../utils';

describe(__filename, () => {
  let contract: Contract;

  beforeAll(async () => {
    contract = await createAndDeployContractFromProject(SnippetProjectEnum.ECHO_VALUES);
  });

  it('should successfully call contract and echo values', async () => {
    // #region echo-values
    const expected = [48, 63];

    const res1 = await contract.functions.echo_u8_array().simulate();

    expect(res1.value).toMatchObject(expected);
    // #endregion echo-values
  });

  it('should successfully echo u8 array', async () => {
    // #region echo-values
    const expected = [48, 63];

    const res1 = await contract.functions.echo_u8_array_with_value(expected).simulate();

    expect(res1.value).toMatchObject(expected);
    // #endregion echo-values
  });

  it('should echo boolean array', async () => {
    const expected = [true, false];

    const res1 = await contract.functions.echo_boolean_array(expected).simulate();

    expect(res1.value).toMatchObject(expected);
  });

  it('should echo boolean array with value', async () => {
    const expected = [true, false];

    const res1 = await contract.functions.echo_boolean_array_with_value(expected).simulate();

    expect(res1.value).toMatchObject(expected);
  });

  it('echos a mixed array with value', async () => {
    const expected = [73, true];

    const res1 = await contract.functions.echo_mixed_array_with_value(expected).simulate();

    expect(res1.value).toMatchObject(expected);
  });

  it('echos a mixed struct with value', async () => {
    const expected = { a: 73, b: true };

    const res1 = await contract.functions.echo_mixed_struct_with_value(expected).simulate();

    expect(res1.value).toMatchObject(expected);
  });

  it('echos a mixed enum with value', async () => {
    const expectedA = { a: 73 };
    const expectedB = { b: true };

    const res1 = await contract.functions.echo_mixed_enum_with_value(expectedA).simulate();

    expect(res1.value).toMatchObject(expectedA);

    const res2 = await contract.functions.echo_mixed_enum_with_value(expectedB).simulate();

    expect(res2.value).toMatchObject(expectedB);
  });

  it('echos a u8 vector with value', async () => {
    const expected = [73, 23];

    const res1 = await contract.functions.echo_u8_vector_with_value(expected).simulate();

    expect(res1.value).toMatchObject(expected);
  });

  it('echos a u8 vector', async () => {
    const expected = [23, 32, 78];

    const res1 = await contract.functions.echo_u8_vector().simulate();

    expect(res1.value).toMatchObject(expected); // [ 23 ]
  });

  it('echos a u64 vector', async () => {
    const expected = [bn(1337), bn(1448), bn(1559)];

    const res1 = await contract.functions.echo_u64_vector().simulate();

    expect(JSON.stringify(res1.value)).toEqual(JSON.stringify(expected));
  });

  it('echos a u64 struct', async () => {
    const expected = {
      a: true, // .reverse() thing started
      b: bn(1337),
    };

    const res1 = await contract.functions.echo_mixed_struct().simulate();

    expect(JSON.stringify(res1.value)).toEqual(JSON.stringify(expected));
  });

  // it('send and echos a u64 struct', async () => {
  //   const expected = {
  //     a: true,
  //     b: 1,
  //     c: bn(1337),
  //   };

  //   const res1 = await contract.functions.echo_received_mixed_struct(expected).simulate();

  //   console.log({ res1 });

  //   expect(JSON.stringify(res1.value)).toEqual(JSON.stringify(expected));
  // });
});
