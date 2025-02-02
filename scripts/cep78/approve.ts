import {
  CasperClient,
  Contracts,
  RuntimeArgs,
  Keys,
  CLString,
  CLU64,
} from "casper-js-sdk";
import { stringToKey } from "./utils";
import dotenv from "dotenv";

dotenv.config();

let rpcUri: string;
let privateKey: string;

if (process.env.RPC_URI && process.env.PRIIVATE_KEY) {
  rpcUri = process.env.RPC_URI;
  privateKey = process.env.PRIIVATE_KEY;
} else {
  throw new Error(`No rpcUri or privateKey found`);
}

const casperClient = new CasperClient(rpcUri);

const privateKeyPath = "/Users/bufo/Downloads/BitHotel_secret_key.pem";

const key = Keys.Ed25519.loadKeyPairFromPrivateFile(privateKeyPath);

const key2 = Keys.getKeysFromHexPrivKey(
  privateKey,
  Keys.SignatureAlgorithm.Ed25519
);

const contractClient = new Contracts.Contract();
contractClient.setContractHash(
  "hash-0b659298a70a7bfcde35aceb49a0d7b4a34aed5e0a7e946db135d598edd411b9"
);

const runtimeArgs = RuntimeArgs.fromMap({
  operator: stringToKey(
    "cc8d74f5cdd36bf926ebb47f57f6d6f2317846c852623fcee72bb5f756d99857"
  ),
  token_id: new CLU64(2),
});

const preparedDeploy = contractClient.callEntrypoint(
  "approve",
  runtimeArgs,
  key.publicKey,
  "casper-test",
  "8000000000",
  [key]
);

casperClient.putDeploy(preparedDeploy).then(console.log);
