import { changeAttribute } from "./utils/change-attribute.js";
import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";
import { Address } from "@unique-nft/sdk/utils";

const transactions = [];

const Retailer_collection_id = 3287
const Wholesale_collection_id = 3289
const Distributor_collection_id = 3290
const Manufacturer_collection_id = 3291

const {account, sdk} = await connectSdk();
