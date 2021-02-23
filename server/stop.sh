PASSWORD=$1
echo $PASSWORD | sudo -S docker
sudo docker stop algo