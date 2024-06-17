import { CommandHandler } from '../../manage-commands';

export const handleHelp: CommandHandler = (bot, msg, params, input) => {
  bot.sendMessage(
    msg.chat.id,
    `Команды:
<b>/​help</b>

<b>/​all</b>

<b>/​gpt</b> *текст*

<b>/​img</b> {*модель*} *текст*
  *модель* - необязательный параметр. Доступные модели: <i>cartoon</i>, <i>effect</i>, <i>realism</i>, <i>anime</i>, <i>cute</i>, <i>portrait</i>, <i>story</i>. Можно указать конктретный номер {realism_5}

  <b>/​summary</b> *текст*
  Команду нужно использовать в ответ на сообщение, с которого хотите начать перессказ
  *текст* - если вам не нужен перессказ всего разговора, но хотите узнать что-то конкретное, то укажите это здесь (поддержка параметра не реализована)`,
    { parse_mode: 'HTML' }
  );
};
