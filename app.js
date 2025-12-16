import { v2 } from '@google-cloud/translate';
import { App } from '@slack/bolt';
import 'dotenv/config';
import langcode from './langcode.js';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const translate = new v2.Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
});

app.event('reaction_added', async ({ event, client, logger }) => {
  const { type, reaction, item } = event;

  if (type === 'reaction_added') {
    // If reacji was triggered && it is a correct emoji, translate the message into a specified language

    if (item.type !== 'message') {
      return;
    }

    let country = '';

    // Check emoji if it is a country flag
    if (reaction.match(/flag-/)) { // when an emoji has flag- prefix
      country = reaction.match(/(?!flag-\b)\b\w+/)[0];
    } else { // jp, fr, etc.
      const flags = Object.keys(langcode); // array
      if (flags.includes(reaction)) {
        country = reaction;
      } else {
        return;
      }
    }

    // Finding a lang based on a country is not the best way but oh well
    // Matching ISO 639-1 language code
    let lang = langcode[country];
    if (!lang) return;

    let messages = await getMessage(item.channel, item.ts, client, logger);
    postTranslatedMessage(messages, lang, item.channel, reaction, client, logger);

  }
});

const getMessage = async (channel, ts, client, logger) => {
  try {
    const result = await client.conversations.replies({
      channel: channel,
      ts: ts,
      limit: 1,
      inclusive: true
    });
    return result.messages;
  } catch (e) {
    logger.error(e);
  }
};

const postTranslatedMessage = (messages, lang, channel, emoji, client, logger) => {

  // Google Translate API

  let message = messages[0];
  translate.translate(message.text, lang, (err, translation) => {
    if (err) {
      logger.error(err);
    } else {
      if (isAlreadyPosted(messages, translation)) return;
      postMessage(message, translation, lang, channel, emoji, client, logger);
    }
  });
};

const isAlreadyPosted = (messages, translation) => {
  // To avoid posting same messages several times, check the thread for an identical translation
  let alreadyPosted = false;
  messages.forEach(messageInTheThread => {
    if (!alreadyPosted && messageInTheThread.subtype && messageInTheThread.blocks[0].text.text === translation) {
      alreadyPosted = true;
    }
  });
  if (alreadyPosted) {
    return true;
  }
};

const postMessage = async (message, translation, lang, channel, emoji, client, logger) => {

  const ts = (message.thread_ts) ? message.thread_ts : message.ts;

  let text = '';
  let blocks = [];

  if (message.text) { // Check if the message has translated
    text = `_Here is a translation to_ :${emoji}: _(${lang})_`;
    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${translation}`
        }
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `A translation of the original message to :${emoji}: _(${lang})_` }
        ]
      },
    );
  } else {
    text = '_Sorry, the language is not supported!_ :persevere:';
    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `_Sorry, the language is not supported!_ :persevere:`
        }
      }
    );
  }

  try {
    const result = await client.chat.postMessage({
      text,
      blocks,
      channel,
      thread_ts: ts
    });

    logger.info(result);
  } catch (e) {
    logger.error(e);
  }
};


(async () => {
  try {
    // Start your app
    await app.start();
    app.logger.info('⚡️ Bolt app is running!');
  } catch (error) {
    app.logger.error('Unable to start App', error);
    process.exit(1);
  }
})();
