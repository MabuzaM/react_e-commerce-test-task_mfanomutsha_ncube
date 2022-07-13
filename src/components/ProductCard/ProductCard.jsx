import React from 'react';
import prod from '../../product-images/prod-a.png';
import './ProductCard.scss';

export class ProductCard extends React.PureComponent {
  render () {
    return (
      <div className="ProductCard">
        <img src={prod} alt="Product A" className="ProductCard__image" />
        <p className="ProductCard__title">
          Appolo Running Short
        </p>
        <p className="ProductCard__price">
          $50
        </p>
      </div>
    )
  }
}
