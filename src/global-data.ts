export const globalData: GlobalData = {
  bot_statistics: {
    total_time_of_transcripted_audio: 0,
  },
  memory: [],
};

export interface GlobalData extends Record<string, any> {
  bot_statistics: {
    total_time_of_transcripted_audio: number;
  };
  memory: Message[];
}

export interface Message {
  id: number;
  text: string;
}

export function redefineData(data: any) {
  for (const [key, value] of Object.entries(data)) {
    globalData[key] = value;
  }
}
