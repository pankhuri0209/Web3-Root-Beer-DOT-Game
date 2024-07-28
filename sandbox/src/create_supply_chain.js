import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";


// node ./src/create-token.js {collectionId} {address} {nickname}
// i.e. node ./src/create-token.js 3131 5HRADyd2sEVtpqh3cCdTdvfshMV7oK4xXJyM48i4r9S3TNGH Speedy777
const createToken = async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("run this command: node ./src/3-create-car.js {collectionId} {address} {nickname}");
    process.exit(1);
  }

  const [collectionId, owner, nickname] = args;
  const Retailer_collection_id = 3287
  const Wholesale_collection_id = 3289
  const Distributor_collection_id = 3290
  const Manufacturer_collection_id = 3291

  const {account, sdk} = await connectSdk();

  // Get pseudo-random car image for fun
  const tokenImage = "https://gateway.pinata.cloud/ipfs/QmQ7gCvcBfzt9JLg61ZbeAeAS1qS3qFPBD9UNGRaah7HiP"

  const tokenTx = await sdk.token.createV2({
    collectionId,
    image: tokenImage,
    owner,
    attributes: [
      {
        trait_type: "Name",
        value: nickname,
      },
      {
        trait_type: "Fees",
        value: 0,
      }
    ],
  });

  const token = tokenTx.parsed;
  if (!token) throw Error("Cannot parse token");

  console.log(`Explore your NFT: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);
 
  process.exit(0);
}


createToken().catch(e => {
  console.log('Something wrong during token creation');
  throw e;
});
