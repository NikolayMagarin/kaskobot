import TelegramBot from 'node-telegram-bot-api';
import { memorizeMessage } from './features/summary/memory';
import { startServer } from './server';
import { CommandManager } from './manage-commands';
import * as h from './features';

const keepAliveServer = startServer();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, {
  polling: {
    autoStart: true,
    interval: 1000,
  },
});

bot.on('polling_error', (error) => {
  console.error(error);
  const errorMsg = error.message.toLowerCase();
  if (errorMsg.includes('409') && errorMsg.includes('conflict')) {
    bot.stopPolling();
    keepAliveServer?.close();
  }
});

const commands = new CommandManager(bot);

commands.add('start', (bot, msg, _params, _input) => {
  bot.sendMessage(msg.chat.id, 'Стартуем!');
});

commands.add('all', (bot, msg, _params, _input) => {
  bot.sendMessage(
    msg.chat.id,
    [
      'dalf_the_maker',
      'burningstar1',
      'denekben',
      'NikolayMagarin',
      'iwascleaningthechimney',
      'andre_bogdanov',
      'qibonri',
      'PoloViks',
      'chukavina_darya',
    ]
      .map((name) => '@' + name)
      .join(' ')
  );
});

commands.add('gpt', h.handleGpt);
commands.add('gptclear', h.handleGptClear);
commands.add('img', h.handleImg);
commands.add('help', h.handleHelp);
commands.add('summary', h.handleSummary);
commands.add('git', h.handleJoke);
commands.add('transcribe', h.handleTranscript);
commands.add('meme', h.handleMeme);

// short names
commands.add('g', h.handleGpt);
commands.add('gc', h.handleGptClear);
commands.add('i', h.handleImg);
commands.add('s', h.handleSummary);
commands.add('j', h.handleJoke);
commands.add('t', h.handleTranscript);
commands.add('m', h.handleMeme);

bot.on('message', (msg, data) => {
  // Команды не запоминаем
  if (!msg.text?.startsWith('/')) {
    memorizeMessage(bot, msg, data);
  }
});
