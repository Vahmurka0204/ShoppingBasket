function ShoppingBasket() {
    this.products = new Map();
    this.totalSumm = 0;
    this.undoArray = [];
    this.redoArray = [];
    this.Coupon=null;
}

ShoppingBasket.prototype.AddProduct = function (product, count) {
    add(this, product, count);
    this.undoArray.push({
        action: "Add",
        item: product,
        count: count
    });
    this.redoArray.splice(0, this.redoArray.length);
};

ShoppingBasket.prototype.DeleteProduct = function (product) {
    if (this.products.has(product)) {
        this.undoArray.push({
            action: "Delete",
            item: product,
            count: this.products.get(product).count
        });
        deleteP(this, product);
    }
    this.redoArray.splice(0, this.redoArray.length);
};

ShoppingBasket.prototype.ChangeCountOfProduct = function (product, count) {
    if (count > 0 && this.products.has(product)) {
        this.undoArray.push({
            action: "Change",
            item: product,
            count: this.products.get(product).count
        });
        this.totalSumm -= this.products.get(product).subSum;
        add(this, product, count);
    }
    this.redoArray.splice(0, this.redoArray.length);
};

ShoppingBasket.prototype.UseCoupon = function (coupon, product = "basket") {
    useCoupon(this, coupon, product);
    this.redoArray.splice(0, this.redoArray.length);
};
ShoppingBasket.prototype.couponCancellation = function (product = "basket") {
    if (product === "basket" && !!this.Coupon) {
        let summ = 0;
        this.products.forEach(function (prod) {
            summ += prod.subSum;
        });
        this.totalSumm = summ;
    } else if (this.products.has(product) && !!this.Coupon) {
        this.products.get(product).subSum = product.price * this.products.get(product).count;
    } else {
        throw new Error("Coupon cannot be cancelled");
    }
    this.Coupon=null;
};
ShoppingBasket.prototype.Undo = function () {
    if (this.undoArray.length > 0) {
        var command = this.undoArray.pop();
        switch (command.action) {
            case "Add":
                deleteP(this, command.item);
                this.redoArray.push(command);
                break;
            case "Delete":
                add(this, command.item, command.count);
                this.redoArray.push(command);
                break;
            case "Change":
                this.redoArray.push({
                    action: "Change",
                    item: command.item,
                    count: this.products.get(command.item).count
                });
                this.totalSumm -= this.products.get(product).subSum;
                add(this, product, count);
                break;
            case "UseCoupon":
                this.redoArray.push(command);
                this.couponCancellation(command.item);
                break;
            default:
                this.undoArray.push(command);
                throw new Error("");

        }
    }

};
ShoppingBasket.prototype.Redo = function () {
    if (this.redoArray.length > 0) {
        var command = this.redoArray.pop();
        switch (command.action) {
            case "Delete":
                deleteP(command.item);
                this.undoArray.push(command);
                break;
            case "Add":
                add(this, product, count);
                this.undoArray.push(command);
                break;
            case "Change":
                this.undoArray.push({
                    action: "Change",
                    item: product,
                    count: this.products.get(product).count
                });
                this.totalSumm -= this.products.get(product).subSum;
                add(this, product, count);
                break;
            case "UseCoupon":
                useCoupon(this, command.coupon, command.item);
                this.undoArray.push(command);
                break;
            default:
                this.redoArray.push(command);
                throw new Error("");

        }
    }
};
ShoppingBasket.prototype.PrintCheck = function () {
    var check = "";
    var number = 0;
    for (var [prod, value] of this.products) {

        check += `${++number}. ${prod.name}  ${value.count}  ${value.subSum.toFixed(2)}\n`;

    };
    if (!!this.Coupon) {
        check += "The coupon is applied.\n";
    }
    check += `Total: ${this.totalSumm.toFixed(2)}`;
    return check;
};

function useCoupon(basket, coupon, product) {
    switch (coupon.typeOfCoupon) {
        case "money":
            if (product === "basket" && !basket.Coupon) {
                basket.totalSumm -= coupon.discountAmount;
                if (basket.totalSumm < 0)
                    basket.totalSumm = 0;
            } else if (basket.products.has(product) && !basket.Coupon) {
                basket.totalSumm -= basket.products.get(product).subSum;
                basket.products.get(product).subSum -= coupon.discountAmount;
                if (basket.products.get(product).subSum < 0)
                    basket.products.get(product).subSum = 0;
                basket.totalSumm += basket.products.get(product).subSum;
            }
            break;
        case "persent":
            if (product === "basket" && !basket.Coupon) {
                basket.totalSumm *= (1 - (coupon.discountAmount / 100));
            } else if (basket.products.has(product) && !basket.Coupon) {
                basket.totalSumm -= basket.products.get(product).subSum;
                basket.products.get(product).subSum *= (1 - (coupon.discountAmount / 100));
                basket.totalSumm += basket.products.get(product).subSum;
            }
            break;
    }
    basket.undoArray.push({
        action: "UseCoupon",
        item: product,
        coupon
    });
    basket.Coupon={item:product,coupon};
}

function deleteP(basket, product) {
    basket.totalSumm -= basket.products.get(product).subSum;
    basket.products.delete(product);
}

function add(basket, product, count) {
    basket.products.set(product, {
        count: count,
        subSum: count * product.price
    });
    basket.totalSumm += product.price * count;
}

function Product(name, price) {
    if (name.length > 0 && price > 0) {
        this.name = name;
        this.price = price;
    }
}

function Coupon(typeName, discountAmount) {
    if (typeName.toLowerCase() === "money" && discountAmount > 0) {
        this.typeOfCoupon = typeName.toLowerCase();
        this.discountAmount = discountAmount;
    } else if (typeName.toLowerCase() === "persent" && discountAmount > 0 && discountAmount <= 100) {
        this.typeOfCoupon = typeName.toLowerCase();
        this.discountAmount = discountAmount;
    } else {
        throw new Error("Right coupon types is 'Money' or 'Persent'. Choose one of them. The discount percentage should be from zero to one hundred percent.");
    }
}

export {
    ShoppingBasket,
    Product,
    Coupon
};