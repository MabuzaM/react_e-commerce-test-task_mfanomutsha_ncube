import { Link } from 'react-router-dom';
import React from 'react';
import cn from 'classnames';
import AddToCartIcon from '../icons-svg/addToCartIcon.svg';

export const renderPrice = (prices, currency) => {
  return prices?.find(price => price.currency.symbol === currency).amount;
}

export const renderProducts = (
  products,
  currency,
  selectedProductId,
  onShowAddToCartIcon=() => undefined,
  onAddToCart=() => undefined,
  getProduct=() => undefined,
  onProductHover=() => undefined,
) => {
  return products.map((product) => {
    const {
      id,
      gallery,
      prices,
      name,
      brand,
    } = product;

    const baseAttributes = product?.attributes?.reduce((allBaseAttributes, attribute) => ({
      ...allBaseAttributes,
      [attribute?.name]: attribute?.items[0]?.value
    }), {})

    return (
        <div
          className="ProductCard"
          key={id}
          onMouseEnter={() => {
            onShowAddToCartIcon(id);
            onProductHover(product, baseAttributes);
          }}
        >
          <Link
            to={`/productid/:${id}`}
            className={cn("ProductCard__link", {"ProductCard__outofstock--disabled": !product?.inStock})}
            onClick={() => getProduct(product, baseAttributes)}
          >
            <div className="ProductCard__image-wrapper">
              <img
                src={gallery[0]}
                alt={name}
                className="ProductCard__image"
              />
            </div>
            
            <p className="ProductCard__title">
              {brand}
            </p>

            <p className="ProductCard__title">
              {name}
            </p>

            <p className="ProductCard__price">
              {currency}{renderPrice(prices, currency)}
            </p>

            <div className={cn(
              "ProductCard__outofstock",
              {"ProductCard__outofstock--true": !product?.inStock}
            )}>
              <p className="ProductCard__outofstock--text">Out of stock</p>
            </div>
          </Link>
         
          <img
            src={AddToCartIcon}
            alt="Add to cart icon overlay"
            className={cn("ProductCard__icon", {
              "ProductCard__icon--visible": id === selectedProductId,
              "ProductCard__icon--invisible": !product?.inStock,
            })}
            onClick={() => onAddToCart(
              product,
              baseAttributes,
              renderPrice(prices, currency)
            )}
          />
        </div>
    );
  })
};

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
