// export enum Misc {
//     SHOP_CART_MIST_PREFIX = "mist_Database-",
//     SHOP_CART_MIST_METAGENOMES_PREFIX = "mist_metagenomes_Database-"
// }
import { Entities } from '../common/entities';

const databaseToCookies = new Map<string, string>([
    [Entities.MIST, "mist_Database-"],
    [Entities.MIST_METAGENOMES, "mist_metagenomes_Database-"]
]);

export { databaseToCookies };