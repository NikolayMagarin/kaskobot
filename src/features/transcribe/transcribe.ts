import { AssemblyAI } from 'assemblyai';
import { config } from '../../config';
import { globalData } from '../../global-data';

const client = new AssemblyAI({
  apiKey: config.assemblyAiApiKey,
});

export async function transcribe(url: string) {
  return client.transcripts
    .transcribe({
      audio_url: url,
      language_code: 'ru',
    })
    .then((transcription) => {
      globalData.bot_statistics.total_time_of_transcripted_audio +=
        transcription.audio_duration || 0;
      return transcription;
    });
}
