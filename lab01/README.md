# Deploy *server.js* apps to the cloud (Render)
This tutorial demonstrates **how to deploy a simple server.js app to Render**.

## Preparations

### Render Platform
> Create a free account at "https://www.render.com/".  
- Using your GitHub account

### OpenWeather: account + API key
> Create a free account at "https://home.openweathermap.org/users/sign_up"
- Write down your `login email` and `password` for later use.
- Get `an API key` for later use.

## Test the app samples on a local machine
### Open a terminal on the local machine (Ubuntu system).
> Access the home directory and download the sample app to your **home** directory.
```
$ cd ~
$ git clone https://github.com/yalin-liu/comps381-2023.git
```

### Test the `helloworld` app. 
- Go into the folder containing the `helloworld` app.
```
$ cd ~/comps381-2023/helloworld
```
- Install the app's dependencies.
```
$ npm install
```
- Run the server app on the local machine.
```
$ npm start
```
- Test your app by sending an HTTP `GET` request.  
- Open "http://localhost:8099" in your web browser.

### Test the `express-weather` app. 
- Go into the folder containing the `express-weather` app.
```
$ cd ~/comps381-2023/express-weather
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
- Run the server app on the local machine.
```
$ npm start
```
- Test your app by sending an HTTP `GET` request.  
- Open "http://localhost:8099" in your web browser.

# Other Useful commands
[Switch branches of a git repository from master to main and reploy the app](https://help.heroku.com/O0EXQZTA/how-do-i-switch-branches-from-master-to-main).
```
$ git checkout -b main
$ git branch -D master
```
