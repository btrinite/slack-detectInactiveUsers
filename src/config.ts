
interface SlackConfig {
    authToken: string,
}

interface ChatConfig {
    slack: SlackConfig
}

const chatConfig: ChatConfig = {
    slack: {
        authToken: process.env.SLACK_BOT_AUTH_TOKEN,
    }
};

const config = {
    chat: chatConfig.slack,
};


export default config;