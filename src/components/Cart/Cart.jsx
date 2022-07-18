import React from 'react';
import prod from '../../product-images/prod-a.png';
import { generateButton } from '../CartButton/CartButton';
import './Cart.scss';

export class Cart extends React.PureComponent {
  render () {
    return (
      <article className="Cart">
        <h2 className="Cart__title">Cart</h2>
        <div className="Item Cart__item">
          <hr />
          <div className="Item__details">
            <div className="Item__info">
              <h3 className="Item__title">Apollo </h3>
              <p className="Item__description">Running Shorts</p>
              <p className="Item__price">$50</p>

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

              
              {generateButton('Order')}
            </div>

            <div className="Item__extra">
              <div className="Item__quantity-controls">
                <div className="Item__increase">+</div>
                <p className="Item__quant">1</p>
                <div className="Item__decrease">-</div>
              </div>
              <div className="Item__image">
                <img src={prod} alt="Item" className="Item__photo" />
              </div>
            </div>
          </div>
        </div>

        <div className="Cart__summary">
          <p className="Cart__tax">Tax 21%: <span className="Cart__summary--value">78</span></p>
          <p className="Cart__quantity">Quantity: <span className="Cart__summary--value">3</span></p>
          <p className="Cart__total">Total: <span className="Cart__summary--value">R1600</span></p>
        </div>
      </article>
    );
  }
}
