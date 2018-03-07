// npm deps
const choo = require('choo');
const html = require('choo/html');

const app = choo();

app.use((state, emitter) => {
  state.videos = null;

  emitter.on('queue:get', () => {
    browser.storage.sync
      .get('queue')
      .then(({queue = []}) => {
        state.videos = queue;
        emitter.emit('render');
      })
      .catch(console.error);
  });

  emitter.on('queue:remove', ({ index }) => {
    state.videos = state.videos.filter((_, i) => i !== index);
    emitter.emit('render');

    browser.storage.sync.set({
      queue: state.videos,
    })
    .catch(console.error);
  });

  emitter.on('video:open', ({ index, url }) => {
    browser.tabs.create({ url })
      .then(() => emitter.emit('queue:remove', { index }))
      .catch(console.error);
  });
});

app.route('*', index);

function index({videos}, emit) {
  if (!videos) {
    emit('queue:get');
  }
  return html`
    <div class="ma3">
      <h1 class="ma0 near-black">Welcome to QueueTube!</h1>
      <p>When falling down the rabbit hole of viral videos, just add videos to your queue to have them autoplay.</p>

      <hr class="b--red bw3 ba">

      <ul id="queue" class="list pl0">${
        videos ? videos.map((video, index) => (
          renderVideo({
            ...video,
            onClick: (event) => {
              event.preventDefault();
              emit('video:open', { ...video, index });
            },
            onDelete: () => emit('queue:remove', { index }),
          })
        )) : 'Loading...'
      }</ul>
    </div>
  `;
}

const ID_FROM_URL = /watch\?v=(.*)&?/;

function renderVideo({onClick, onDelete, text, url}) {
  const id = ID_FROM_URL.exec(url)[1];
  return html`
    <li class="bb bw1 b--light-silver mb3 hide-child relative">
      <a href=${url} class="link" onclick=${onClick}>
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=${text}>
        <p class="f4 near-black pv2 ma0 mb2 dim">${text}</p>
      </a>
      <span class="child db pointer absolute top-0 right-0 pa2 near-white" onclick=${onDelete}>X Remove</span>
    </li>
  `;
}

app.mount('#app');
