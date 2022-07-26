import React from 'react';
import './ProductInfo.scss';
import '../CartButton/CartButton.scss'
import { renderAttributes } from '../../helpers/helpers';

export class ProductInfo extends React.PureComponent {
  state = {
    product: null,
    imageSrc: '',
    colorId: '',
    otherAttributes: {},
  }

  constructor(props) {
    super(props)
    props = {
      products: [],
      selectedProductId: '',
      currency: "$",
      onAddToCart: () => undefined,
      onColorSelect: () => undefined,
    }
  }

  componentDidMount() {
    if (this.props.products) {
      this.setState({product: {...this.props.products.find(product => {
        this.setState({imageSrc: product.gallery[0]})
        return product.id === this.props.selectedProductId
      })}})
    }
  }

  colorIdSetter = (id) => {
    this.setState({colorId: id})
  };

  otherAttributesIdSetter = (name, id) => {
    this.setState({otherAttributes: {...this.state.otherAttributes, [name]: id}});
  };

  render () {
    const {
      products,
      currency,
      onAddToCart,
      onColorSelect,
    } = this.props;

    const {
      product,
      imageSrc,
      colorId,
      otherAttributes,
    } = this.state;

    const {
      colorIdSetter,
      otherAttributesIdSetter,
    } = this;

    return (
      <article className="ProductInfo">
        <div className="ProductInfo__gallery">
          <div className="ProductInfo__icon-wrapper">
          {
            product?.gallery?.map(image => (
              <img
                key={image}
                src={image}
                alt={product.name}
                className="ProductInfo__icon"
                onClick={() => {
                  this.setState({imageSrc: image})
                }}
              />
            ))
          }
          </div>

          <div className="ProductInfo__image-wrapper">
            <img
              src={imageSrc}
              alt={product?.name}
              className="ProductInfo__image" />
          </div>
        </div>

        <div className="ProductInfo__item Item__info">
          <h3 className="Item__title">{product?.name}</h3>
          <div className="Item__description">
            {product?.brand}
          </div>

          {
            renderAttributes(
              product,
              colorId,
              otherAttributesIdSetter,
              colorIdSetter,
            )
          }

          <div className="Item__price">
            <p className="Item__price--title">Price:</p>
            <p className="Item__price--value">
              {currency}
              {product?.prices && (product?.prices?.find(price => price.currency.symbol === currency).amount)}
            </p>
          </div>

          <button
            className="CartButton"
            type="button"
            onClick={() => {
              const price = product?.prices && (product?.prices?.find(price => price.currency.symbol === currency).amount);
              onAddToCart(colorId, otherAttributes, price)
            }}
          >
            Add to cart
          </button>

          <div
            className="ProductInfo__text"
            dangerouslySetInnerHTML={
              {__html: product?.description && (product.description)}
            }
          />
        </div>
    </article>);
  }
}
