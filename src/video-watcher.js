const IS_YOUTUBE_PLAYER = /youtube\.com\/watch/;

if (IS_YOUTUBE_PLAYER.test(window.location.href) {
  const currentVideo = document.querySelector('video');

  if (currentVideo.src.includes('youtube.com')) {
    currentVideo.addEventListener('ended', onEnded);
  }
}

function onEnded () {
  browser.runtime.sendMessage({ type: 'video:ended' });
}
