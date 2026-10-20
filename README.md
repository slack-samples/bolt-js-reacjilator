# Reacjilator for Slack

Reacjilator translates a message when a user reacts with an emoji (*"reacji"*). For example, when a message gets a `:flag-de:` reacji, this bot translates the original message to German and posts it in the message thread.

![Reacjilator demo](tutorial_images/reacjilator-demo.gif)

## Claude Code, Codex, Cursor, and Other Coding Agents

Install the [Slack MCP and Skills Plugin](https://docs.slack.dev/ai/slack-skills-plugin/) so your coding agent can create, run, and deploy Slack apps, look up Web API methods and scopes, and build Block Kit without guessing.

### Claude Code

Run this in a Claude Code session:

```
/plugin install slack@claude-plugins-official
```

### Codex

Run this in your terminal:

```sh
codex plugin marketplace add slackapi/slack-skills-plugin
codex plugin add slack@slack
```

### Cursor

Run this in a Cursor Agent chat:

```
/add-plugin slack
```

### Other agents

Install the skills with `npx skills`, using your [agent's identifier](https://github.com/vercel-labs/skills#supported-agents):

```sh
npx skills add slackapi/slack-skills-plugin -y -a <agent>

# For example, OpenCode
npx skills add slackapi/slack-skills-plugin -y -a opencode
```

## Set Up Your Slack App

1. Create an app at your Slack App Settings page at [api.slack.com/apps](https://api.slack.com/apps)
2. Choose "From an app manifest", select the workspace you want to use, then paste the contents of [`manifest.yml`](./manifest.yml) into the dialog marked "Enter app manifest below".
3. On the **OAuth & Permissions** page, install the app and get a **Bot User OAuth Token** - it begins with `xoxb-`.
4. On the **Basic Information** page, scroll down to **App-Level Tokens** and click **Generate Token and Scopes**.
5. Add the `connections:write` scope, give your token a name, and click **Generate**. Copy this new token to your `.env` file as `SLACK_APP_TOKEN`

### Credentials

Rename the `.env.sample` to `.env` and fill the env vars with your credentials. You also need Google credentials to use the Google translation API:

```
SLACK_SIGNING_SECRET=
SLACK_AUTH_TOKEN=
GOOGLE_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
```

Get Your Slack App-Level Token at **Basic Information**, And your bot token at **OAuth & Permissions**.

Get your Google Cloud project ID and application credentials at [cloud.google.com](https://cloud.google.com/translate/docs/getting-started)

