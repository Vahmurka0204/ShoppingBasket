function ShoppingBasket() {
    this.statesOfBasket = [{
        products: new Map(),
        Coupon: {
            coupon: null,
            product: null
        }
    }];
    this.cursor = 1;
    this.Total = 0;
}

ShoppingBasket.prototype.AddProduct = function (product, count) {
    removeOldStates(this);
    var basket = getLastState(this);
    basket.products.set(product, {
        count: count,
        subSum: count * product.price
    });
    this.statesOfBasket.push(basket);
    this.cursor++;
};

ShoppingBasket.prototype.DeleteProduct = function (product) {
    removeOldStates(this);
    var basket = getLastState(this);
    if (basket.products.has(product)) {
        basket.products.delete(product);
    }
    this.statesOfBasket.push(basket);
    this.cursor++;
};

ShoppingBasket.prototype.ChangeCountOfProduct = function (product, count) {
    var basket = getLastState(this);
    removeOldStates(this);
    if (count > 0 && basket.products.has(product)) {
        basket.products.set(product, {
            count: count,
            subSum: count * product.price
        });
        this.statesOfBasket.push(basket);
        this.cursor++;
    } else {
        throw new Error("Try another product or its count");
    }
};

ShoppingBasket.prototype.UseCoupon = function (coupon, product = {
    name: "basket"
}) {
    removeOldStates(this);
    var basket = getLastState(this);
    if (product.name === "basket" || basket.products.has(product)) {
        basket.Coupon = {
            coupon,
            product
        };
        this.statesOfBasket.push(basket);
        this.cursor++;
    }

};
ShoppingBasket.prototype.Undo = function () {
    if (this.statesOfBasket.length > 1 && this.cursor > 1) {
        this.cursor--;
    }
};
ShoppingBasket.prototype.Redo = function () {
    if (this.cursor < this.statesOfBasket.length) {
        this.cursor++;
    }
};
ShoppingBasket.prototype.PrintCheck = function () {
    var check = "";
    var number = 0;
    var basket = getLastState(this);
    basket.totalSumm = getTotal(basket);
    if (!!basket.Coupon.coupon && (basket.Coupon.product.name==="basket"|| basket.products.has(basket.Coupon.product))) {
        useCoupon(basket, basket.Coupon.coupon, basket.Coupon.product);
        check += `The coupon is applied to ${basket.Coupon.product.name}. Discount amount is ${basket.Coupon.coupon.discountAmount}${basket.Coupon.coupon.typeOfCoupon==="money"? "$": "%"}\n`;
    }
    for (var [prod, value] of basket.products) {
        check += `${++number}. ${prod.name}  ${value.count}  ${value.subSum.toFixed(2)}\n`;
    };
    check += `Total: ${ basket.totalSumm.toFixed(2)}`;
    return check;
};

function removeOldStates(basket) {
    if (basket.cursor !== basket.statesOfBasket.length) {
        basket.statesOfBasket.splice(basket.cursor, basket.statesOfBasket.length - basket.cursor);
    }
}

function useCoupon(basket, coupon, product) {
    switch (coupon.typeOfCoupon) {
        case "money":
            if (product.name === "basket") {
                basket.totalSumm -= coupon.discountAmount;
                if (basket.totalSumm < 0)
                    basket.totalSumm = 0;
            } else  {
                basket.totalSumm -= basket.products.get(product).subSum;
                basket.products.get(product).subSum -= coupon.discountAmount;
                if (basket.products.get(product).subSum < 0)
                    basket.products.get(product).subSum = 0;
                basket.totalSumm += basket.products.get(product).subSum;
            }
            break;
        case "persent":
            if (product.name === "basket") {
                basket.totalSumm *= (1 - (coupon.discountAmount / 100));
            } else {
                basket.totalSumm -= basket.products.get(product).subSum;
                basket.products.get(product).subSum *= (1 - (coupon.discountAmount / 100));
                basket.totalSumm += basket.products.get(product).subSum;
            }
            break;
    }
}

function Product(name, price) {
    if (name.length > 0 && price > 0 && name!="basket") {
        this.name = name;
        this.price = price;
    }
}

function Coupon(typeName, discountAmount) {
    if (!!typeName && !!discountAmount) {
        if (typeName.toLowerCase() === "money" && discountAmount > 0) {
            this.typeOfCoupon = typeName.toLowerCase();
            this.discountAmount = discountAmount;
        } else if (typeName.toLowerCase() === "persent" && discountAmount > 0 && discountAmount <= 100) {
            this.typeOfCoupon = typeName.toLowerCase();
            this.discountAmount = discountAmount;
        } else {
            throw new Error("Right coupon types is 'Money' or 'Persent'. Choose one of them. The discount percentage should be from zero to one hundred percent.");
        }
    } else {
        throw new Error("Fill coupon's parameter");
    }
}

function getLastState(basket) {
    var lastState = basket.statesOfBasket[basket.cursor - 1];
    var Copy = {};
    Copy.products = new Map();

    Copy.Coupon = {
        coupon: lastState.Coupon.coupon,
        product: lastState.Coupon.product
    };

    for (var [prod, value] of lastState.products) {
        Copy.products.set(prod, {
            count: value.count,
            subSum: value.subSum
        });
    }
    return Copy;
}

function getTotal(basket) {
    var Total = 0;
    for (var value of basket.products.values()) {
        Total += value.subSum;
    }
    return Total;
}
export {
    ShoppingBasket,
    Product,
    Coupon
};