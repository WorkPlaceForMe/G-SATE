FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update -y
RUN cd /tmp && curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py && python get-pip.py
RUN pip install opencv-python==4.2.0.32
RUN apt-get install -y python-mysqldb
RUN pip install python-dotenv
RUN apt-get install -y software-properties-common && add-apt-repository ppa:mc3man/trusty-media -y || true  && pt-get update -y || true && apt-get install -y ffmpeg
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
