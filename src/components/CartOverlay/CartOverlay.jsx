import React from 'react';
import { generateButton } from '../CartButton/CartButton';
import './CartOverlay.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { calculateCartTotal } from '../../helpers/helpers';

export class CartOverlay extends React.PureComponent {
  state = {
    productId: '',
    cartItemColorId: '',
    imgUrlIndex: 0,
    cartProducts: [],
  };

  constructor(props) {
    super(props)
    props = {
      productsInCart: [],
      currency: '$',
      changeCartQuantity: () => undefined,
      onDeleteItem: () => undefined,
    };
  }

  slideThroughImages = (operator, gallery) => {
    if (this.state.imgUrlIndex >= 0 && this.state.imgUrlIndex < gallery.length - 1) {
      switch(operator) {
        case '+':
          this.setState({imgUrlIndex: this.state.imgUrlIndex + 1});
          break;
        
        case '-':
          this.setState({imgUrlIndex: this.state.imgUrlIndex - 1});
          break;

        default:;
      }
    } else {
      this.setState({imgUrlIndex: 0});
    }
  };

  decrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart && itemInCart.itemCount >= 1) {
      itemInCart.itemCount--;
      itemInCart.price = itemInCart.price -= itemPrice;
      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        itemQuant: this.state.itemQuant - 1,
      });

      this.props.changeCartQuantity(this.state.itemQuant);
    } else {
      this.props.onDeleteItem(itemInCart);
    }
  }

  incrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart) {
      itemInCart.itemCount++;
      itemInCart.price = itemInCart.price += itemPrice;
      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        itemQuant: this.state.itemQuant + 1,
      });

      this.props.changeCartQuantity(this.state.itemQuant);
    }
  }


  render () {
    const {
      productId,
      cartItemColorId,
      itemNumber,
      imgUrlIndex,
    } = this.state;

    const { 
      productsInCart, 
      currency,
      colorId,
      selectedProductId,
      itemCount,
      quantity,
    } = this.props;

    return (
        <article className="CartOverlay">
          <h2 className="CartOverlay__title">
            My Bag, <span className="CartOverlay__title--quantity">{`${quantity} items`}</span>
          </h2>
          <div className="Overlay-Item CartOverlay__item">
            {
              productsInCart.length === 0
                ?  (
                      <>
                        <p className="CartOverlay__empty-text">Your cart is empty</p>
                      </>
                  )
                  :  (productsInCart?.map(product => {
                    const {
                      id,
                      name,
                      brand,
                      prices,
                      gallery,
                      attributes,                   
                    } = product;

                    const itemPrice = prices?.find(price => price.currency.symbol === currency).amount;

                    return (
                      <>
                      <div className="Overlay-Item__details" key={id}>
                        <div className="Overlay-Item__info">
                          <h3 className="Overlay-Item__title">{name}</h3>
                          <p className="Overlay-Item__description">{brand}</p>
                          <p className="Overlay-Item__price">
                            {currency}
                            {prices && (prices?.find(price => price.currency.symbol === currency).amount)}
                          </p>
            
                          <div className="Overlay-Item__attribute">
                            {
                              attributes?.map((attribute) => {
                                return <React.Fragment key={attribute.id}>
                                  <p className="Overlay-Item__attribute-title" key={attribute.id}>{attribute.name}:</p>
                                  <div className="Overlay-Item__attribute-wraper">
                                    {
                                      attribute?.items?.map((item) => {
                                        return attribute.name !== 'Color'
                                          ? (<div
                                            className="Overlay-Item__attribute-other"
                                            onClick={() => this.setState({item2Id: item.id})}
                                          >
                                            {item.displayValue}
                                          </div>)
                                          : (<div
                                            key={item.id}
                                            className={cn(
                                              "Overlay-Item__attribute-color",
                                              {"Overlay-Item__attribute-color--isActive": this.state.colorId === item.id}
                                            )}
                                            style={{
                                              backgroundColor: item.value,
                                            }}
                                          >
                                          </div>)
                                      })
                                    }
                                  </div>
                                </React.Fragment>
                              })
                            }
                          </div>
                        </div>
            
                        <div className="Overlay-Item__extra">
                          <div className="Overlay-Item__quantity-controls">
                            <div
                              className="Overlay-Item__increment"
                              onClick={() => this.incrementItemCount(product, itemPrice)}
                            >
                              +
                            </div>
                            <p className="Overlay-Item__quant">{product.itemCount}</p>
                            <div
                              className="Overlay-Item__decrement"
                              onClick={() => this.decrementItemCount(product, itemPrice)}
                            >
                              -
                            </div>
                          </div>
                          <div className="Overlay-Item__image-wrapper">
                            <img
                              src={gallery[0]}
                              alt="Item"
                              className="Overlay-Item__image"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }))
              }
        </div>

        <div className="CartOverlay__summary">
          <p className="CartOverlay__total">Total:</p>
          <p className="Cart__summary--value">{calculateCartTotal(productsInCart)}</p>
        </div>

        <div className="CartOverlay__buttons">
            {
              productsInCart.length === 0
                ? (
                    <Link to="/all" className="CartOverlay__button-link">
                      {generateButton('Continue shopping')}
                    </Link>
                  )
                : (
                    <>
                      <div>
                        <Link to="cart" className="CartOverlay__button-link">
                          {generateButton('View Bag')}
                        </Link>
                      </div>

                      <div>
                        {generateButton('Order')}
                      </div>    
                    </>
                  )
            }
          </div>
      </article>
    );
  }
}
