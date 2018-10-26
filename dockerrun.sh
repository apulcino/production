172.17.0.1 -> IP de l hote docker

consul agent -server -bootstrap-expect=1 -data-dir=consul-data -ui -bind=158.50.163.114 -client=172.17.0.1

cd apigateway
docker build -t afp/apigateway .
cd ..
cd afoevents
docker build -t afp/afoevents .

docker run -p 8080:8080 --name apig -d afp/apigateway
docker run -p 3100:3100 --name afoe -d afp/afoevents
