
const uniqID = require('uniqid');
const HTTP = require('./http.js');
const quoteURL = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
const jokeURL = "http://api.icndb.com/jokes/random";
const jokeObject = "value.joke";


class Employee{

    constructor(firstName, lastName, hireDate, role, joke, quote){
        this._firstName = firstName;
        this._lastName = lastName;
        this._hireDate = hireDate;
        this._role = role;
        this._joke = joke;
        this._quote = quote;

        // Generated items
        this._id = this.generateId();
     //   this._quote = this.fetchData(quoteURL);
     //   this._joke = this.getJoke(jokeURL);

    }

    toString(){
        return {
            "id" : this._id,
            "firstName" : this._firstName,
            "lastName" : this._lastName,
            "hireDate" : this._hireDate,
            "role" : this._role,
            "joke" : this._joke,
            "quote": this._quote
        }
    }

    getFirstName () {
        return this._firstName;
    }

    getLastName(){
        return this._lastName;
    }

    getHireDate(){
        return this._hireDate;
    }

    getRole(){
        return this._role;
    }

    getQuote(){
        return this._quote;
    }

    generateId(){
        return uniqID.process();
    }


    __getJoke(jokeUrl){
        try{
         //   const jokeObject = this.fetchData(jokeUrl);
            console.log("-----------------------")
            console.log(jokeObject.value);
        } catch (err){
            return "Joke not available";
        }
        return jokeObject.value.joke;
    }

    // async getFunItems(jokeUrl, quoteUrl){
    //     //const http = new HTTP;
    //     // http.get(url)
    //     //     .then(data =>{
    //     //         return data.value.joke;
    //     //     })
    //     //     .catch( err => console.log(err));

    //     // Get Joke
    //     const jokeResponse = await fetch(jokeUrl);
    //     const data = await jokeResponse.json();
    //      console.log(data);
           
    // }


}

module.exports = Employee;

