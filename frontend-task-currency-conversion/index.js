// SET DEFAULT VALUES
const baseURL = 'http://data.fixer.io/api/latest';
const access_key = '3300f863396080388db72241afae18f8';
const currencyData = [{ 'currency': 'EUR', 'symbol': '€' },
{ 'currency': 'USD', 'symbol': '$' },
{ 'currency': 'JPY', 'symbol': '¥' }];
const setDefaulFromCurrency = 'EUR';
const setDefaulToCurrency = 'USD';


// GET DOM ELEMENTS
const fromSelectCurrencyElement = document.getElementById('fromSelectCurrency');
const toSelectCurrencyElement = document.getElementById('toSelectCurrency');
const fromAmountElement = document.getElementById('fromAmount');
const toAmountElement = document.getElementById('toAmount');
const fromCurrencySymbolElement = document.getElementById('fromCurrencySymbol');
const toCurrencySymbolElement = document.getElementById('toCurrencySymbol');

// Bind all currency to currency dropdownlist
const bindAllCurrency = (currencies) => {
    currencies.forEach((data) => {
        fromSelectCurrencyElement.add(new Option(data.currency, data.currency));
        toSelectCurrencyElement.add(new Option(data.currency, data.currency));
    });
}

// From/source currency dropdown change event handler
const fromSelectCurrencyChangeHandler = () => {
    const fromSelectCurrency = fromSelectCurrencyElement.value;
    setCurrencySymbol(fromSelectCurrency, fromCurrencySymbolElement);
    calculateAmount();
}

// To/destination currency dropdown change event handler
const toSelectCurrencyChangeHandler = () => {
    const toSelectCurrency = toSelectCurrencyElement.value;
    setCurrencySymbol(toSelectCurrency, toCurrencySymbolElement)
    calculateAmount();
}

// set currency symbol based on currency selection
const setCurrencySymbol = (currency, targetElemet) => {
    let symbol = currencyData.find(t => t.currency == currency).symbol;
    targetElemet.innerHTML = symbol;
}

// capture entered/change amount handler
fromAmountElement.addEventListener('input', () => {
    calculateAmount();
});

// swap currency 
const currencySwapHandler = () => {
    const fromSelectCurrency = fromSelectCurrencyElement.value;
    fromSelectCurrencyElement.value = toSelectCurrencyElement.value;
    toSelectCurrencyElement.value = fromSelectCurrency;
    setCurrencySymbol(fromSelectCurrencyElement.value, fromCurrencySymbolElement);
    setCurrencySymbol(toSelectCurrencyElement.value, toCurrencySymbolElement);
    calculateAmount();
}


//calculate currency converted amount
const calculateAmount = async () => {
    let convertedAmount = 0;
    if (!isNaN(parseFloat(fromAmountElement.value)) && parseFloat(fromAmountElement.value) > 0) {
        const amountDataResponse = await getCurrencyExchangeRates(fromSelectCurrencyElement.value);
        if (amountDataResponse != null) {
            const currencyRate = parseFloat(amountDataResponse.rates[toSelectCurrencyElement.value])
            const fromAmount = parseFloat(fromAmountElement.value)
            convertedAmount = (fromAmount * currencyRate).toFixed(2);
        }
    }
    toAmountElement.value = convertedAmount;
}

//API call to get currency rates
const getCurrencyExchangeRates = async (baseCurrency) => {    
    let responseData = null;
    try {
        //let response = await fetch(`${baseURL}?access_key=${access_key}&base=${baseCurrency}`);
        let response = await fetch(`${baseURL}?access_key=${access_key}`);
        if (response.status === 200) {
            responseData = await response.json();
            if (!responseData.success)
                responseData = null;
        }
    } catch (error) {
        console.log(error);
    }    
    return responseData;
}

// set defualt values
const setDefaultValues = () => {
    fromSelectCurrencyElement.value = setDefaulFromCurrency;
    setCurrencySymbol(setDefaulFromCurrency, fromCurrencySymbolElement);
    toSelectCurrencyElement.value = setDefaulToCurrency;
    setCurrencySymbol(setDefaulToCurrency, toCurrencySymbolElement);
}

bindAllCurrency(currencyData);
setDefaultValues();
