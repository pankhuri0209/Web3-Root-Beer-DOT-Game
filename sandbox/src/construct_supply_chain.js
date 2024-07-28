import { changeAttribute } from "./utils/change-attribute.js";
import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";
import { Address } from "@unique-nft/sdk/utils";


// node ./src/create-token.js {collectionId} {address} {nickname}
// i.e. node ./src/create-token.js 3131 5HRADyd2sEVtpqh3cCdTdvfshMV7oK4xXJyM48i4r9S3TNGH Speedy777
const createToken = async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("run this command: node ./src/3-create-car.js {collectionId} {address} {nickname}");
    process.exit(1);
  }

  
  const transactions = [];

  const [collectionId, temp1, temp2] = args;

  const Retailer_collection_id = 3287
  const Wholesale_collection_id = 3289
  const Distributor_collection_id = 3290
  const Manufacturer_collection_id = 3291

  const {account, sdk} = await connectSdk();

  let {nonce} = await sdk.common.getNonce(account);

  // Get pseudo-random car image for fun
//   const tokenImage = "https://gateway.pinata.cloud/ipfs/QmQ7gCvcBfzt9JLg61ZbeAeAS1qS3qFPBD9UNGRaah7HiP"

  const ownerToken = await sdk.token.getV2({collectionId: collectionId, tokenId: "1"});
//   console.log(ownerToken);
//   const tokenTx = await sdk.token.createV2({
//     collectionId,
//     image: tokenImage,
//     owner,
//     attributes: [
//       {
//         trait_type: "Name",
//         value: nickname,
//       }
//     ],
//   });
console.log("Check!!", ownerToken.collectionId, ownerToken.tokenId);


transactions.push(sdk.token.setProperties({
    collectionId: "3320",
    tokenId: "1",
    // NOTICE: Attributes stored in "tokenData" property
    properties: [{
      key: "tokenData",
      value: changeAttribute(ownerToken, "Name", "Supply Chain NFT")
    }]
  }, { nonce: nonce++}));

transactions.push(sdk.token.createV2({
    collectionId: Retailer_collection_id,
    image: "https://gateway.pinata.cloud/ipfs/QmT9Q9VPYzQPdHgYLJa6Yamv5weUuAHumWkzJTCTb3wwb3",
    attributes: [
        {trait_type: "demand", value: "0"},
        {trait_type: "incoming_order", value: "0"},
        {trait_type: "outgoing_order", value: "0"},
        {trait_type: "backlog", value: "0"},
        {trait_type: "current_stock", value: "0"}

    ],
    // NOTICE: owner of the achievment NFT is car NFT
    owner: Address.nesting.idsToAddress(ownerToken.collectionId, ownerToken.tokenId),
    // owner: "5DcEM623bYaVApajTgW1aVbaZn5eJgFke6gBF8TegBpJNHUV"
  }, {nonce: nonce++}));


//   transactions.push(sdk.token.createV2({
//     collectionId: Wholesale_collection_id,
//     image: "https://gateway.pinata.cloud/ipfs/QmSU49YWJySSpPQ44qgCNVAyNto5B668bcM7FKEZEH5nJZ",
//     attributes: [
//         {trait_type: "demand", value: "0"},
//         {trait_type: "incoming_order", value: "0"},
//         {trait_type: "outgoing_order", value: "0"},
//         {trait_type: "backlog", value: "0"},
//         {trait_type: "current_stock", value: "0"}

//     ],
//     // NOTICE: owner of the achievment NFT is car NFT
//     owner: Address.nesting.idsToAddress(ownerToken.collectionId, ownerToken.tokenId),
//   }, {nonce: nonce++}));

//   transactions.push(sdk.token.createV2({
//     collectionId: Distributor_collection_id,
//     image: "https://gateway.pinata.cloud/ipfs/QmcbH9tWuh75V7QJcPLLURjguzp7cEiF27S5LLgRL6BBSs",
//     attributes: [
//         {trait_type: "demand", value: "0"},
//         {trait_type: "incoming_order", value: "0"},
//         {trait_type: "outgoing_order", value: "0"},
//         {trait_type: "backlog", value: "0"},
//         {trait_type: "current_stock", value: "0"}

//     ],
//     // NOTICE: owner of the achievment NFT is car NFT
//     owner: Address.nesting.idsToAddress(ownerToken.collectionId, ownerToken.tokenId),
//   }, {nonce: nonce++}));

//   transactions.push(sdk.token.createV2({
//     collectionId: Manufacturer_collection_id,
//     image: "https://gateway.pinata.cloud/ipfs/QmZSdpsHgRiEgtjnKvF7pgVidHi6vd4fJjUzcTkxmCDyGN",
//     attributes: [
//         {trait_type: "demand", value: "0"},
//         {trait_type: "incoming_order", value: "0"},
//         {trait_type: "outgoing_order", value: "0"},
//         {trait_type: "backlog", value: "0"},
//         {trait_type: "current_stock", value: "0"}

//     ],
//     // NOTICE: owner of the achievment NFT is car NFT
//     owner: Address.nesting.idsToAddress(ownerToken.collectionId, ownerToken.tokenId),
//   }, {nonce: nonce++}));

  await Promise.all(transactions);
//   const token = tokenTx.parsed;
//   if (!token) throw Error("Cannot parse token");
   
  console.log(`Explore your NFT: https://uniquescan.io/opal/tokens/${ownerToken.collectionId}/${ownerToken.tokenId}`);

// const token = tokenTx.parsed;
//   if (!token) throw Error("Cannot parse token");

//   console.log(`Explore your NFT: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);
 
  process.exit(0);
}


createToken().catch(e => {
  console.log('Something wrong during token creation');
  throw e;
});
