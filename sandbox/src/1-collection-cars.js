import { connectSdk } from "./utils/connect-sdk.js";

const createCollection = async () => {
  const {account, sdk} = await connectSdk();

  // 1. Let's check account's balance
  // NOTICE: get OPL tokens https://t.me/unique2faucet_opal_bot
  const balance = await sdk.balance.get(account);
  console.log(`${account.address} balance:`, balance.availableBalance.formatted);

  // 2. Mint collection
  const {parsed} = await sdk.collection.createV2({
    name: "Supply Chain NFT",
    description: "This is a representative supply chain NFT",
    symbol: "SCN",
    // cover_image: {url: "https://gateway.pinata.cloud/ipfs/QmeNzaLfsUUi5pGmhrASEpXF52deCDuByeKbU7SuZ9toEi"},
    // NOTICE: activate nesting for collection admin in order to assign achievements
    permissions: {nesting: {collectionAdmin: true}},
    encodeOptions: {
      overwriteTPPs: [
        {
          // tokenData is a container for attributes
          key: 'tokenData',
          permission: {
            // NOTICE: limit mutability for admins only 
            collectionAdmin: true, tokenOwner: false, mutable: true
          }
        }
      ],
    },
  });

  if(!parsed) throw Error('Cannot parse minted collection');
  
  const collectionId = parsed.collectionId;
  const collectionAddress = parsed.collectionAddress;
  console.log('Collection ID:', collectionId);
  console.log('Collection Address:', account.address);
  console.log(`Explore your collection: https://uniquescan.io/opal/collections/${collectionId}`);

  process.exit(0);
}


createCollection().catch(e => {
  console.log('Something wrong during collection creation');
  throw e;
});
