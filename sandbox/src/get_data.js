// import { connectSdk } from "./utils/connect-sdk.js";


// const Retailer_collection_id = 3287

// const {account, sdk} = await connectSdk();

// const tokens = await sdk.token.getV2({collectionId: Retailer_collection_id, tokenId: "10"});

// const json_string = tokens["properties"][2]["value"]

// const json_dict = JSON.parse(json_string)

// console.log(json_dict["attributes"])

import { connectSdk } from "./utils/connect-sdk.js";


async function getAttributes(collectionId, tokenId) {
    const { account, sdk } = await connectSdk();

    const tokens = await sdk.token.getV2({ collectionId, tokenId });
    const json_string = tokens["properties"][2]["value"];
    const json_dict = JSON.parse(json_string);

    return json_dict["attributes"];
}

// Export the function to be used in other files
export { getAttributes };