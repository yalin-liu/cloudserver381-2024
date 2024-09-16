# RESTful requests
This example demonstrates the CRUD RESTful services for resource `users`

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
#### Create a `user`
```
curl -H "Content-Type: application/json" -X POST -d '{"name":"peter","age": 20}' localhost:8099/users
```
#### Read a `user`
```
curl -X GET localhost:8099/users/name/peter
```
or
```
curl -X GET localhost:8099/users/age/peter

```
#### Update a `user`
```
curl -H "Content-Type: application/json" -X PUT -d '{"name":"peter","age": 10}' localhost:8099/users/name/peter
```
#### Delete a `user`
```
curl -X DELETE localhost:8099/users/name/peter
```
