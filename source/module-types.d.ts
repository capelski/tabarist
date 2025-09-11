declare module '*.mp3';

declare module '*.png';

// Audio is not available on the server side
declare const Audio: {
  new (src?: string): HTMLAudioElement;
};
