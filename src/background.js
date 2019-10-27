const app = browser;

const QUEUE_SUCCESS = 'queue-success';
const QUEUE_ERROR = 'queue-error';
const ICON_PATH = 'src/icons/icon.png';

app.contextMenus.create({
  contexts: ['link'],
  documentUrlPatterns: ['*://www.youtube.com/*'],
  id: 'queue-tube',
  targetUrlPatterns: ['*://www.youtube.com/watch?v=*'],
  title: 'Add video to queue',
});

app.tabs.executeScript({
  file: 'src/video-watcher.js',
});

app.runtime.onMessage.addListener(({ type }) => {
  if (type === 'video:ended') {
    playNextVideo();
  }
});

app.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'queue-tube') {
    const {linkUrl: url, linkText: text, selectionText, mediaType} = info;

    if (mediaType || (!text && !selectionText)) {
      app.notifications.create(QUEUE_ERROR, {
        iconUrl: ICON_PATH,
        message: 'Only text links can be added to the queue.',
        title: 'Error Adding to Queue',
        type: 'basic',
      });
      return;
    }

    // get the existing queue
    // save the updated queue
    app.storage.sync
      .get()
      .then(({queue = []}) => {
        return app.storage.sync.set({
          queue: queue.concat({text: text || selectionText, url}),
        });
      })
      .then(() => {
        app.notifications.create(QUEUE_SUCCESS, {
          iconUrl: ICON_PATH,
          message: `Your watch queue was been updated with ${text ||
            selectionText}`,
          title: 'Queue Updated',
          type: 'basic',
        });
      })
      .catch(error => {
        app.notifications.create(QUEUE_ERROR, {
          iconUrl: ICON_PATH,
          message: error.message || error.toString(),
          title: 'Error Adding to Queue',
          type: 'basic',
        });
      });
  }
});

app.browserAction.onClicked.addListener(() => {
  Promise.all([
    app.notifications.clear(QUEUE_ERROR),
    app.notifications.clear(QUEUE_SUCCESS),
  ]);
});

function playNextVideo () {
  app.storage.sync.get('queue')
  .then(({ queue = [] }) => {
    if (queue.legnth > 0) {
      app.tabs.update({ url: queue[0].url });
    }
  })
  .catch(error => {
    app.notifications.create(QUEUE_ERROR, {
      iconUrl: ICON_PATH,
      message: error.message || error.toString(),
      title: 'Error Getting Queue',
      type: 'basic',
    });
  });
}

/*
Notes:

- For thumbnails in queue list, I could start with just filling the short url with the id parsed from the link url
  - https://i.ytimg.com/vi/:id/hqdefault.jpg
- If I wanted to get more info about each video later, I could add background requests for content details through REST API
  - current endpoints are super clunky
*/
