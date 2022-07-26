import React from 'react';
import { renderProducts } from '../../helpers/helpers';

class Clothes extends React.PureComponent {
  state = {
    productId: '',
    clothes: [],
    productPrices: [],
    selectedProduct: null,
  }

  constructor(props) {
    super(props)
    props = {
      currency: '$',
      onProductClick: () => undefined,
      products: [],
    }
  }

  componentDidMount() {
    this.setState({clothes: this.props.products.filter(product => product.category === 'clothes')})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.products !== this.props.products) {
      this.setState({clothes: this.props.products.filter(product => product.category === 'clothes')})
    }
  }

  render () {
    const { currency, onProductClick } = this.props;
    const { clothes } = this.state;

    return (
      renderProducts(clothes, currency, onProductClick)
    );
  }
}

export default Clothes;
