import config from './config';
import {userAPI, User} from './userAPI';
import { exists } from 'fs';

require('dotenv').config();

const sliceIdx:number=parseInt(process.env.SLICEIDX)

const { RTMClient } = require('@slack/rtm-api');

// Read a token from the environment variables
const token = config.chat.authToken

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(`db/db${sliceIdx}.json`)
const db = low(adapter)

// Initialize Slack RTM Client
const rtm = new RTMClient(token);

var trackedUserIds : string[]= [];

interface presenceInfo {
    id: string,
    presence: string,
    tsLastActive?: number
}

rtm.on('disconnected', (error:any) => {
    console.log(error);
  });

rtm.on('error', (event:any, error:any) => {
    console.log(error);
  });

rtm.on('unable_to_rtm_start', (error:any) => {
    console.log(error);
  });

rtm.on('disconnected', (error:any) => {
    console.log(error);
  });

// For those user's whose presence was subscribed, log the updates to the console.
rtm.on('presence_change', (event:any) => {
    //console.log(`User: ${event.user} Presence: ${event.presence}`);
    let entry = db.get('usersActivity')
      .find({ id: event.user })
      .value()
    console.log (`find for user ${event.user} presence ${event.presence} return ${JSON.stringify(entry)}`)
    if (event.presence=='active') {
      if (entry == undefined) {
        let newUser = {id:event.user, presence:event.presence, tsLastActive: Date.now()}
        console.log ("New presence : "+JSON.stringify(newUser))
        db.get('usersActivity')
            .push(newUser)
            .write()
      } else {
        let updatedUser= {id:event.user, presence:event.presence, tsLastActive: Date.now()}
        console.log ("Update presence : "+JSON.stringify(updatedUser))
        db.get('usersActivity')
          .find({ id: event.user })
          .assign (updatedUser)
          .write()
      }
    }
  });


async function start () {
    //Init database
    await db.defaults({ usersActivity: []})
      .write()
    await db.read()
    let users : User[] = await userAPI.getUsers();
    console.log("Number of actives/away users : "+users.length);
    trackedUserIds=users.map(function(user) {
        return user.id;
      });
    if ((1000*sliceIdx) < trackedUserIds.length) {
      trackedUserIds = trackedUserIds.slice (1000*sliceIdx,Math.min(trackedUserIds.length, 1000*(sliceIdx+1)-1))
      try {
          const { self, team } = await rtm.start({batch_presence_aware: 1, presence_sub: true});
      } catch (error) {
          console.log('An error occurred', error);
      }
      console.log ("Tracking presence for "+trackedUserIds.length+" users + starting index "+(1000*sliceIdx))
      await rtm.subscribePresence(trackedUserIds);
    }
  }

(async () => {
    await start(); 
})();



