// npm i babel-register -D
// npm i eslint -D

//es5
/*function Team(name) { // ~ctor
    this.players = []; // fields
    this.teamName = name;
}

Team.prototype.addPlayer = function (player) { //method
    this.player.push(player);
};

Team.prototype.changeName=function(name){
    this.teamName = name;
};

//es6
class team {
    constructor(){
        this.players = []; // fields
        this.teamName = name;
    }

    addPlayer(player) { //method
        this.player.push(player);
    }

    changeName(name){
        this.teamName = name;
    }
}*/
function ShoppingBasket() {
    this.products = new Map();
    this.totalSumm = 0;
}

ShoppingBasket.prototype.AddProduct = function (product, count) {
    this.products.set(product, count);
    this.totalSumm += (product.price * count);
};

ShoppingBasket.prototype.DeleteProduct = function (product) {

    if (this.products.has(product)) {
        this.totalSumm -= (product.price * this.products.get(product));
        this.products.delete(product);
    }
};

ShoppingBasket.prototype.changeCountOfProduct = function (product, count) {
    this.products.set(product, count);
};

function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Coupon(summ, persent, product) {
    this.discountSumm = summ;
    this.discountPersent = persent;
    this.productForDiscount = product;
}

export {
    ShoppingBasket,
    Product,
    Coupon
};