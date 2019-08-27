import config from './config';
import {userAPI, User} from './userAPI';
import { exists } from 'fs';

require('dotenv').config();

const { RTMClient } = require('@slack/rtm-api');

// Read a token from the environment variables
const token = config.chat.authToken

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var glob = require("glob")

async function start () {

    let users : User[] = await userAPI.getUsers();
    let presence:any = []

    let DBFiles = glob.sync("db/db*.json")

    for (let aFile of DBFiles ) {
        const adapter = new FileSync(aFile)
        const db = low(adapter)
        await db.read()
        presence = presence.concat(db.get('usersActivity')
            .value())
    }
    console.log (presence.length)
}

(async () => {
    await start(); 
})();






