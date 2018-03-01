browser.contextMenus.create({
  contexts: ['link'],
  documentUrlPatterns: [
    '*://www.youtube.com/*',
  ],
  id: 'queue-tube',
  targetUrlPatterns: [
    '*://www.youtube.com/watch?v=*',
  ],
  title: 'Copy link to queue',
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'queue-tube') {
    const { linkUrl: url, linkText: text, mediaType } = info;
    
    if (mediaType) {
      // eventually this will be a UI warning
      console.warn('Only text links will work for adding to the queue');
      return;
    };

    // get the existing queue
    // save the updated queue
    // add some kind of success response, eventually in the UI?
    browser.storage.sync.get()
    .then(({ queue = [] }) => {
      console.log(`Adding link (${text}) to the queue`);
      return browser.storage.sync.set({ queue: queue.concat({ text, url }) });
    })
    .then(() => console.log('Queue successfully updated'))
    .catch(console.error);
  }
});

/*
Notes:

- For thumbnails in queue list, I could start with just filling the short url with the id parsed from the link url
  - https://i.ytimg.com/vi/:id/hqdefault.jpg
- If I wanted to get more info about each video later, I could add background requests for content details through REST API
  - current endpoints are super clunky
