import { WebClient } from '@slack/web-api';
import config from './config';

class SlackAPI extends WebClient {
    public client: WebClient;

    constructor() {
        super();
        this.client = new WebClient(config.chat.authToken);
    }
};

const slackAPI = new SlackAPI();
export { slackAPI };