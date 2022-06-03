import { Entities } from '../common/entities';

const databaseToCookies = new Map<string, string>([
    [Entities.MIST, "mist_Database-"],
    [Entities.MIST_METAGENOMES, "mist_metagenomes_Database-"]
]);

export { databaseToCookies };