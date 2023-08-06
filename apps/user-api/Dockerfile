# Use image nodejs
FROM node:18.16.0

# Workplace
WORKDIR /app 

#Copy package file
COPY ./server/apps/user-api/package*.json ./server/apps/user-api/

# Install dependencies
RUN npm install --prefix ./server/apps/user-api/

# COPY 
EXPOSE 3000 

# RUN SERVER 
CMD ["npm", "run", "start:user-api", "--prefix", "./server/apps/user-api/"]