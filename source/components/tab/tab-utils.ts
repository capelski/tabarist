export const getYoutubeId = (backingTrack: string | undefined) => {
  const youtubeVideoId =
    backingTrack &&
    (/^https\:\/\/youtu\.be\/([^/?]*)/.exec(backingTrack)?.[1] ||
      /^https\:\/\/(?:www.)?youtube.com\/watch\?v=([^&]*)/.exec(backingTrack)?.[1] ||
      /https\:\/\/(?:www.)?youtube.com\/embed\/([^/?]*)/.exec(backingTrack)?.[1]);

  return youtubeVideoId;
};
