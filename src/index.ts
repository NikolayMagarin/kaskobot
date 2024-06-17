import TelegramBot from 'node-telegram-bot-api';
import { handleGpt, handleImg } from './features/gpt/handlers';
import { handleHelp } from './features/help/handlers';
import { handleSummary } from './features/summary/handlers';
import { memorizeMessage } from './features/summary/memory';
import { startKeepAliveServer } from './keep-alive-server';
import { CommandManager } from './manage-commands';

const keepAliveServer = startKeepAliveServer();

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
    '@andrewbogdanovDA @burningstar1 @dalf_the_maker @denekben @iwascleaningthechimney @MinecraftLoverOneLife @NikolayMagarin @PoloViks'
  );
});

commands.add('gpt', handleGpt);
commands.add('img', handleImg);
commands.add('help', handleHelp);
commands.add('summary', handleSummary);

bot.on('message', (msg, data) => {
  // Команды не запоминаем
  if (!msg.text?.startsWith('/')) {
    memorizeMessage(bot, msg, data);
  }
});
