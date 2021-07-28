# Cxcvb Backend

### Installation
  Prerequisites
  - Node.js 16.4.2 (You can install via NVM)
  - Redis
  1. Installing Redis
  ```
    sudo apt install redis-server
  ```
  2. Installing all dependencies
  ```
    npm ci
  ```
  3. Runing
  ```
    SERPMASTER_USERNAME=[YOUR_USERNAME] SERPMASTER_PASSWORD=[YOUR_PASSWORD] node server.js
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


  
