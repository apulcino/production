cd library
call npm install
cd ..
cd authent
call npm install
cd ..
cd afoevents
call npm install
cd ..
cd afopaniers
call npm install
cd ..
cd aforegistry
call npm install
cd ..
cd apigateway
call npm install
cd ..

start "apigateway" node ./apigateway/server.js
start "aforegistry" node ./aforegistry/server.js
start "authent" node ./authent/server.js

