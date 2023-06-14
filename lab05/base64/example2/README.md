# Node.js Example: MongoDB Base64
An example of inserting documents containing Base64 data.  This example inserts documents into a collection named `photo`.

When you study this example, please pay attention to the followings:
1. How to handle `multipart/form-data` and in particular extracting form data.
2. How to read an uploaded file.
3. How to convert the uploaded file to Base64.
4. How to insert documents containing Base64 data.

## Getting Started
Change the value of variable `mongourl`.
### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
Send a GET request to http://localhost:8099
