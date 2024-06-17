import TelegramBot from 'node-telegram-bot-api';

export type CommandHandler = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  commandParams: string[],
  commandInput: string | undefined
) => void | true;

type Commands = Map<string, CommandHandler>;

export class CommandManager {
  private _bot: TelegramBot;
  private _commands: Commands;

  constructor(bot: TelegramBot) {
    this._bot = bot;
    this._commands = new Map();

    bot.onText(/\/(\w+)( {(.+?)})?( (.+))?/, (msg, match) => {
      if (!match) {
        bot.sendMessage(msg.chat.id, 'Не понимаю команду 😔');
        return;
      }

      const commandName = match[1] || '';
      const commandParams = (match[3] || '')
        .split(',')
        .map((param) => param.trim());
      const commandInput = match[5] || undefined;

      const handler = this._commands.get(commandName);

      if (handler) {
        const commandValidationFailed = handler(
          bot,
          msg,
          commandParams,
          commandInput
        );
        if (typeof commandValidationFailed === 'boolean') {
          bot.sendMessage(
            msg.chat.id,
            'Эту команду так использовать нельзя 😔'
          );
        }
      } else {
        bot.sendMessage(msg.chat.id, 'Не понимаю команду 😔');
      }
    });
  }

  get bot() {
    return this._bot;
  }

  get commands() {
    return this._commands;
  }

  add(name: string, handler: CommandHandler) {
    if (!name.length) return;
    this._commands.set(name, handler);
  }

  delete(name: string) {
    if (!this._commands.has(name)) return;
    this._commands.delete(name);
  }
}
