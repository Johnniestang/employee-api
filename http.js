const fetch = require("node-fetch");
/**
 * HTTP Library
 * Library for making HTTP requests
 * 
 * @version 1.0.0
 * @author John Morris
 * @license MIT
 * 
 */

class HTTP{
    // Don't need a constructor

    // Make HTTP GET request
    async get(url){
        const response = await fetch(url)
        const data = await response.json();
        return data;
   }

   // Make POST request
   async post(url, data){
       const response = await fetch(url, {
               method: 'POST',
               headers: {
                   'content-type': 'application/json'
               },
               body: JSON.stringify(data)
           });
       const responseData = response.json();
       return responseData;
   }

   // Make PUT request
   async put(url, data){
       const response = await fetch(url, {
               method: 'PUT',
               headers: {
                   'content-type': 'application/json'
               },
               body: JSON.stringify(data)
           });
           const responseData = response.json();
           return responseData;
   }
  
   async delete(url){
       const response = await fetch(url);
       const responseData = 'Record Deleted';
       return responseData;
   }

}

module.exports = HTTP;