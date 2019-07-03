const chokidar = require('chokidar');
const got = require('got');

const sendPath = async path => {
  try {
    await got.post({
      url: 'http://plex.n8io.com:1981',
      body: { path },
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
chokidar.watch('/mnt/x/decrypted/**/*.(mkv|mp4|avi|n8)').on('unlink', path => {
  log(path);
  sendPath(path);
});
