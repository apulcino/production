cd library
npm install
cd ..
cd authent
npm install
cd ..
cd afoevents
npm install
cd ..
cd afopaniers
npm install
cd ..
cd aforegistry
npm install
cd ..
cd apigateway
npm install
cd ..

xterm -e node ./apigateway/server.js &
xterm -e node ./aforegistry/server.js &
xterm -e node ./authent/server.js &

