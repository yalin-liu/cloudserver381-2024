// Importing the module 'url'   
const url = require('url'); 
  
// URL address 
const address = 'https://geeksforgeeks.org/projects?sort=newest&lang=nodejs'; 
  
// Call parse() method using url module 
let parsedURL = url.parse(address, true); 

// Returns an URL Object   
console.log('URL Object returned after parsing:', parsedURL); 

// Returns the query string  
let queryAsObject = parsedURL.query;
console.log('URL Querystring Object returned:', queryAsObject); 
