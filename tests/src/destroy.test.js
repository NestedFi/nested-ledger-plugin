import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, nano_models, resolveTxFromData, signTransaction } from './test.fixture';

const contractAddr = "0x9a065e500cdcd01c0a506b0eb1a8b060b0ce1379";

nano_models.forEach(function (model) {
  test('[Nano ' + model.letter + '] Enzo destroy', zemu(model, async (sim, eth) => {
    const data = "0xbba9b10c000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c700000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000007800000000000000000000000000000000000000000000000000000000000000e8000000000000000000000000000000000000000000000000000000000000015805a65726f4578000000000000000000000000000000000000000000000000000000000000000000000000000060781c2586d68229fde47564546784ab3faca9820000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000068000000000000000000000000060781c2586d68229fde47564546784ab3faca982000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b000000000000000000000000060781c2586d68229fde47564546784ab3faca982000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c700000000000000000000000000000000000000000000000008dc80f04ac7d40700000000000000000000000000000000000000000000000000055e5b90c6c13b00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060781c2586d68229fde47564546784ab3faca982000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000008dc80f04ac7d407000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000025375736869537761700000000000000000000000000000000000000000000000000000000000000008dc80f04ac7d40700000000000000000000000000000000000000000000000000055e5b90c6c13b000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000060781c2586d68229fde47564546784ab3faca982000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000060781c2586d68229fde47564546784ab3faca982000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000212f9ecee86238403b0000000000000000000000000000000000000000000000005a65726f457800000000000000000000000000000000000000000000000000000000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000006800000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b00000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000410124ca918e0c10000000000000000000000000000000000000000000000000000a23dcd2af99e800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000410124ca918e0c10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000025472616465724a6f6500000000000000000000000000000000000000000000000000000000000000410124ca918e0c10000000000000000000000000000000000000000000000000000a23dcd2af99e8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000060ae616a2155ee3d9a68541ba4544862310933d4000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000008729438eb15e2c8b576fcc6aecda6a148776c0f5000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000d2a89956246238403b0000000000000000000000000000000000000000000000005a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d96000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000680000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d960000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b0000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d960000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000050a89deca239000000000000000000000000000000000000000000000000000511a5fd7545ba00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d960000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000050a89deca239000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000025472616465724a6f6500000000000000000000000000000000000000000000000000000000000000000050a89deca239000000000000000000000000000000000000000000000000000511a5fd7545ba000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000060ae616a2155ee3d9a68541ba4544862310933d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d960000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d6070ae98b8069de6b494332d1a1a81b6179d960000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000005cdae853eb6238403b000000000000000000000000000000000000000000000000466c617400000000000000000000000000000000000000000000000000000000000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c700000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000040000000000000000000000000b31f66aa3c1e785363f0875a1b74e27b85fd66c70000000000000000000000000000000000000000000000000005639d50a6d398";
    const [resolution, serializedTx] = await resolveTxFromData(data, contractAddr);
    const tx = signTransaction(serializedTx, resolution, eth.signTransaction)

    const right_clicks = model.letter === 'S' ? 7 : 5;

    // Wait for the application to actually load and parse the transaction
    await waitForAppScreen(sim);
    await sim.navigateAndCompareSnapshots('.', model.name + '_enzo_destroy', [right_clicks, 0]);
    await tx;
  }));
});

// https://polygonscan.com/tx/0x4b1f3fa2eebc0250e6e81d67c37562c4431cf177181b5e9787905124d1952df1
nano_models.forEach(function (model) {
  test('[Nano ' + model.letter + '] Glenn destroy', zemu(model, async (sim, eth) => {
    const data = "0xbba9b10c00000000000000000000000000000000000000000000000000000000000000720000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000015a00000000000000000000000000000000000000000000000000000000000001ca05a65726f457800000000000000000000000000000000000000000000000000000000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f619000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000006800000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f6190000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b00000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f6190000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000065e5e7ee3311000000000000000000000000000000000000000000000000035d52928100927600000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f6190000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000065e5e7ee331100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e6973776170563300000000000000000000000000000000000000000000000000000000000000000065e5e7ee3311000000000000000000000000000000000000000000000000035d529281009276000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002b7ceb23fd6bc0add59e62ac25578270cff1b9f6190001f40d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f619000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000b4f9765b34625315900000000000000000000000000000000000000000000000005a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000172370d5cd63279efa6d502dab29171933a610af00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000680000000000000000000000000172370d5cd63279efa6d502dab29171933a610af0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b0000000000000000000000000172370d5cd63279efa6d502dab29171933a610af0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000001be2f5a282e591900000000000000000000000000000000000000000000000002d71c28d9459f2e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000172370d5cd63279efa6d502dab29171933a610af0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000001be2f5a282e5919000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000024170655377617000000000000000000000000000000000000000000000000000000000000000000001be2f5a282e591900000000000000000000000000000000000000000000000002d71c28d9459f2e000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000c0788a3ad43d79aa53b09c2eacc313a787d1d60700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000172370d5cd63279efa6d502dab29171933a610af0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000172370d5cd63279efa6d502dab29171933a610af000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000f2cd7a5f316253158f0000000000000000000000000000000000000000000000005a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc1300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000680000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc130000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b0000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc130000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000009888c3241a955000000000000000000000000000000000000000000000000056408fed3a29e8e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc130000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000009888c3241a95500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000002517569636b53776170000000000000000000000000000000000000000000000000000000000000000009888c3241a955000000000000000000000000000000000000000000000000056408fed3a29e8e000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ff00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc130000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000831753dd7087cac61ab5644b308642cc1c33dc13000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000f5cc761b156253158f0000000000000000000000000000000000000000000000005a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000b33eaad8d922b1083446dc23f610c2567fb5180f00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000680000000000000000000000000b33eaad8d922b1083446dc23f610c2567fb5180f0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b0000000000000000000000000b33eaad8d922b1083446dc23f610c2567fb5180f0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000007b0077ad69afb8000000000000000000000000000000000000000000000000033a4c363453277500000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b33eaad8d922b1083446dc23f610c2567fb5180f0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000007b0077ad69afb800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e6973776170563300000000000000000000000000000000000000000000000000000000000000007b0077ad69afb8000000000000000000000000000000000000000000000000033a4c3634532775000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002bb33eaad8d922b1083446dc23f610c2567fb5180f000bb80d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b33eaad8d922b1083446dc23f610c2567fb5180f000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000007949d3cc9c6253158f0000000000000000000000000000000000000000000000005a65726f457800000000000000000000000000000000000000000000000000000000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000006800000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b00000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000004d19fdf1245ac24000000000000000000000000000000000000000000000000014156fb9670bae600000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000004d19fdf1245ac2400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000002517569636b537761700000000000000000000000000000000000000000000000000000000000000004d19fdf1245ac24000000000000000000000000000000000000000000000000014156fb9670bae6000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ff000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e0000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000005b4cf2c120a9702225814e18543ee658c5f8631e000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000cdbdc9432e6253158f000000000000000000000000000000000000000000000000";
    const [resolution, serializedTx] = await resolveTxFromData(data, contractAddr);
    const tx = signTransaction(serializedTx, resolution, eth.signTransaction)

    const right_clicks = model.letter === 'S' ? 7 : 5;

    // Wait for the application to actually load and parse the transaction
    await waitForAppScreen(sim);
    await sim.navigateAndCompareSnapshots('.', model.name + '_glenn_destroy', [right_clicks, 0]);
    await tx;
  }));
});