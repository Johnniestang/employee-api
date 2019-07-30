
const uniqID = require('uniqid');

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

    toJSON(){
        return{
            "id" : this._id,
            "firstName" : this._firstName,
            "lastName" : this._lastName,
            "hireDate" : this._hireDate,
            "role" : this._role,
            "joke" : this._joke,
            "quote": this._quote
        }
    }

    
    generateId(){
        return uniqID.process();
    }


    update(person){
        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.hireDate = person.hireDate;
        this.role = person.role;
    }

    // Getters
    get firstName () {
        return this._firstName;
    }

    get lastName(){
        return this._lastName;
    }

    get hireDate(){
        return this._hireDate;
    }

    get role(){
        return this._role;
    }

    get quote(){
        return this._quote;
    }

    get joke(){
        return this._joke;
    }

    get id(){
        return this._id;
    }


    // Setters
    set firstName (firstName) {
        this._firstName = firstName;
    }

    set lastName(lastName){
        this._lastName = lastName;
    }

    set hireDate(hireDate){
        this._hireDate = hireDate;
    }

    set role(role){
        this._role = role;
    }



}

module.exports = Employee;

