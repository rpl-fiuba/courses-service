FROM node:10
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

WORKDIR /code
RUN npm install
EXPOSE 5001
ENV DOCKER true
CMD ["npm", "run", "start:watch"]
