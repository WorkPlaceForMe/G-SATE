FROM nginx:1.17.1-alpine
COPY ./client/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist/client /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
