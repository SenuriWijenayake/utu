This repository contains the solution for the UTU code test. After downloading (or cloning) the repository, follow the below given instructions to setup and test the code.

# Setting up the MongoDB database
Step 1: Install MongoDB using https://docs.mongodb.com/manual/administration/install-community/ <br/>
Step 2: Open a Command Line Interface (Terminal on a Mac, Command Prompt on Windows) from the folder which contains the data.csv file. <br/>
Step 3: Import the data.csv file using the following code.
```mongo
mongoimport --db utu --collection records --type csv --headerline --file data.csv
```
<br/>Step 4: To confirm the database is successfully setup, open a mongo shell and check for the "utu" database using the "show dbs" command.
```mongo
mongo
show dbs
```
<br/>If the database is successfully setup "utu" should appear on the list of databases.

# Setting up the server
Step 1: Navigate to the "server" folder using the CLI.<br/>
Step 2: Install the required packages.<br/>
```npm
npm install
```
Step 3: Run the server side tests.<br/>
```npm
npm test
```
Step 4: Start the server.<br/>
```npm
npm start
```
Upon successfully starting the server you should be able to see the following statement on the CLI.<br/>
```
UTU app listening at http://localhost:3000
```

### After setting up the server, open the index.html on a Chrome browser.
