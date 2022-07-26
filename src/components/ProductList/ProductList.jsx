import React from 'react';
import './ProductList.scss';
import '../ProductCard/ProductCard.scss';
import { renderProducts } from '../../helpers/helpers';

class ProductList extends React.PureComponent {
  state = {
    productId: '',
    productPrices: [],
    selectedProduct: null,
  }


  constructor(props) {
    super(props)
    props = {
      currency: '$',
      isInCart: false,
      onProductClick: () => undefined,
      products: [],
    };    
  }

  render () {
    const {
      currency,
      isInCart,
      products,
      onProductClick
    } = this.props;

    return (renderProducts(
        products,
        currency,
        isInCart,
        onProductClick,
      ));
  }

}

export default ProductList;
