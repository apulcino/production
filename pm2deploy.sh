cd MSAFO/source
cd apigateway
npm install
cd library
npm install
cd ..
cd ..
cd afoevents
npm install
cd library
npm install
cd ..
cd ..
pm2 startOrRestart ./apigateway/ecosystem.json --env production
pm2 startOrRestart ./afoevents/ecosystem.json --env production