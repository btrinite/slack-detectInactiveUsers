import { slackAPI } from './slackAPI';
import config from './config';
import { fiveRetriesInFiveMinutes } from '@slack/web-api/dist/retry-policies';

interface User {
    id: string,
    name: string,
    email: string,
}

interface SlackUser {
    id: string,
    name: string,
    is_archived: boolean
    is_channel: boolean
    is_shared: boolean
    is_org_shared: boolean
    is_private: boolean
}

class UserAPI {

    constructor() {
    }

    public async getUsers(): Promise<User[]> {
        var ret:any;
        var res:User[];
        var members:any[];

        ret = await slackAPI.client.users.list();
        members=[...ret.members]
        while (ret.response_metadata.next_cursor) {
            ret = await slackAPI.client.users.list({cursor:ret.response_metadata.next_cursor});
            members=members.concat([...ret.members])
        }
        members.sort((a, b) => b.id - a.id)
        res = members.filter((aUser:any) => {
            if (aUser.is_bot || (aUser.deleted && aUser.deleted==true)) {
                return false;
            } else {
                return true
            }
        }).map((aUser:any) => {
            var rObj:User = {
                id: aUser.id,
                name: aUser.profile.real_name?aUser.profile.real_name:aUser.profile.name,
                email: aUser.profile.email
            };
            return rObj;
        });
        return res;
    }

    public async getPresence(userId: string): Promise<User> {
        var ret:any;
        var res:User;
        ret = await slackAPI.client.users.getPresence({user:userId});
        return ret;
    }
    public async info(userId: string): Promise<User> {
        var ret:any;
        var res:User;
        ret = await slackAPI.client.users.info({user:userId});
        return ret;
    }
    public async lookupByEmail(userEmail: string): Promise<User> {
        var ret:any;
        var res:User;
        ret = await slackAPI.client.users.lookupByEmail({email:userEmail});
        return ret;
    }
};

const userAPI = new UserAPI();
export { userAPI, User};
