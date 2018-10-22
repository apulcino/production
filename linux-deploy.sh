cd apigateway
npm install
cd library
npm install
cd ..
docker build -t afp/apigateway .
docker run -p 8080:8080 -it afp/apigateway
cd ..

cd afoevents
npm install
cd library
npm install
cd ..
docker build -t afp/afoevents .
docker run -p 3100:3100 -it afp/afoevents
cd ..




