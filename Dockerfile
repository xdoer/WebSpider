FROM node

MAINTAINER ThomasHan

WORKDIR /app

ADD ./src ./static ./package.json /app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
