import { connectSdk } from "./utils/connect-sdk.js";

const createCollection = async (name, description, symbol) => {
  const { account, sdk } = await connectSdk();

  // 1. Let's check account's balance
  const balance = await sdk.balance.get(account);
  console.log(`${account.address} balance:`, balance.availableBalance.formatted);

  // 2. Mint collection
  const { parsed } = await sdk.collection.createV2({
    name,
    description,
    symbol,
    permissions: { nesting: { collectionAdmin: true } },
    encodeOptions: {
      overwriteTPPs: [
        {
          key: 'tokenData',
          permission: {
            collectionAdmin: true, tokenOwner: false, mutable: true
          }
        }
      ],
    },
  });

  if (!parsed) throw Error('Cannot parse minted collection');
  
  const collectionId = parsed.collectionId;
  console.log('Collection ID:', collectionId);
  console.log(`Explore your collection: https://uniquescan.io/opal/collections/${collectionId}`);

  return { address: account.address, collectionId };
}

export default createCollection;
