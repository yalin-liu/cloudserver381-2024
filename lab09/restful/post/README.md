# POST requests
This example demonstrates the use of `body-parser` middleware to extract POST request parameters.

## Getting Started

### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
1. Send post request using `form.html`
2. Send post request using one the following `curl` commands:
```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"name":"coco","age":10}' localhost:8099
```
or
```
curl -v -X POST --data "name=coco&age=10" localhost:8099
```
