import {
  CasperClient,
  Contracts,
  RuntimeArgs,
  CLString,
  CLKey,
  Keys,
} from "casper-js-sdk";
// import {
//   getKeysFromHexPrivKey,
//   SignatureAlgorithm,
// } from "casper-js-sdk/dist/lib/Keys";
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
const recipientKey = Keys.getKeysFromHexPrivKey(
  privateKey,
  Keys.SignatureAlgorithm.Ed25519
);

const contractClient = new Contracts.Contract();
contractClient.setContractHash(
  "hash-0b659298a70a7bfcde35aceb49a0d7b4a34aed5e0a7e946db135d598edd411b9"
);

const metadata = {
  name: "Casper punk",
  description: "This is a Casper Punk!",
  image:
    "https://apigateway.bithotel.io/metadata/QmWN9Gb4A1gT1j7DQj34gn3Mta3jQcsLmddjaU7JabcHuG",
  external_link: "https://bithotel.io/#/",
  attributes: [
    {
      trait_type: "Rarity",
      value: "Epic",
    },
    {
      trait_type: "Replicas",
      value: "10",
    },
    {
      trait_type: "Drop",
      value: "Season 2",
    },
  ],
};

const runtimeArgs = RuntimeArgs.fromMap({
  token_owner: new CLKey(recipientKey.publicKey),
  token_meta_data: new CLString(JSON.stringify(metadata)),
});

const preparedDeploy = contractClient.callEntrypoint(
  "mint",
  runtimeArgs,
  key.publicKey,
  "casper-test",
  "20000000000",
  [key]
);

casperClient.putDeploy(preparedDeploy).then(console.log);
