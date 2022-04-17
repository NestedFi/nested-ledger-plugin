import { nano_models, processTest, populateTransaction } from "../test.fixture"

const contractName = "NestedFactory";
const contractAddr = "0xe24c8123c8054fb9e8c53496948c34ea59914cdf";
const testNetwork = "ethereum";

const testLabel = "Ethereum create"; // <= Name of the test
const testDirSuffix = testLabel.toLowerCase().replace(/\s+/g, '_');

// https://etherscan.io/tx/0xd0356e0a8aa136f0d07e41a88f0b0de20cd8336e15be56ca2d0579d673d2b6c4
const inputData = "0xa378534b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000520000000000000000000000000000000000000000000000000000000000000076000000000000000000000000000000000000000000000000000000000000008205a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000c2544a32872a91f4a553b404c6950e89de901fdb000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000c2544a32872a91f4a553b404c6950e89de901fdb000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001286af479b20000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000011b8dfb161554800000000000000000000000000000000000000000000000014dd20d73c42840280000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2002710c2544a32872a91f4a553b404c6950e89de901fdb000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000007627c5d1ba625af7bf0000000000000000000000000000000000000000000000005a65726f457800000000000000000000000000000000000000000000000000000000000000000000000000006f80310ca7f2c654691d1383149fa1a57d8ab1f8000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006f80310ca7f2c654691d1383149fa1a57d8ab1f8000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001286af479b20000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000011ad7532291c18000000000000000000000000000000000000000000000001483eef9a150251d5c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20027106f80310ca7f2c654691d1383149fa1a57d8ab1f8000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003d93b55e3f625af7bb0000000000000000000000000000000000000000000000005a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000af5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000af5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001286af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000119aa288416e1000000000000000000000000000000000000000000000000055ae72749b6da13400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb8af5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6000000000000000000000000000000000000000000869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000002ed674ba4d625af7ba000000000000000000000000000000000000000000000000466c617400000000000000000000000000000000000000000000000000000000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000040000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000001168f167bf182805a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000bbbbbbb5aa847a2003fbc6b5c16df0bd1e725f61000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000bbbbbbb5aa847a2003fbc6b5c16df0bd1e725f6100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000128d9627aa4000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000001184159aa5e86800000000000000000000000000000000000000000000000032f8c5f1e2e1c1dd900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000bbbbbbb5aa847a2003fbc6b5c16df0bd1e725f61869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000bb81c7f7fc625af7c0000000000000000000000000000000000000000000000000";

// [NanoS steps, NanoX steps]
const steps = [5, 5]

// populate unsignedTx from genericTx and get network chain id
const unsignedTx = populateTransaction(contractAddr, inputData, testNetwork);
// Process tests for each nano models
nano_models.forEach((model) =>
	processTest(model, steps, contractName, testLabel, testDirSuffix, unsignedTx, testNetwork)
);