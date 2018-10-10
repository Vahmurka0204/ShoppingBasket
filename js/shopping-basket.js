function ShoppingBasket() {
    this.products = new Map();
    this.totalSumm = 0;
    this.canCouponBeUsed = true;
    this.undoArray = [];
    this.redoArray = [];
}

ShoppingBasket.prototype.AddProduct = function (product, count) {
    add(this, product, count);
    this.undoArray.push({
        action: "Add",
        item: product,
        count: count

    });
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
};

ShoppingBasket.prototype.changeCountOfProduct = function (product, count) {
    if (count > 0 && this.products.has(product)) {
        this.undoArray.push({
            action: "Change",
            item: product,
            count: this.products.get(product).count
        });
        this.totalSumm -= this.products.get(product).subSum;
        add(this, product, count);
    }

};

ShoppingBasket.prototype.UseCoupon = function (coupon, product = "basket") {
    switch (coupon.typeOfCoupon) {
        case "money":
            if (product === "basket" && this.canCouponBeUsed) {
                this.totalSumm -= coupon.discountAmount;
                this.canCouponBeUsed = false;
                if (this.totalSumm < 0)
                    this.totalSumm = 0;
            } else if (this.products.has(product) && this.canCouponBeUsed) {
                this.totalSumm -= this.products.get(product).subSum;
                this.products.get(product).subSum -= coupon.discountAmount;
                this.canCouponBeUsed = false;
                if (this.products.get(product).subSum < 0)
                    this.products.get(product).subSum = 0;
                this.totalSumm += this.products.get(product).subSum;
            }
            break;
        case "persent":
            if (product === "basket" && this.canCouponBeUsed) {
                this.totalSumm *= (1 - (coupon.discountAmount / 100));
                this.canCouponBeUsed = false;
            } else if (this.products.has(product) && this.canCouponBeUsed) {
                this.totalSumm -= this.products.get(product).subSum;
                this.products.get(product).subSum *= (1 - (coupon.discountAmount / 100));
                this.canCouponBeUsed = false;
                this.totalSumm += this.products.get(product).subSum;
            }
            break;
        default:
            ;

    }
    this.undoArray.push({
        action: "UseCoupon",
        item: product,
        coupon
    });

};
ShoppingBasket.prototype.couponCancellation = function (coupon, product = "basket") {
    if (product === "basket" && !this.canCouponBeUsed) {
        let summ = 0;
        this.products.forEach(function (prod) {
            summ += prod.subSum;
        });
        this.totalSumm = summ;
        this.canCouponBeUsed = true;
    } else if (this.products.has(product) && !this.canCouponBeUsed) {
        this.products.get(product).subSum = product.price * this.products.get(product).count;
        this.canCouponBeUsed = true;
    } else {
        throw new Error("Coupon cannot be cancelled");
    }

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
                this.changeCountOfProduct(command.item, command.count);
                break;
            case "UseCoupon":
                this.redoArray.push(command);
                this.couponCancellation(command.coupon, command.item);
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
                this.DeleteProduct(command.item);
                break;
            case "Add":
                this.AddProduct(command.item, command.count);
                break;
            case "Change":
                this.changeCountOfProduct(command.item, command.count);
                break;
            case "UseCoupon":
                this.UseCoupon(command.coupon, command.item);
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
    if (!this.canCouponBeUsed) {
        check += "The coupon is applied.\n";
    }
    check += `Total: ${this.totalSumm.toFixed(2)}`;
    return check;
};

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