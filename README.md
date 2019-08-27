# Tool to help to detect inactive user on a Slack workspace
This tool will listen to users's presence to track presence status of users.
Result is written to a json file in db directory each time user's presence change

Limitation :
For large workspace (>1000 users), multiple instances of this tools must be usedf in //
This is the purpose of the parameter used in commande line, named sliceIdx. 
Setting sliceIdx to 0 means that tool will listen to first 1000 users,
Setting sliceIdx to 1 means that tool will listen to the next 1000 users,
...


# Configuration

## Dev 
Creater a .env-local file with Bot Token to be used to connect to Slack :
```
SLACK_BOT_AUTH_TOKEN=xoxb-....
```

## Prod
Creater a .env file
```
SLACK_BOT_AUTH_TOKEN=xoxb-....
```

# Build
```
npm run-script build  
```

# Start tool :
## Dev

```
npm run-script start-dev <sliceIdx>
```

## Prod
```
npm run-script start-prod <sliceIdx>
```
