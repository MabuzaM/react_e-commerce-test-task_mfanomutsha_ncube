import React from 'react';
import '../ProductCard/ProductCard.scss';
import { renderProducts } from '../../helpers/helperFunctions';

class ProductList extends React.PureComponent {
  state = {
    selectedId: '',
  }

  constructor(props) {
    super(props)
    props = {
      products: [],
      currency: '$',
      onShowAddToCartIcon: () => undefined,
      onAddToCart: () => undefined,
      onProductClick: () => undefined,
      onProductHover: () => undefined,
    };    
  }

  onShowAddToCartIcon = (id) => {
    this.setState({selectedId: id});
  }

  render () {
    const {
      products,
      currency,
      onAddToCart,
      onProductClick,
      onProductHover
    } = this.props;

    return (renderProducts(
        products,
        currency,
        this.state.selectedId,
        this.onShowAddToCartIcon,
        onAddToCart,
        onProductClick,
        onProductHover
      ));
  }

}

export default ProductList;
