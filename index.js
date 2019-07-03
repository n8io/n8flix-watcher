const chokidar = require('chokidar');
const got = require('got');

const {
  DRY_RUN = '',
  HOST = 'plex.n8io.com',
  PATHNAME = '',
  PROTOCOL = 'http',
  PORT = '1981',
  WATCH_DIR = '/mnt/x/decrypted/**/*.(mkv|mp4|avi|n8)'
} = process.env;

const uri = `${PROTOCOL}://${HOST}:${PORT}/${PATHNAME}`;

const sendPath = async tmpPath => {
  let path = tmpPath;

  if (tmpPath && !tmpPath.startsWith('/')) {
    path = `/${tmpPath}`;
  }

  try {
    await got.post({
      url: uri,
      body: { debug: DRY_RUN ? true : undefined, path },
      json: true
    });
  } catch (e) {
    console.error('Error while sending request');
    console.error(e);
  }
};

const log = msg => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/New_York'
  };

  const dt = new Intl.DateTimeFormat('en-US', options).format(new Date());

  console.log(`${dt}: ${msg}`);
};

// One-liner for current directory, ignores .dotfiles
chokidar.watch(WATCH_DIR).on('unlink', path => {
  log(path);
  sendPath(path);
});

log(`Paths will be posted to ${uri}`);
log(`Watcher started for ${WATCH_DIR} ...`);
