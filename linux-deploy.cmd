cd library
sudo npm install
cd ..
cd authent
sudo npm install
cd ..
cd afoevents
sudo npm install
cd ..
cd afopaniers
sudo npm install
cd ..
cd aforegistry
sudo npm install
cd ..
cd apigateway
sudo npm install
cd ..

xterm -e node ./apigateway/server.js &
xterm -e node ./aforegistry/server.js &
xterm -e node ./authent/server.js &

