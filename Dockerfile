FROM node:alpine

WORKDIR /blogproject

# dependency def
COPY package.json ./

# install dependencies
RUN npm install

# Get all remaining code to  run the app 
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

