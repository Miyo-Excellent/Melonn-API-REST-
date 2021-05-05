import 'setup';

import Server from 'Server';
import config from 'config';

const server: Server = new Server({
  appName: config.app.name,
  databaseUri: config.database.settings.uri,
  secretSession: config.app.cookieSessionSecret,
  port: config.app.port,
});

server.start();
