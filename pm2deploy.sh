cd MSAFO/source/apigateway
npm install
cd library
npm install
cd ..
cd ..
pm2 startOrRestart ./apigateway/ecosystem.json --env production