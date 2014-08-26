﻿//Controls
var addButton = $("#AddButton");
var amountTextBox = $("#AmountTextBox");
var attachmentLabel = $("#AttachmentLabel");
var cashRepositoryDropDownList = $("#CashRepositoryDropDownList");
var cashRepositoryBalanceTextBox = $("#CashRepositoryBalanceTextBox");
var costCenterDropDownList = $("#CostCenterDropDownList");

var dateTextBox = $("#DateTextBox");
var discountTextBox = $("#DiscountTextBox");

var errorLabel = $("#ErrorLabel");
var errorLabelBottom = $("#ErrorLabelBottom");
var errorLabelTop = $("#ErrorLabelTop");

var grandTotalTextBox = $("#GrandTotalTextBox");

var itemCodeHidden = $("#ItemCodeHidden");
var itemCodeTextBox = $("#ItemCodeTextBox");
var itemIdHidden = $("#ItemIdHidden");
var itemDropDownList = $("#ItemDropDownList");

var partyIdHidden = $("#PartyIdHidden");
var partyDropDownList = $("#PartyDropDownList");
var partyCodeHidden = $("#PartyCodeHidden");
var partyCodeTextBox = $("#PartyCodeTextBox");
var productGridView = $("#ProductGridView");
var productGridViewDataHidden = $("#ProductGridViewDataHidden");
var priceTextBox = $("#PriceTextBox");
var priceTypeDropDownList = $("#PriceTypeDropDownList");
var priceTypeIdHidden = $("#PriceTypeIdHidden");

var quantityTextBox = $("#QuantityTextBox");

var runningTotalTextBox = $("#RunningTotalTextBox");
var referenceNumberTextBox = $("#ReferenceNumberTextBox");

var saveButton = $("#SaveButton");

var salesPersonDropDownList = $("#SalespersonDropDownList");

var shippingAddressCodeHidden = $("#ShippingAddressCodeHidden");
var shippingAddressDropDownList = $("#ShippingAddressDropDownList");
var shippingAddressTextBox = $("#ShippingAddressTextBox");
var shippingChargeTextBox = $("#ShippingChargeTextBox");
var shippingCompanyDropDownList = $("#ShippingCompanyDropDownList");
var statementReferenceTextBox = $("#StatementReferenceTextBox");
var storeDropDownList = $("#StoreDropDownList");
var subTotalTextBox = $("#SubtotalTextBox");

var taxRateTextBox = $("#TaxRateTextBox");
var taxTotalTextBox = $("#TaxTotalTextBox");
var taxTextBox = $("#TaxTextBox");
var totalTextBox = $("#TotalTextBox");
var tranIdCollectionHiddenField = $("#TranIdCollectionHiddenField");
var transactionTypeRadioButtonList = $("#TransactionTypeRadioButtonList");

var unitIdHidden = $("#UnitIdHidden");
var unitDropDownList = $("#UnitDropDownList");
var unitNameHidden = $("#UnitNameHidden");



//Variables
var agentId;
var attachments;

var cashRepositoryId;
var costCenterId;

var data;

var isCredit = false;

var partyCode;
var priceTypeId;

var referenceNumber;

var shippingAddressCode;
var shipperId;
var shippingCharge;
var statementReference;
var storeId;

var transactionIds;
var transactionType;

var url;

var valueDate;


//Page Load Event
$(document).ready(function () {
    $(".form-table td").each(function () {
        var content = $(this).html();
        if (!content.trim()) {
            $(this).html("");
            $(this).hide();
        }
    });

    addShortcuts();
    initializeAjaxData();
    fadeThis("#info-panel");
});

function initializeAjaxData() {

    processCallBackActions();
    loadPriceTypes();

    loadParties();

    partyDropDownList.change(function () {
        partyCodeTextBox.val(partyDropDownList.getSelectedValue());
        partyCodeHidden.val(partyDropDownList.getSelectedValue());
        showShippingAddress();
        loadAddresses();
    });

    loadAddresses();

    loadItems();

    itemDropDownList.blur(function () {
        itemDropDownList_OnBlur();
    });

    loadUnits();


    loadCostCenters();
    loadStores();
    loadCashRepositories();
    loadAgents();
    loadShippers();

    restoreData();
};


itemDropDownList.keydown(function (event) {
    if (event.ctrlKey) {
        if (event.key == "Enter") {
            itemDropDownList_OnBlur();
            focusNextElement();

            //Swallow the key combination on the document level.
            return false;
        };
    };

    return true;
});

function itemDropDownList_OnBlur() {
    itemCodeTextBox.val(itemDropDownList.getSelectedValue());
    itemCodeHidden.val(itemDropDownList.getSelectedValue());
    loadUnits();
    getPrice();
};


function processCallBackActions() {
    var itemId = parseFloat2(itemIdHidden.val());

    itemIdHidden.val("");

    var itemCode = "";

    if (itemId > 0) {

        url = "/Services/ItemData.asmx/GetItemCodeByItemId";
        data = appendParameter("", "itemId", itemId);
        data = getData(data);

        var itemCodeAjax = getAjax(url, data);

        itemCodeAjax.success(function (msg) {
            itemCode = msg.d;
            itemCodeHidden.val(itemCode);
        });

        itemCodeAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            logError(err, "error");
        });
    }

    var partyId = parseFloat2(partyIdHidden.val());

    partyIdHidden.val("");

    var partyCode = "";

    if (partyId > 0) {
        url = "/Services/PartyData.asmx/GetPartyCodeByPartyId";
        data = appendParameter("", "partyId", partyId);
        data = getData(data);

        var partyCodeAjax = getAjax(url, data);

        partyCodeAjax.success(function (msg) {
            partyCode = msg.d;
            partyCodeHidden.val(partyCode);
        });

        partyCodeAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            logError(err, "error");
        });
    }
};




//Control Events

addButton.click(function () {
    updateTax();
    calculateAmount();
    addRow();
});

amountTextBox.blur(function () {
    updateTax();
    calculateAmount();
});

attachmentLabel.click(function () {
    $('#attachment').show(500).after(function () {
        repaint();
    });
});


cashRepositoryDropDownList.change(function () {
    if (cashRepositoryDropDownList.getSelectedValue()) {

        url = "/Services/AccountData.asmx/GetCashRepositoryBalance";
        data = appendParameter("", "cashRepositoryId", cashRepositoryDropDownList.getSelectedValue());
        data = getData(data);

        var repoBalanceAjax = getAjax(url, data);

        repoBalanceAjax.success(function (msg) {
            cashRepositoryBalanceTextBox.val(msg.d);

        });

        repoBalanceAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            logError(err, "error");
        });
    };
});

discountTextBox.blur(function () {
    updateTax();
    calculateAmount();
});

itemCodeTextBox.blur(function () {
    selectDropDownListByValue(this.id, 'ItemDropDownList');
});



partyCodeTextBox.blur(function () {
    selectDropDownListByValue(this.id, 'PartyDropDownList');
});

priceTextBox.blur(function () {
    updateTax();
    calculateAmount();
});

quantityTextBox.blur(function () {
    updateTax();
    calculateAmount();
});

//Todo:Need to support localized dates
function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
}


var validateProductControl = function () {
    valueDate = dateTextBox.val();
    errorLabelBottom.html("");

    removeDirty(dateTextBox);
    removeDirty(partyCodeTextBox);
    removeDirty(partyDropDownList);
    removeDirty(priceTypeDropDownList);
    removeDirty(storeDropDownList);
    removeDirty(shippingCompanyDropDownList);
    removeDirty(cashRepositoryDropDownList);
    removeDirty(costCenterDropDownList);
    removeDirty(salesPersonDropDownList);

    transactionType = transactionTypeRadioButtonList.find("input:checked").val();

    if (transactionType) {
        isCredit = (transactionType.toLowerCase() == "credit");
    };

    if (!isDate(valueDate)) {
        makeDirty(dateTextBox);
        errorLabelBottom.html(invalidDateWarningLocalized);
        return false;
    };

    if (storeDropDownList.length) {
        if (parseFloat2(storeDropDownList.getSelectedValue()) <= 0) {
            makeDirty(storeDropDownList);
            errorLabelBottom.html(invalidStoreWarningLocalized);
            return false;
        };
    };

    if (isNullOrWhiteSpace(partyCodeTextBox.val())) {
        errorLabelBottom.html(invalidPartyWarningLocalized);
        makeDirty(partyCodeTextBox);
        makeDirty(partyDropDownList);
        return false;
    };

    if (priceTypeDropDownList.length) {
        if (parseFloat2(priceTypeDropDownList.getSelectedValue()) <= 0) {
            makeDirty(priceTypeDropDownList);
            errorLabelBottom.html(invalidPriceTypeWarningLocalized);
            return false;
        };
    }


    if (productGridView.find("tr").length == 2) {
        errorLabelBottom.html(gridViewEmptyWarningLocalized);
        return false;
    };

    if (shippingCompanyDropDownList.length) {
        if (parseFloat2(shippingCompanyDropDownList.getSelectedValue()) <= 0) {
            makeDirty(shippingCompanyDropDownList);
            errorLabelBottom.html(invalidShippingCompanyWarningLocalized);
            return false;
        };
    };

    if (cashRepositoryDropDownList.length) {
        if (!isCredit) {
            if (parseFloat2(cashRepositoryDropDownList.getSelectedValue()) <= 0) {
                makeDirty(cashRepositoryDropDownList);
                errorLabelBottom.html(invalidCashRepositoryWarningLocalized);
                return false;
            };
        }
    };


    if (costCenterDropDownList.length) {
        if (parseFloat2(costCenterDropDownList.getSelectedValue()) <= 0) {
            makeDirty(costCenterDropDownList);
            errorLabelBottom.html(invalidCostCenterWarningLocalized);
            return false;
        };
    };

    if (salesPersonDropDownList.length) {
        if (parseFloat2(salesPersonDropDownList.getSelectedValue()) <= 0) {
            makeDirty(salesPersonDropDownList);
            errorLabelBottom.html(invalidSalesPersonWarningLocalized);
            return false;
        };
    };



    updateData(productGridViewDataHidden, productGridView);

    agentId = parseFloat2(salesPersonDropDownList.getSelectedValue());
    attachments = uploadedFilesHidden.val();

    cashRepositoryId = parseFloat2(cashRepositoryDropDownList.getSelectedValue());
    costCenterId = parseFloat2(costCenterDropDownList.getSelectedValue());

    data = productGridViewDataHidden.val();

    partyCode = partyDropDownList.getSelectedValue();
    priceTypeId = parseFloat2(priceTypeDropDownList.getSelectedValue());

    referenceNumber = referenceNumberTextBox.getSelectedValue();

    shippingAddressCode = shippingAddressDropDownList.getSelectedText();
    shipperId = parseFloat2(shippingCompanyDropDownList.getSelectedValue());
    shippingCharge = parseFloat2(shippingChargeTextBox.val());
    statementReference = statementReferenceTextBox.val();
    storeId = parseFloat2(storeDropDownList.getSelectedValue());

    transactionIds = tranIdCollectionHiddenField.val();

    return true;
};

shippingAddressDropDownList.change(function () {
    showShippingAddress();
});

shippingChargeTextBox.blur(function () {
    summate();
});

taxRateTextBox.blur(function () {
    updateTax();
    calculateAmount();
});

taxTextBox.blur(function () {
    calculateAmount();
});

unitDropDownList.change(function () {
    unitNameHidden.val($(this).getSelectedText());
    unitIdHidden.val($(this).getSelectedValue());
});

unitDropDownList.blur(function () {
    getPrice();
});


function bindAddresses(data) {
    shippingAddressDropDownList.bindAjaxData(data);
    shippingAddressDropDownList.val(shippingAddressCodeHidden.val());
};

function bindAgents(data) {
    salesPersonDropDownList.bindAjaxData(data);
};

function bindCashRepositories(data) {
    cashRepositoryDropDownList.bindAjaxData(data);
};

function bindCostCenters(data) {
    costCenterDropDownList.bindAjaxData(data);
};

function bindItems(data) {
    itemDropDownList.bindAjaxData(data);
    itemCodeTextBox.val(itemCodeHidden.val());
    itemDropDownList.val(itemCodeHidden.val());
};

function bindParties(data) {
    partyDropDownList.bindAjaxData(data);
    partyCodeTextBox.val(partyCodeHidden.val());
    partyDropDownList.val(partyCodeHidden.val());
};

function bindPriceTypes(data) {
    priceTypeDropDownList.bindAjaxData(data);
    priceTypeDropDownList.val(priceTypeIdHidden.val());
};

function bindShippers(data) {
    shippingCompanyDropDownList.bindAjaxData(data);
};

function bindStores(data) {
    storeDropDownList.bindAjaxData(data);
};

function bindUnits(data) {
    unitDropDownList.bindAjaxData(data);
    unitDropDownList.val(unitIdHidden.val());
};



function loadAddresses() {
    var partyCode = partyDropDownList.val();

    url = "/Services/PartyData.asmx/GetAddressByPartyCode";
    data = appendParameter("", "partyCode", partyCode);
    data = getData(data);


    var addressAjax = getAjax(url, data);

    addressAjax.success(function (msg) {
        bindAddresses(msg.d);
    });

    addressAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(shippingAddressDropDownList, 0, err.Message);
    });
};

function loadAgents() {
    url = "/Services/ItemData.asmx/GetAgents";
    var agentAjax = getAjax(url);

    agentAjax.success(function (msg) {
        bindAgents(msg.d);
    });

    agentAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(salesPersonDropDownList, 0, err.Message);
    });
};

function loadCashRepositories() {
    url = "/Services/AccountData.asmx/GetCashRepositories";
    var cashRepositoryAjax = getAjax(url);

    cashRepositoryAjax.success(function (msg) {
        bindCashRepositories(msg.d);
    });

    cashRepositoryAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(cashRepositoryDropDownList, 0, err.Message);
    });
};

function loadCostCenters() {
    url = "/Services/AccountData.asmx/GetCostCenters";
    var costCenterAjax = getAjax(url);

    costCenterAjax.success(function (msg) {
        bindCostCenters(msg.d);
    });

    costCenterAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(costCenterDropDownList, 0, err.Message);
    });
};

function loadItems() {
    url = "/Services/ItemData.asmx/GetItems";
    data = appendParameter("", "tranBook", tranBook);
    data = getData(data);

    var itemAjax = getAjax(url, data);

    itemAjax.success(function (msg) {
        bindItems(msg.d);
    });

    itemAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(itemDropDownList, 0, err.Message);
    });
};

function loadParties() {
    url = "/Services/PartyData.asmx/GetParties";
    var partyAjax = getAjax(url);

    partyAjax.success(function (msg) {
        bindParties(msg.d);
    });

    partyAjax.error(function () {
        var err = $.parseJSON(xhr.responseText);
        appendItem(partyDropDownList, 0, err.Message);
    });
};

function loadPriceTypes() {
    if (priceTypeDropDownList.length) {
        url = "/Services/ItemData.asmx/GetPriceTypes";
        var priceTypeAjax = getAjax(url);

        priceTypeAjax.success(function (msg) {
            bindPriceTypes(msg.d);
        });

        priceTypeAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            appendItem(priceTypeDropDownList, 0, err.Message);
        });
    };
};

function loadShippers() {
    if (shippingCompanyDropDownList.length) {
        url = "/Services/ItemData.asmx/GetShippers";

        var shipperAjax = getAjax(url);

        shipperAjax.success(function (msg) {
            bindShippers(msg.d);
        });

        shipperAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            appendItem(shippingCompanyDropDownList, 0, err.Message);
        });

    };
};

function loadStores() {
    if (storeDropDownList.length) {
        url = "/Services/ItemData.asmx/GetStores";
        var storeAjax = getAjax(url);

        storeAjax.success(function (msg) {
            bindStores(msg.d);
        });

        storeAjax.error(function (xhr) {
            var err = $.parseJSON(xhr.responseText);
            appendItem(storeDropDownList, 0, err.Message);
        });
    };
};

function loadUnits() {
    var itemCode = itemCodeHidden.val();

    url = "/Services/ItemData.asmx/GetUnits";
    data = appendParameter("", "itemCode", itemCode);
    data = getData(data);

    var unitAjax = getAjax(url, data);

    unitAjax.success(function (msg) {
        bindUnits(msg.d);
    });

    unitAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        appendItem(unitDropDownList, 0, err.Message);
    });
};



//GridView Data Function

var clearData = function () {
    var grid = productGridView;
    var rows = grid.find("tr:not(:first-child):not(:last-child)");
    rows.remove();
};

var restoreData = function () {

    var sourceControl = productGridViewDataHidden;

    if (isNullOrWhiteSpace(sourceControl.val())) {
        return;
    }

    rowData = JSON.parse(sourceControl.val());

    for (var i = 0; i < rowData.length; i++) {
        var itemCode = rowData[i][0];
        var itemName = rowData[i][1];
        var quantity = parseFloat2(rowData[i][2]);
        var unitName = rowData[i][3];
        var price = parseFloat2(rowData[i][4]);
        var discount = parseFloat2(rowData[i][6]);
        var taxRate = parseFloat2(rowData[i][8]);
        var tax = parseFloat2(rowData[i][9]);

        addRowToTable(itemCode, itemName, quantity, unitName, price, discount, taxRate, tax);
    }
};

var updateData = function (targetControl, grid) {
    var colData = new Array;
    var rowData = new Array;

    var rows = grid.find("tr:not(:first-child):not(:last-child)");

    rows.each(function () {
        var row = $(this);

        colData = new Array();

        row.find("td:not(:last-child)").each(function () {
            colData.push($(this).html());
        });

        rowData.push(colData);
    });

    data = JSON.stringify(rowData);
    targetControl.val(data);
};





//New Row Helper Function
var calculateAmount = function () {

    amountTextBox.val(parseFloat2(quantityTextBox.val()) * parseFloat2(priceTextBox.val()));

    subTotalTextBox.val(parseFloat2(amountTextBox.val()) - parseFloat2(discountTextBox.val()));
    totalTextBox.val(parseFloat2(subTotalTextBox.val()) + parseFloat2(taxTextBox.val()));
};

var updateTax = function () {

    var total = parseFloat2(priceTextBox.val()) * parseFloat2(quantityTextBox.val());
    var subTotal = total - parseFloat2(discountTextBox.val());
    var taxableAmount = total;

    if (taxAfterDiscount.toLowerCase() == "true") {
        taxableAmount = subTotal;
    }

    var tax = (taxableAmount * parseFloat2(parseFormattedNumber(taxRateTextBox.val()))) / 100;

    if (parseFloat2(taxTextBox.val()) == 0) {
        if (tax.toFixed) {
            taxTextBox.val(getFormattedNumber(tax.toFixed(2)));
        } else {
            taxTextBox.val(getFormattedNumber(tax));
        }
    }

    if (parseFloat2(tax).toFixed(2) != parseFloat2(parseFormattedNumber(taxTextBox.val())).toFixed(2)) {
        var question = confirm(localizedUpdateTax);

        if (question) {
            if (tax.toFixed) {
                taxTextBox.val(getFormattedNumber(tax.toFixed(2)));
            } else {
                taxTextBox.val(getFormattedNumber(tax));
            }
        }
    }
};

//GridView Manipulation
var addRow = function () {

    itemCodeTextBox.val(itemDropDownList.getSelectedValue());
    itemCodeHidden.val(itemDropDownList.getSelectedValue());

    var itemCode = itemCodeTextBox.val();
    var itemName = itemDropDownList.getSelectedText();
    var quantity = parseFloat2(quantityTextBox.val());
    var unitId = parseFloat2(unitIdHidden.val());
    var unitName = unitNameHidden.val();
    var price = parseFloat2(priceTextBox.val());
    var discount = parseFloat2(discountTextBox.val());
    var taxRate = parseFloat2(taxRateTextBox.val());
    var tax = parseFloat2(taxTextBox.val());
    var storeId = parseFloat2(storeDropDownList.val());


    if (isNullOrWhiteSpace(itemCode)) {
        makeDirty(itemCodeTextBox);
        return;
    }

    removeDirty(itemCodeTextBox);

    if (quantity < 1) {
        makeDirty(quantityTextBox);
        return;
    }

    removeDirty(quantityTextBox);

    if (price <= 0) {
        makeDirty(priceTextBox);
        return;
    }

    removeDirty(priceTextBox);

    if (discount < 0) {
        makeDirty(discountTextBox);
        return;
    }

    removeDirty(discountTextBox);

    if (discount > (price * quantity)) {
        makeDirty(discountTextBox);
        return;
    }

    removeDirty(discountTextBox);

    if (tax < 0) {
        makeDirty(taxTextBox);
        return;
    }

    removeDirty(taxTextBox);

    var ajaxItemCodeExists = itemCodeExists(itemCode);
    var ajaxUnitNameExists = unitNameExists(unitName);
    var ajaxIsStockItem = isStockItem(itemCode);
    var ajaxCountItemInStock = countItemInStock(itemCode, unitId, storeId);

    ajaxItemCodeExists.done(function (response) {
        var itemCodeExists = response.d;

        if (!itemCodeExists) {
            $.notify(String.format("Item '{0}' does not exist.", itemCode), "error");
            makeDirty(itemCodeTextBox);
            return;
        }


        removeDirty(itemCodeTextBox);


        ajaxUnitNameExists.done(function (ajaxUnitNameExistsResult) {
            var unitNameExists = ajaxUnitNameExistsResult.d;

            if (!unitNameExists) {
                $.notify(String.format("Unit '{0}' does not exist.", unitName), "error");
                makeDirty(unitDropDownList);
                return;
            }

            removeDirty(unitDropDownList);

            if (!verifyStock || !isSales) {
                addRowToTable(itemCode, itemName, quantity, unitName, price, discount, taxRate, tax);
                return;
            }

            ajaxIsStockItem.done(function (ajaxIsStockItemResult) {
                var isStockItem = ajaxIsStockItemResult.d;

                if (!isStockItem) {
                    addRowToTable(itemCode, itemName, quantity, unitName, price, discount, taxRate, tax);
                    return;
                }

                ajaxCountItemInStock.done(function (ajaxCountItemInStockResult) {
                    var itemInStock = parseFloat2(ajaxCountItemInStockResult.d);

                    if (quantity > itemInStock) {
                        makeDirty(quantityTextBox);
                        errorLabel.html(String.format(insufficientStockWarningLocalized, itemInStock, unitName, itemName));
                        return;
                    }

                    addRowToTable(itemCode, itemName, quantity, unitName, price, discount, taxRate, tax);
                });

            });
        });
    });
};

var addRowToTable = function (itemCode, itemName, quantity, unitName, price, discount, taxRate, tax) {

    var grid = productGridView;
    var rows = grid.find("tr:not(:first-child):not(:last-child)");
    var amount = price * quantity;
    var subTotal = amount - discount;
    var total = subTotal + tax;
    var match = false;


    rows.each(function () {
        var row = $(this);
        if (getColumnText(row, 0) == itemCode &&
            getColumnText(row, 1) == itemName &&
            getColumnText(row, 3) == unitName &&
            getColumnText(row, 4) == price &&
            getColumnText(row, 8) == taxRate &&
            parseFloat(getColumnText(row, 5)) / parseFloat(getColumnText(row, 6)) == amount / discount) {

            setColumnText(row, 2, parseFloat2(getColumnText(row, 2)) + quantity);
            setColumnText(row, 5, parseFloat2(getColumnText(row, 5)) + amount);
            setColumnText(row, 6, parseFloat2(getColumnText(row, 6)) + discount);
            setColumnText(row, 7, parseFloat2(getColumnText(row, 7)) + subTotal);
            setColumnText(row, 9, parseFloat2(getColumnText(row, 9)) + tax);
            setColumnText(row, 10, parseFloat2(getColumnText(row, 10)) + total);

            addDanger(row);

            match = true;
            return;
        }
    });

    if (!match) {
        var html = "<tr class='grid2-row'><td>" + itemCode + "</td><td>" + itemName + "</td><td class='text-right'>" + quantity + "</td><td>" + unitName + "</td><td class='text-right'>" + price + "</td><td class='text-right'>" + amount + "</td><td class='text-right'>" + discount + "</td><td class='text-right'>" + subTotal + "</td><td class='text-right'>" + taxRate + "</td><td class='text-right'>" + tax + "</td><td class='text-right'>" + total
            + "</td><td><span class='glyphicon glyphicon-remove-circle pointer span-icon' onclick='removeRow($(this));'></span><span class='glyphicon glyphicon-ok-sign pointer span-icon' onclick='toggleDanger($(this));'></span><span class='glyphicon glyphicon glyphicon-thumbs-up pointer span-icon' onclick='toggleSuccess($(this));'></span></td></tr>";
        grid.find("tr:last").before(html);
    }

    summate();

    itemCodeTextBox.val("");
    quantityTextBox.val(1);
    priceTextBox.val("");
    discountTextBox.val("");
    taxTextBox.val("");
    errorLabel.html("");
    itemCodeTextBox.focus();
    repaint();
};


//Ajax Requests
var getPrice = function () {
    var itemCode = itemCodeHidden.val();
    var partyCode = partyCodeHidden.val();
    var priceTypeId = parseFloat2(priceTypeDropDownList.val());
    var unitId = unitIdHidden.val();

    if (!unitId) return;

    if (tranBook.toLowerCase() == "sales") {
        if (priceTypeId <= 0) {
            $.notify(invalidPriceTypeWarningLocalized, "error");
            priceTypeDropDownList.focus();
            return;
        };
    };

    url = "/Services/ItemData.asmx/GetPrice";
    data = appendParameter("", "tranBook", tranBook);
    data = appendParameter(data, "itemCode", itemCode);
    data = appendParameter(data, "partyCode", partyCode);
    data = appendParameter(data, "priceTypeId", priceTypeId);
    data = appendParameter(data, "unitId", unitId);


    data = getData(data);

    var priceAjax = getAjax(url, data);

    priceAjax.success(function (msg) {
        priceTextBox.val(msg.d);
        taxTextBox.val("");
    });

    priceAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        logError(err, "error");
    });


    url = "/Services/ItemData.asmx/GetTaxRate";
    data = appendParameter("", "itemCode", itemCode);
    data = getData(data);

    var taxRateAjax = getAjax(url, data);

    taxRateAjax.success(function (msg) {
        taxRateTextBox.val(msg.d);
    });

    taxRateAjax.error(function (xhr) {
        var err = $.parseJSON(xhr.responseText);
        logError(err, "error");
    });

    calculateAmount();
};


//Boolean Validation
var itemCodeExists = function (itemCode) {
    url = "/Services/ItemData.asmx/ItemCodeExists";
    data = appendParameter("", "itemCode", itemCode);
    data = getData(data);

    return getAjax(url, data);
};

var isStockItem = function (itemCode) {
    url = "/Services/ItemData.asmx/IsStockItem";
    data = appendParameter("", "itemCode", itemCode);
    data = getData(data);

    return getAjax(url, data);
};

var unitNameExists = function (unitName) {
    url = "/Services/ItemData.asmx/UnitNameExists";
    data = appendParameter("", "unitName", unitName);
    data = getData(data);
    return getAjax(url, data);
};



//Validation Helper Functions
var countItemInStock = function (itemCode, unitId, storeId) {
    url = "/Services/ItemData.asmx/CountItemInStock";
    data = appendParameter("", "itemCode", itemCode);
    data = appendParameter(data, "unitId", unitId);
    data = appendParameter(data, "storeId", storeId);
    data = getData(data);

    return getAjax(url, data);
};

var countItemInStockByUnitName = function (itemCode, unitName, storeId) {
    url = "/Services/ItemData.asmx/CountItemInStockByUnitName";
    data = appendParameter("", "itemCode", itemCode);
    data = appendParameter(data, "unitId", unitId);
    data = appendParameter(data, "storeId", storeId);
    data = getData(data);

    return getAjax(url, data);
};





//Logic & Validation
var summate = function () {
    var runningTotal = sumOfColumn("#ProductGridView", 4);
    var taxTotal = sumOfColumn("#ProductGridView", 9);
    var grandTotal = sumOfColumn("#ProductGridView", 10);

    grandTotal += parseFloat2(shippingChargeTextBox.val());

    runningTotalTextBox.val(runningTotal);
    taxTotalTextBox.val(taxTotal);
    grandTotalTextBox.val(grandTotal);

};


var showShippingAddress = function () {
    shippingAddressTextBox.val((shippingAddressDropDownList.val()));
};




//Utilities
function addShortcuts() {
    shortcut.add("F2", function () {
        url = "/Inventory/Setup/PartiesPopup.aspx?modal=1&CallBackFunctionName=initializeAjaxData&AssociatedControlId=PartyIdHidden";
        showWindow(url);
    });

    shortcut.add("F4", function () {
        url = "/Inventory/Setup/ItemsPopup.aspx?modal=1&CallBackFunctionName=initializeAjaxData&AssociatedControlId=ItemIdHidden";
        showWindow(url);
    });

    shortcut.add("ALT+C", function () {
        itemCodeTextBox.focus();
    });

    shortcut.add("CTRL+I", function () {
        itemDropDownList.focus();
    });

    shortcut.add("CTRL+Q", function () {
        quantityTextBox.focus();
    });

    shortcut.add("ALT+P", function () {
        priceTextBox.focus();
    });

    shortcut.add("CTRL+D", function () {
        discountTextBox.focus();
    });

    shortcut.add("CTRL+R", function () {
        initializeAjaxData();
    });

    shortcut.add("CTRL+T", function () {
        taxTextBox.focus();
    });

    shortcut.add("CTRL+U", function () {
        unitDropDownList.focus();
    });

    shortcut.add("CTRL+ENTER", function () {
        addButton.click();
    });

};