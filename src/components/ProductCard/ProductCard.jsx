import React from 'react';
import './ProductCard.scss';
import { renderPrice } from '../../helpers/helperFunctions';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import AddToCartIcon from '../../icons-svg/addToCartIcon.svg';

export class ProductCard extends React.PureComponent {
  constructor (props) {
    super(props);
    props = {
      products: [],
      currency: '$',
      selectedProductId: '',
      onShowAddToCartIcon: () => undefined,
      onHideAddToCartIcon: () => undefined,
      onAddToCartIconClick: () => undefined,
      getProduct: () => undefined,
      onProductHover: () => undefined,
    }
  }

  render() {
    const {
      products,
      currency,
      selectedProductId,
      onShowAddToCartIcon,
      onHideAddToCartIcon,
      onAddToCartIconClick,
      getProduct,
      onProductHover,
    } = this.props;

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
            className={cn("ProductCard", {"ProductCard__outofstock": !product?.inStock})}
            key={id}
            onMouseEnter={() => {
              onShowAddToCartIcon(id);
              onProductHover(product, baseAttributes);
            }}
            onMouseLeave={() => onHideAddToCartIcon('')}
          >
            <Link
              to={`/product/${id}`}
              className={cn("ProductCard__link")}
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
                "ProductCard__outofstock-text",
                {"ProductCard__outofstock-text--visible": !product?.inStock}
              )}>
                <p>Out of stock</p>
              </div>
            </Link>
           
            <img
              src={AddToCartIcon}
              alt="Add to cart icon overlay"
              className={cn("ProductCard__icon", {
                "ProductCard__icon--visible": id === selectedProductId,
                "ProductCard__icon--invisible": !product?.inStock,
              })}
              onClick={() => onAddToCartIconClick(
                product,
                baseAttributes,
                renderPrice(prices, currency)
              )}
            />
          </div>
      );
    })
  }
}
