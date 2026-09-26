#!/bin/bash
# Start the local 2-player game server at http://localhost:3000
# (builds the client bundle first if it is missing).
if [ ! -f public/bundle/app.js ]; then
  npm run build
fi
DEBUG=open-hax:* node ./bin/www
