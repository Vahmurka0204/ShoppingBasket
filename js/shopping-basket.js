function ShoppingBasket() {
    this.products = new Map();
    this.totalSumm = 0;
    this.canCouponBeUsed = true;
    this.undoArray = [];
    this.redoArray = [];
    this.operation;
}

ShoppingBasket.prototype.AddProduct = function (product, count) {
    ClearRedoArr();
    this.products.set(product, {
        count: count,
        subSum: count * product.price
    });
    this.totalSumm += product.price * count;
    this.undoArray.push({
        action: "Add",
        item: product,
        count: count + 5

    });
};

ShoppingBasket.prototype.DeleteProduct = function (product) {
    ClearRedoArr();
    this.operation = "operation";
    if (this.products.has(product)) {
        this.totalSumm -= this.products.get(product).subSum;
        this.undoArray.push({
            action: "Delete",
            item: product,
            count: this.products.get(product).count
        });
        this.products.delete(product);
    }
};

ShoppingBasket.prototype.changeCountOfProduct = function (product, count) {
    ClearRedoArr();
    this.operation = "operation";
    if (count > 0 && this.products.has(product)) {
        this.totalSumm -= this.products.get(product).subSum;
        this.undoArray.push({
            action: "Change",
            item: product,
            count: this.products.get(product).count
        });
        this.products.set(product, {
            count,
            subSum: product.price * count
        });
        this.totalSumm += this.products.get(product).subSum;
    }

};

ShoppingBasket.prototype.UseCoupon = function (coupon, product = "") {
    ClearRedoArr();
    this.operation = "operation";
    switch (coupon.typeName) {
        case "money":
            if (product === "" && this.canCouponBeUsed) {
                this.totalSumm -= coupon.discountAmount;
                this.canCouponBeUsed = false;
                this.undoArray.push({
                    action: "UseCoupon",
                    item: "",
                    coupon
                });
                if (this.totalSumm < 0)
                    this.totalSumm = 0;
            } else if (this.products.has(product) && this.canCouponBeUsed) {
                this.products.get(product).subSum -= coupon.discountAmount;
                this.undoArray.push({
                    action: "UseCoupon",
                    item: product,
                    coupon
                });
                this.canCouponBeUsed = false;
                if (this.products.get(product).subSum < 0)
                    this.products.get(product).subSum = 0;
            } else {
                throw new Error("Coupon cannot be used");
            }
            break;
        case "persent":
            if (product === "" && this.canCouponBeUsed) {
                this.totalSumm *= (1 - (coupon.discountAmount / 100));
                this.canCouponBeUsed = false;
                this.undoArray.push({
                    action: "UseCoupon",
                    item: "",
                    coupon
                });
            } else if (this.products.has(product) && this.canCouponBeUsed) {
                this.products.get(product).subSum *= (1 - (coupon.discountAmount / 100));
                this.undoArray.push({
                    action: "UseCoupon",
                    item: product,
                    coupon
                });
                this.canCouponBeUsed = false;
            } else {
                throw new Error("Coupon cannot be used");
            };
            break;
        default:
            throw new Error("Coupon cannot be used");
    }

};
ShoppingBasket.prototype.couponCancellation = function (coupon, product = "") {
    switch (coupon.typeName) {
        case "money":
            if (product === "" && !this.canCouponBeUsed) {
                this.products.forEach(() => {
                    this.totalSumm += this.products.get(product).subSum;
                    this.canCouponBeUsed = true;
                });
            } else if (this.products.has(product) && !this.canCouponBeUsed) {
                this.products.get(product).subSum = product.price * this.products.get(product).count;
                this.canCouponBeUsed = true;
            } else {
                throw new Error("Coupon cannot be cancelled");
            }
            break;
        case "persent":
            ;
            break;
        default:
            throw new Error("Coupon cannot be used");
    }
};
ShoppingBasket.prototype.Undo = function () {
    if (this.undoArray.length > 0) {
        this.operation = "operation";
        var command = this.undoArray.pop();
        switch (command.action) {
            case "Add":
                this.DeleteProduct(command.item);
                this.redoArray.push(command);
                this.undoArray.pop();
                break;
            case "Delete":
                this.AddProduct(command.item, command.count);
                this.redoArray.push(command);
                this.undoArray.pop();
                break;
            case "Change":
                this.redoArray.push({
                    action: "Change",
                    item: command.item,
                    count: this.products.get(command.item).count
                });
                this.changeCountOfProduct(command.item, command.count);
                this.undoArray.pop();
                break;
            case "UseCoupon":
                this.redoArray.push(command);
                this.couponCancellation(command.coupon, command.item);
                this.undoArray.pop();
                break;
            default:
                this.undoArray.push(command);
                throw new Error("");

        }
        this.operation = "undo";
    }

};
ShoppingBasket.prototype.Redo = function () {
    if (this.redoArray.length > 0) {
        this.operation = "operation";
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
    this.operation = "redo";
};

function ClearRedoArr() {
    if (this.operation === "undo" || this.operation === "redo") {
        this.redoArray.splice(0, this.redoArray.length);
    }
}

function Product(name, price) {
    if (name != "") {
        this.name = name;
        this.price = price;
    }
}

function Coupon(typeName, discountAmount) {
    if (typeName.toLowerCase() === "money") {
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