# express-weather - A Simple Server-side App
## Overview
This is a simple app written using the [Express.js](https://expressjs.com) framework.
![Express-weather](graphics/381F-T01-alin.jpg?raw=true "Weather App")

## Getting Started
1. Obtain a free **API key** from [openweathermap.org](http://openweathermap.org)
![API Key 01](graphics/API01.png?raw=true "Create API Key")
![API Key 02](graphics/API02.png?raw=true "Create API Key")
2. Replace the value of `APIKEY` in `server.js` with your own API key.

## Running the app locally
1. Install the app's dependencies
```
$ cd ~/cloudapp/express-weather
$ npm install
```
Attention: If the npm version is not matched, using `$ npm install node@<required version no.>` to change the node version.

2. Run the app 
```
$ npm start
```
3. Test your app by sending to it a HTTP `GET` request.  Open http://localhost:8099 in your web browser.

[Deploy your app to Render](https://github.com/yalin-liu/comps381-2023/tree/main/lab01/express-weather) if the app is working correctly.
