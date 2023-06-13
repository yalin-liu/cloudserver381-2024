# Learn to deploy *server.js* apps to the cloud (Render)
This tutorial demonstrates **how to deploy a simple server.js app to Render**.

## Preparations

### Render Platform
> Create a free account at "https://www.render.com/".  
- Using your github account

### OpenWeather: account + API key
> Create a free account at "https://home.openweathermap.org/users/sign_up"
- Write down your `login email` and `password` for later use.
- Get `an API key` for later use.

## Test the app samples in local machine
### Open a terminal in local machine (Ubuntu system).
> Access the home directory and download the sample app to your **home** directory.
```
$ cd ~
$ git clone https://github.com/yalin-liu/cloudapp.git
```

### Test the `helloworld` app in local machine. 
- Go into the folder containing the `helloworld` app.
```
$ cd ~/cloudapp/helloworld
```
- Install the app's dependencies.
```
$ npm install
```
- Run the server app in local machine.
```
$ npm start
```
- Test your app by sending to it a HTTP `GET` request.  
- Open "http://localhost:8099" in your web browser.

### Test the `express-weather` app in local machine. 
- Go into the folder containing the `express-weather` app.
```
$ cd ~/cloudapp/express-weather
```
- Open `server.js` files
```
$ gedit server.js
```
- Add Open Weather `API` key to the `server.js` file
- Install the app's dependencies.
```
$ npm install npm@latest
```
- Run the server app in local machine.
```
$ npm start
```
- Test your app by sending to it a HTTP `GET` request.  
- Open "http://localhost:8099" in your web browser.

# Other Useful Commands.
[Switch branches of a git repository from master to main and reploy the app](https://help.heroku.com/O0EXQZTA/how-do-i-switch-branches-from-master-to-main).
```
$ git checkout -b main
$ git branch -D master
```
