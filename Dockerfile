FROM node

MAINTAINER ThomasHan

ADD . /app/

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "prod"]
