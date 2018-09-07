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

start "apigateway" node ./apigateway/server.js
start "aforegistry" node ./aforegistry/server.js
start "authent" node ./authent/server.js

