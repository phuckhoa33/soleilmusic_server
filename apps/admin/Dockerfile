# Use image nodejs
FROM node:18.16.0

# Workplace
WORKDIR /app 

#Copy package file
COPY ./server/apps/admin/package*.json ./server/apps/admin 

# Install dependencies
RUN npm install --prefix ./server/apps/admin/ 

# COPY 
EXPOSE 3000 

# RUN SERVER 
CMD ["npm", "run", "start:admin", "--prefix", "./server/apps/admin/"]