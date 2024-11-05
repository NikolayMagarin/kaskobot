import { g4f } from './g4f';

export interface Options {
  provider: (typeof g4f.providers)[keyof typeof g4f.providers];
  providerOptions: Record<string, string | number | boolean>;
}

// default prodia options with model specified
function o(model: string) {
  return {
    provider: g4f.providers.Prodia,
    providerOptions: {
      model: model,
      samplingSteps: 20,
      cfgScale: 30,
    },
  } as Options;
}

export const imgStyles = {
  cartoon: [
    {
      provider: g4f.providers.Emi,
    },
  ] as Options[],
  effect: [
    o('3Guofeng3_v34.safetensors [50f420de]'),
    o('analog-diffusion-1.0.ckpt [9ca13f02]'),
  ],
  realism: [
    o('absolutereality_v181.safetensors [3d9d4d2b]'),
    o('amIReal_V41.safetensors [0a8a2e61]'),
    o('cyberrealistic_v33.safetensors [82b0d085]'),
    o('dreamlike-photoreal-2.0.safetensors [fdcf65e7]'),
    o('epicrealism_naturalSinRC1VAE.safetensors [90a4c676]'),
    o('ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]'),
    o('majicmixRealistic_v4.safetensors [29d0de58]'),
    o('protogenx34.safetensors [5896f8d5]'),
    o('Realistic_Vision_V5.0.safetensors [614d1063]'),
  ],
  anime: [
    o('AOM3A3_orangemixs.safetensors [9600da17]'),
    o('Counterfeit_v30.safetensors [9e2a8f19]'),
    o('dreamlike-anime-1.0.safetensors [4520e090]'),
    o('EimisAnimeDiffusion_V1.ckpt [4f828a15]'),
    o('pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]'),
  ],
  cute: [
    o('cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]'),
    o('lyriel_v16.safetensors [68fceea2]'),
    o('revAnimated_v122.safetensors [3f4fefd9]'),
    o('shoninsBeautiful_v10.safetensors [25d8c546]'),
  ],
  portrait: [
    o('lofi_v4.safetensors [ccc204d6]'),
    o('portraitplus_V1.0.safetensors [1400e684]'),
  ],
  story: [
    o('neverendingDream_v122.safetensors [f964ceeb]'),
    // o('openjourney_V4.ckpt [ca2f377f]'), // Почему-то вообще не отвечает
  ],
};

export type SupportedStyle = keyof typeof imgStyles;
export const supportedStyles = Object.keys(imgStyles) as SupportedStyle[];
