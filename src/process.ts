import config from './config';
import {userAPI, User} from './userAPI';

const fs = require('fs');

const jsonfiles=["db0.json", "db1.json"];


async function start () {
    jsonfiles.forEach(aJsonFile => {
        fs.readFileSync(`db/${aJsonFile}`)
    });
    let users : User[] = await userAPI.getUsers();
}

(async () => {
    await start(); 
})();


