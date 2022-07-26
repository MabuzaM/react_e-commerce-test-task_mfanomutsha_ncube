import { Link } from 'react-router-dom';
import React from 'react';
import cn from 'classnames';
import InCartIcon from '../icons-svg/InCartIcon.svg';

export const renderProducts = (products, currency, isInCart, stateSetter=() => undefined) => {
  return products.map((product) => {
    const {
      id,
      gallery,
      prices,
      name,
    } = product;

    return (
        <div className="ProductCard" key={id}>
          <Link
            to={`/productid/:${id}`}
            className="ProductCard__link"
            onClick={() => stateSetter(product, id)}
          >
            <img src={gallery[Math.floor(Math.random() * gallery.length)]} alt={name} className="ProductCard__image" />
            <img src={InCartIcon} alt="In cart indicator" className={cn("ProductCard__icon", {
              "ProductCard__icon--visible": isInCart,
            })} />
            <p className="ProductCard__title">
              {name}
            </p>
            <p className="ProductCard__price">
              {currency}{prices.find(price => price.currency.symbol === currency).amount}
            </p>
          </Link>
        </div>
    );
  })
};

export const renderAttributes = (
  product,
  colorId,
  attributeIdSetter,
  colorIdSetter,
) => {
  return (
    <div className="Item__attribute">
    {
      product?.attributes?.map((attribute) => {
        return <React.Fragment key={attribute.id}>
          <p className="Item__attribute-title" key={attribute.id}>{attribute.name}:</p>
          <div className="Item__attribute-wraper">
          {
            attribute?.items?.map((item) => {
              if (attribute.name !== 'Color') {
                return <div
                  className={cn(
                    "Item__attribute-other",
                    {"Item__attribute-other--isActive": true},
                  )}
            
                  onClick={() => {
                    attributeIdSetter(attribute.name, item.id)
                    console.log(product?.selectedAttributes);
                  }}
                >
                  {item.displayValue}
                </div>
              }
                return <div
                  key={item.id}
                  className={cn(
                    "Item__attribute-color",
                    {"Item__attribute-color--isActive": colorId === item.id}
                  )}
                  style={{
                    backgroundColor: item.value,
                  }}
                  onClick={() => {
                    colorIdSetter(item.id)
                  }}
                >
                </div>
            })
          }
          </div>
        </React.Fragment>
      })
    }
  </div>
  );
};

export const calculateCartTotal = (productsInCart) => {
  return productsInCart.map(product => product.price)
    .reduce((price1, price2) => price1 + price2, 0).toFixed(2);
}
