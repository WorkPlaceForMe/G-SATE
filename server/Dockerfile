FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update -y
RUN apt-get install -y ffmpeg
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
