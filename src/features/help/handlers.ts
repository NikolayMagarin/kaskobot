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

<b>/​summary</b>
  Команду нужно использовать в ответ на сообщение, с которого хотите начать перессказ
<b>/​git</b> {*режим*} *слово*
  *режим* - укажите равным <i>safe</i>, если боитесь кого-либо обидеть
  *слово* - ключевое слово, которое должно быть в анекдоте
  База анекдотов небольшая, для налучшего опыта не ограничивайте анекдот и используйте просто <b>/​git</b>`,
    { parse_mode: 'HTML' }
  );
};
