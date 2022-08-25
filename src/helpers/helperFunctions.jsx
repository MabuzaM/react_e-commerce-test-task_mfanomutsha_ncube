export const renderPrice = (prices, currency) => {
  return prices?.find(price => price.currency.symbol === currency).amount;
}

export const calculateCartTotal = (productsInCart, currency) => {
  const itemTotalPrices = productsInCart
    ?.map(product => product.prices
      ?.find(price => price.currency.symbol === currency)?.amount * product.itemCount);

  return itemTotalPrices
    .reduce((total1, total2) => total1 + total2, 0)
    .toFixed(2);
}

export const getItemsTotal = (productsInCart) => {
  return productsInCart.map(product => product.itemCount)
    .reduce((productCount1, productCount2) => productCount1 + productCount2, 0)
    .toFixed(2);
}

export const checkOtherAttributesAndColor = (product) => {
  return product.attributes.map(attribute => attribute.type);
}

export const convertObjectToString = (objectToConvert) => {
  if (objectToConvert) {
    return Array.from(Object.values(objectToConvert)).join('');
  }

  return '';
}
