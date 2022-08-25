import React from 'react';
import './ProductInfo.scss';
import '../CartButton/CartButton.scss'
import cn from 'classnames';
import { renderPrice, checkOtherAttributesAndColor } from '../../helpers/helperFunctions';
import { sanitize } from 'dompurify';

class ProductInfo extends React.PureComponent {
  state = {
    product: null,
    productFromServer: null,
    id: '',
    imageSrc: '',
    colorId: '',
    allAttributes: {},
    isVisible: false,
  }

  constructor(props) {
    super(props)
    props = {
      currency: "$",
      products: '',
      selectedProductId: '',
      onAddToCart: () => undefined,
      onColorSelect: () => undefined
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

  allAttributesIdSetter = (name, value) => {
    this.setState({allAttributes: {...this.state.allAttributes, [name]: value}});
  };

  render () {
    const {
      currency,
      onAddToCart,
    } = this.props;

    const {
      product,
      imageSrc,
      colorId,
      allAttributes,
      isVisible,
    } = this.state;

    const {
      colorIdSetter,
      allAttributesIdSetter,
    } = this;

    const sanitizer = sanitize;

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
          <p className={cn(
            "ProductInfo__success-message",
            {"ProductInfo__success-message--visible": isVisible}
          )}>
            Added to cart
          </p>

          <h3 className="Item__title">{product?.name}</h3>

          <div className="Item__description">
            {product?.brand}
          </div>

          <div className="Item__attribute">
            {
              product?.attributes?.map((attribute) => {
                return <React.Fragment>
                  <p className="Item__attribute-title"  key={attribute?.id}>{attribute?.name}:</p>
                  <div className="Item__attribute-wraper">
                  {
                    attribute?.items?.map((item) => {
                      if (attribute?.name !== 'Color') {
                        return <div
                          key={item.id}
                          className={cn(
                            "Item__attribute-other",
                            {"Item__attribute-other--isActive": allAttributes[attribute?.name] === item?.value},
                          )}
                    
                          onClick={() => {
                            allAttributesIdSetter(attribute?.name, item?.value);
                          }}
                        >
                          {item?.displayValue}
                        </div>
                      }
                        return <div
                          key={item?.id}
                          className={cn(
                            "Item__attribute-color",
                            {"Item__attribute-color--isActive": colorId === item?.value}
                          )}
                          style={{
                            backgroundColor: item?.value,
                          }}
                          onClick={() => {
                            colorIdSetter(item?.value);
                            allAttributesIdSetter(attribute?.name, item?.value);
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

          <div className="Item__price">
            <p className="Item__price--title">Price:</p>
            <p className="Item__price--value">
              {currency}
              {renderPrice(product?.prices, currency)}
            </p>
          </div>

          <button
            className={cn("CartButton", {"CartButton__outOfStock": !product?.inStock})}
            type="button"
            onClick={() => {
                if (checkOtherAttributesAndColor(product).length === Object.values(allAttributes).length) {
                  onAddToCart(
                    product,
                    allAttributes,
                    renderPrice(product?.prices, currency)
                  )
                  this.setState({isVisible: true})
                }
                return;
            }}
            onMouseOut={() => this.setState({isVisible: false})}
          >
            Add to cart
          </button>

          <div
            className="ProductInfo__text"
            dangerouslySetInnerHTML={
              {__html: sanitizer(product?.description && (product.description))}
            }
          />
        </div>
    </article>);
  }
}

export default ProductInfo;
