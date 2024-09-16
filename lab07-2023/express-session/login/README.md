# Cookie Session Example
This example demonstrates the use of cookie session to store user credential 

1. Note the use of the `cookie-session` middleware.
2. Note the use of the `body-parser` middleware to extract `name` and `password` from `POST /login`.
3. Note the flow of control and how user credential is stored and destroyed in `session`.  After a successful login, the following name/value pairs are stored in `cookie-session`:
```
'authenticated': true
'username': <username>
```

### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
Go to http://localhost:8099
