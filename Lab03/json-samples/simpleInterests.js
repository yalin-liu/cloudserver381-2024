/*
function SimpleInterests() {
	this.principal = p;
	this.rate = r;
	this.period = t;
	this.interests = this.principal * this.rate * this.period;
}
*/
const principal = 1000000;
const rate = 0.01;
const period = 10;

class SimpleInterests {
	constructor(p = principal,r = rate,t = period) { // default parameter values
		this.principal = p;
		this.rate = r;
		this.period = t;
		this.interests = this.principal * this.rate * this.period;
	}

	toString() {
		return(`Interests for $${this.principal} at an annual rate of \
${this.rate *100}% for ${this.period} years = $${this.interests}`);
	}
}

let obj1 = new SimpleInterests();
console.log(obj1.toString());

let obj2 = new SimpleInterests(10000);
console.log(obj2);

let obj3 = new SimpleInterests(10000,0.03);
console.log(obj3);

let obj4 = new SimpleInterests(10000,0.03,10);
console.log(obj4);

let obj5 = new SimpleInterests(10000,undefined,10);
console.log(obj5);

class Xinterests extends SimpleInterests {
	constructor(p = principal, r = rate, t = period, discount = 0.05) {
		super(p,r,t);
		this.discount = 0.05;
		this.interests *= 1 - this.discount;
	}
}

let obj6 = new Xinterests();
console.log(obj6);