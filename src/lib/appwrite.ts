import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('671a3b3b001e61070268');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = '671e03290035f2fb88c0';
export const TASKS_COLLECTION_ID = '671e0342000513c274c7';