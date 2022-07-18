import React from 'react';
import { generateButton } from '../CartButton/CartButton';
import './ProductInfo.scss';

export class ProductInfo extends React.PureComponent {
  render () {
    return (
      <article className="ProductInfo">
        <div className="ProductInfo__gallery">
          <div className="ProductInfo__icon">
            <img src="" alt="" className="ProductInfo__icon--1"/>
            <img src="" alt="" className="ProductInfo__icon--2"/>
            <img src="" alt="" className="ProductInfo__icon--3"/>
          </div>

          <div className="ProductInfo__image">
            <img src="" alt="" />
          </div>
        </div>

        <div className="Item__info">
          <h3 className="Item__title">Apollo </h3>
          <p className="Item__description">Running Shorts</p>

          <div className="Item__size">
            <p className="Item__size--title">Size:</p>
            <div className="Item__size-wraper">
              <div className="Item__size--x-small">XS</div>
              <div className="Item__size--small">S</div>
              <div className="Item__size--medium">M</div>
              <div className="Item__size--large">L</div>
            </div>
          </div>

          <div className="Item__color">
            <p className="Item__color--title">Color:</p>
            <div className="Item__color-wraper">
              <div className="Item__color--gray">gray</div>
              <div className="Item__color--blue">blue</div>
              <div className="Item__color--red">red</div>
            </div>
          </div>

          <p className="Item__price">
            Price:
            
            <br />
            
            <span className="Item__price--value">
              $50
            </span>
          </p>

          {generateButton('Add to cart')}

          <p className="ProductInfo__text">
          Find stunning women's cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses and party dresses from all your favorite brands.
          </p>
        </div>
      </article>
    )
  }
}
