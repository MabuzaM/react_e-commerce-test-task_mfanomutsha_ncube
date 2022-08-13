import React from 'react';
import { CartButton } from '../CartButton/CartButton';
import './Cart.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { calculateCartTotal, renderPrice, getItemsTotal } from '../../helpers/helperFunctions';
import recycle from '../../icons-svg/recycle.png';
import classNames from 'classnames';

export class Cart extends React.PureComponent {
  state = {
    itemQuant: 0,
    cartProducts: [],
    productSelected: null,
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

  componentDidMount() {
    this.setState({
      cartProducts: [...this.props.productsInCart]
    })
  }

  decrementItemCount = (cartItem, itemPrice) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === cartItem.id);

    if (itemInCart && itemInCart.itemCount >= 2) {
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

  slideThroughImages = (operator, selectedProduct) => {
    if (selectedProduct?.imgUrlIndex >= 0) {
      switch(operator) {
        case '+':
          if (selectedProduct.imgUrlIndex < selectedProduct?.gallery?.length - 1) {
            this.setState({productSelected: {...selectedProduct.imgUrlIndex += 1}});
          }
          break;
        
        case '-':
          if (selectedProduct.imgUrlIndex > 0) {
            this.setState({productSelected: {...selectedProduct.imgUrlIndex -= 1}});
          }
          break;

        default:;
      }
    }
  };

  render () {
    const {
      cartProducts,
    } = this.state;

    const { 
      productsInCart,
      currency,
    } = this.props;

    const cartTotal = calculateCartTotal(productsInCart, currency);

    console.log(cartProducts);

    return (
      <>
        <article className="Cart">
          <div className="Item Cart__item">
            <hr className="Cart__line"/>
            {
              cartProducts.length === 0
                ?  (
                      <>
                        <p className="Cart__text">Your cart is empty</p>
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

                    const itemPrice = renderPrice(prices, currency);
                    return (
                      <>
                      <div className="Item__details" key={id}>
                        <div className="Item__info">
                          <h3 className="Item__title">{name}</h3>
                          <p className="Item__description">{brand}</p>
                          <p className="Item__price">
                            {currency}
                            {
                              itemPrice
                            }
                          </p>
            
                          <div className="Item__attribute">
                            {
                              attributes?.map((attribute) => {
                                return <React.Fragment key={attribute.id}>
                                  <p className="Item__attribute-title" key={attribute.id}>{attribute.name}:</p>
                                  <div className="Item__attribute-wraper">
                                  {
                                    attribute?.items?.map((item) => {
                                      if (attribute.name !== 'Color') {
                                        return <div
                                          className={cn(
                                            "Item__attribute-other",
                                            "Item__attribute--cart",
                                            {"Item__attribute-other--isActive": product.baseAttributes[attribute.name] === item.id}
                                          )}
                                          onClick={() => this.setState({item2Id: item.id})}
                                        >
                                          {item.displayValue}
                                        </div>
                                      }
                                        return <div
                                          key={item.id}
                                          className={cn(
                                            "Item__attribute-color",
                                            "Item__attribute--cart",
                                            {"Item__attribute-color--isActive": product.baseColor === item.value} 
                                          )}
                                          style={{
                                            backgroundColor: item.value,
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
                          </div>
              
                          <div className="Item__extra">
                            <div className="Item__quantity-controls">
                              <div
                                className="Item__increase"
                                onClick={() => this.incrementItemCount(product, itemPrice)}
                              >
                                +
                              </div>
                              <p className="Item__quant">{product.itemCount}</p>
                              <div
                                className="Item__decrease"
                                onClick={() => this.decrementItemCount(product, itemPrice)}
                              >
                                {
                                  product.itemCount === 1
                                    ? (<img src={recycle} alt='recycle' className="Item__remove-icon"/>)
                                    : ('-')
                                }
                              </div>
                            </div>
                            <div className="Item__image-slider">
                              <img src={
                                product.imgUrlIndex < 0 || product.imgUrlIndex >= product.gallery.length - 1
                                  ? (gallery[0])
                                  : (gallery[product?.imgUrlIndex])
                              } alt="Item" className="Item__image" />
                              <div className="Item__slider-controls">
                                <div
                                  className={classNames(
                                    "Item__slider-controls-previous",
                                    {"Item__slider-controls-previous--disabled": product.imgUrlIndex === 0}
                                  )}
                                  onClick={() => {
                                    this.setState({selectedProduct: product});
                                    this.slideThroughImages('-', product);
                                  }}>
                                  &lt;
                                </div>

                                <div
                                  className={classNames(
                                    "Item__slider-controls-next",
                                    {"Item__slider-controls-next--disabled": product.imgUrlIndex === product.gallery.length - 1}
                                  )}
                                  onClick={() => {
                                    this.setState({selectedProduct: product});
                                    this.slideThroughImages('+', product);
                                  }}>
                                  &gt;
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="Cart__line" />
                      </>
                    );
                  }))
                }
          </div>

          <div className="Cart__summary">
            <p className="Cart__tax">Tax 21%: 
              <span className="Cart__summary--value">
                {` ${currency} ${((21 / 100) * cartTotal).toFixed(2)}`}
              </span>
            </p>

            <p className="Cart__quantity">Quantity:
              <span className="Cart__summary--value">
                {` ${getItemsTotal(productsInCart)}`}
              </span>
            </p>

            <p className="Cart__total">Total: 
              <span className="Cart__summary--value">
                {` ${currency} ${cartTotal}`}
              </span></p>
            {
              productsInCart.length === 0
                ? (
                    <Link to="/home" className="Cart__button-link">
                      <CartButton
                        buttonText={'Continue shopping'}
                        backgroundColor={'#5ece7b'}
                      />
                    </Link>
                  )
                : (
                    <Link to="/order" className="Cart__button-link">
                      <CartButton
                        buttonText={'Order'}
                        backgroundColor={'#5ece7b'}
                      />
                    </Link>
                  )
            }
          </div>
        </article>
      </>
    );
  }
}
