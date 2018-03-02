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
});

app.route('*', index);

function index({videos}, emit) {
  if (!videos) {
    emit('queue:get');
  }
  return html`
    <div class="ma3">
      <h1 class="ma0">Welcome to QueueTube!</h1>
      <p>When falling down the rabbit hole of viral videos, just add videos to your queue to have them autoplay.</p>

      <ul id="queue" class="pa0 pl3">${
        videos ? videos.map(renderVideo) : 'Loading...'
      }</ul>
    </div>
  `;
}

function renderVideo({text, url}) {
  return html`<li><a href=${url} class="red">${text}</a>/li>`;
}

app.mount('#app');
