# Cxcvb Backend

### Installation
  Prerequisites
  - Node.js 16.4.2 (You can install via NVM)
  - Postgresql 13
  
  1. Setup Postgresql
  ```bash
    cd db
  ```
  1.1 Change the database password in install.sql file
  1.2 run the setup.sh file
  ```bash
    bash setup.sh
  ```
  2. Installing all dependencies
  ```
    npm ci
  ```
  3. Runing
  ```
    SERPMASTER_USERNAME='[YOUR_USERNAME]' SERPMASTER_PASSWORD='[YOUR_PASSWORD]' DATABASE_PASSWORD='[YOUR_PASSWORD]' node server.js
  ```
### Additional 
  Running in background. It returns the processId
  ```
    nohup SERPMASTER_USERNAME=[YOUR_USERNAME] SERPMASTER_PASSWORD=[YOUR_PASSWORD] node server.js &
  ```
  For killing process
  ```
    kill -9 processId
  ```


  
