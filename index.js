const chokidar = require('chokidar');
const got = require('got');
const { log, start: rotateLogs } = require('./logs');

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

// One-liner for current directory, ignores .dotfiles
chokidar.watch(WATCH_DIR).on('unlink', path => {
  log(path);
  sendPath(path);
});

rotateLogs();

log(`Paths will be posted to ${uri}`);
log(`Watcher started for ${WATCH_DIR} ...`);
