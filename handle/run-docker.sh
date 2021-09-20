image="graymatics1/handle-gsate"
container="handle"
docker stop $container
docker rm $container
docker run  \
    --restart always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /home/ubuntu/G-SATE/handle/shares:/home/shares \
    -v /home/ubuntu/G-SATE/resources:/home/resources \
    -e MYSQL_IP=ubuntu_db_1 \
    -e MYSQL_DB=gsate \
    -e RESOURCES=/home/ubuntu/G-SATE/resources \
    -e SHARE=/home/ubuntu/G-SATE/handle/shares \
    -e NETWORK=ubuntu_default \
    -it \
    --name $container \
    --network ubuntu_default \
    -w /home/src/ \
    --entrypoint "/bin/bash" \
    $image \
    -c "/home/src/run.sh"

