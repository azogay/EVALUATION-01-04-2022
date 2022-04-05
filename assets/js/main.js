/** Declarations */

class Product {
    product_id;
    name;
    unit_price;
}

class OrderItem {
    product_id = '';
    quantity = 0;
    
    unit_price = 0;
    constructor(product_id, quantity, unit_price) {
        this.product_id = product_id;
        this.quantity = quantity;
        
        
        this.unit_price = unit_price;
    }
    getTotalPrice() {
        return this.quantity * this.unit_price;
    }
}

class UserDetails {
    userId = '';
    fullName = '';
    browser = navigator.appCodeName + ' _ ' + navigator.appVersion;
    language = navigator.language;
    firstConnection;
    lastConnection = new Date();
    ipAddress = '';
}

class ShoppingCart {
    userId;
    items = [];

    constructor(user, items = []) {
        this.userId = user;
        this.items = items;
    }

    addItem(orderItem) {
        this.items.push(orderItem);
    }

    removeItem(itemId) {
        const indexItem = this.items.findIndex(p => p.product_id == itemId);
        if (indexItem >= 0) {
            this.items.splice(indexItem, 1);
        }
    }

    replaceItem(orderItem) {
        const indexItem = this.items.findIndex(p => p.product_id == orderItem.product_id);
        if (indexItem >= 0) {
            this.items[indexItem] = orderItem;
        }
    }

    getTotalPrice() {
        let total_price = 0;
        for (const item of this.items) {
            total_price += item.quantity * item.unit_price;
        }
        return total_price;
    }

    getTotalItems() {
        return this.items.length;
    }

    getItem(itemId) {
        return this.items.find(p => p.product_id == itemId);
    }

    clearItems() {
        this.items = [];
    }
}

// fin déclaration

// functions
function addItemToCart(product_id, quantity) {
    let shopping_cart = loadShoppingCarte();
    const existing_item = shopping_cart.getItem(product_id);
    if (existing_item) {
        existing_item.quantity += quantity;
        shopping_cart.replaceItem(existing_item);
    } else {
        const order_item = getProductDetails(product_id);
        order_item.quantity = quantity;
        shopping_cart.addItem(order_item);
    }
    saveShoppingCarte(shopping_cart);
}


function removeItemFromCart(product_id) {
    let shopping_cart = loadShoppingCarte();
    shopping_cart.removeItem(product_id);
    saveShoppingCarte(shopping_cart);
}

function updateOrderItem(order_item) {
    let shopping_cart = loadShoppingCarte();
    shopping_cart.replaceItem(order_item);
    saveShoppingCarte(shopping_cart);
}

function updateItemQuantity(product_id, quantity) {
    let shopping_cart = loadShoppingCarte();
    let item = shopping_cart.getItem(product_id);
    if (item) {
        item.quantity = quantity;
        shopping_cart.replaceItem(item);
        saveShoppingCarte(shopping_cart);
    }
}

function saveShoppingCarte(shopping_cart) {
    document.cookie = "shoppingCart=" + JSON.stringify(shopping_cart) + ";";
}

function saveUserDetails(user_details) {
    document.cookie = "userDetails=" + JSON.stringify(user_details) + ";";
}

function loadShoppingCarte() {
    let shopping_cart_from_cookies = getCookie('shoppingCart');
    if (shopping_cart_from_cookies) {
        shopping_cart_from_cookies = JSON.parse(shopping_cart_from_cookies);
        return new ShoppingCart('', shopping_cart_from_cookies.items);
    } else {
        return new ShoppingCart();
    }
}





function loadProductsDataSet() {
    return fetch("/assets/dataset/products.json")
        .then(response => response.json())
        .then(json => {
            return json;
        });
}

function getProductDetails(product_id) {
    return products_list.find(p => p.product_id == product_id);
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
}

function showHideElement(idHtml) {
    if (document.getElementById(idHtml).style.visibility == 'visible') {
        document.getElementById(idHtml).style.visibility = 'hidden';
    } else {
        document.getElementById(idHtml).style.visibility = 'visible';
    }
}

//fin functions


//clearShoppingCart();
var shopping_cart = new ShoppingCart();
var products_list = [];

$(document).ready(function () {

    async function loadCartDataTable() {
        products_list = await loadProductsDataSet();
        var datatableSet = [];
        for (let item of shopping_cart.items) {
            datatableSet.push([item.product_id, getProductDetails(item.product_id).name, item.unit_price, item.quantity, item.unit_price * item.quantity]);
        }

        $('#table_cart').DataTable({
            data: datatableSet,
            columns: [{
                "data": "imageUrl",
                "render": function (data, type, row) {
                    return '<img src="assets/images/produit/' + row[0] + '.jpg" class="shop_thumbnail" width="145" height="145" />';
                }
            },
            {
                title: "Product"
            },
            {
                title: "Price"
            },
            {
                title: "Quantity"
            }
            ],
            searching: false,
            paging: false,
            info: false,
            ordering: false
        });
    }

    shopping_cart = loadShoppingCarte();
    loadCartDataTable();
    $('#cart_total_price').text("$" + shopping_cart.getTotalPrice());
    $('#cart_nbr_items').text("" + shopping_cart.getTotalItems());
    $('#cart_nbr_items_2').text("$" + shopping_cart.getTotalItems());
});