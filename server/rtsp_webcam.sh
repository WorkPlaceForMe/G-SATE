port=1111
i=0
rtsp="/dev/video0"

# echo 123!@#qwe | sudo -S pkill -f ffserver -9
sudo pkill -f ffmpeg -9
# sudo pkill -f print_console -9

ffserver -f ./serverOne.conf &
ffmpeg -i $rtsp -framerate 30 -video_size 1280x720 http://localhost:$port/feed$i.ffm

