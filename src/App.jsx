import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import './App.scss';
import ProductList from './components/ProductList/ProductList';
import Clothes from './components/Clothes/Clothes';
import Tech from './components/Tech/Tech';
import { CartOverlay } from './components/CartOverlay/CartOverlay';
import { Cart } from './components/Cart/Cart';
import { ApolloProvider } from 'react-apollo';
import { ProductInfo } from './components/ProductInfo/ProductInfo';
import { client, PRODUCTS } from '../src/api/api';
import {Routes, Route, Navigate} from 'react-router-dom';

class App extends React.PureComponent {
  state = {
    selectedCurrency: '$',
    productId: '',
    productInfo: null,
    cartProducts: [],
    // [
    //   {
    //     ...,
    //     itemCount: 1
    //   }
    //   // this.state.cartProducts.find(product => product.id === eventid).itemCount ++ 
    // ],
    productCount: 0,
    itemCount: 1,
    products: [],
    colorId: '',
    item2Id: '',
    tax: 0,
    quantity: 0,
    totalAmount: 0,
    isCartHidden: false,
    isInCart: false,
  }

   componentDidMount() {
    client.query({
      query: PRODUCTS,
    }).then(({loading, error, data }) => {
      if (loading && !data) return <p>Loading Prodicts...</p>
      if (error) return <p>An error occured: {error}</p>
      this.setState({products: data.category.products})
    })
  }

  componentDidUpdate() {
    if (this.state.cartProducts.find(product => product.id === this.state.productInfo.id)) {
      this.setState({
        isInCart: true,
      });
    }
  }

   handleSelectClick = (event) => {
    this.setState({selectedCurrency: event.target.value});
  }

  handleProductClick = (selectedProduct) => {
    this.setState({productInfo: selectedProduct});
  }

  handleAddToCartClick = (color, otherAttributes, price) => {
    const itemInCart = this.state.cartProducts.find(product => product.id === this.state.productInfo.id)

    if (itemInCart) {
      itemInCart.itemCount++;
      itemInCart.price = itemInCart.price += price;

      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        quantity: this.state.quantity + 1,
      });
    } else {
      this.setState({
        cartProducts: [...this.state.cartProducts,
          {...this.state.productInfo,
            itemCount: 1,
            isInCart: true,
            selectedColor: color,
            selectedAttributes: otherAttributes,
            price: price,
          }],
        productCount: this.state.productCount + 1,
        quantity: this.state.quantity + 1      
      });
    }
  };

  handleColorSelect = (colorId) => {
    this.setState({colorId: colorId})
  };

  removeItemFromCart = (itemInCart) => {
    this.setState({
      cartProducts: [...this.state.cartProducts.filter(cartProduct => cartProduct.id !== itemInCart.id)]
    })
  }

  changeCartQuantity = (quant) => {
    this.setState({quantity: quant})
  }

  render() {
    const {
      selectedCurrency,
      productCount,
      productInfo,
      cartProducts,
      products,
      colorId,
      itemCount,
      quantity,
      isInCart,
    } = this.state;

    const {
      handleSelectClick,
      handleProductClick,
      handleAddToCartClick,
    } = this;

    // console.log(this.state.cartProducts);

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App__header">
            <Navbar
              onSelectClick={handleSelectClick}
              productCount={cartProducts.length}
            />
          </header>
          <div className="App__background"></div>
          <main className="App__main">
            {
              this.state.isCartHidden
                ? (null)
                : (
                  <CartOverlay
                    productsInCart={cartProducts}
                    currency={selectedCurrency}
                    colorId={colorId}
                    selectedProductId={productInfo?.id}
                    itemCount={itemCount}
                    quantity={quantity}
                    onChangeItemCount={this.handleChangeItemCount}
                  />
                )
            }
            <Routes>
              <Route
                path="all"
                element={
                  <>
                    <h1 className="App__heading">ALL PRODUCTS</h1>
                    <div className="App__products">
                      <ProductList
                        products={products}
                        currency={selectedCurrency}
                        isInCart={isInCart}
                        onProductClick={handleProductClick}
                      />
                    </div>
                  </>
                }
              />

              <Route
                path="home"
                element={<Navigate to="all" />}
              />

              <Route
                path=""
                element={<Navigate to="all" />}
              />

              <Route
                path="clothes"
                element={
                  <>
                    <h1 className="App__heading">CLOTHES</h1>
                    <div className="App__products">
                      <Clothes
                        currency={selectedCurrency}
                        products={products}
                        onProductClick={handleProductClick}
                      />
                    </div>
                  </>                  
                }
              />

              <Route
                path="cart"
                element={
                  <>
                    <h1 className="App__heading">CART</h1>
                    <div className="App__cart">
                      <Cart
                        productsInCart={cartProducts}
                        productInfo={productInfo}
                        currency={selectedCurrency}
                        colorId={colorId}
                        itemCount={itemCount}
                        quantity={quantity}
                        changeCartQuantity={this.changeCartQuantity}
                        onDeleteItem={this.removeItemFromCart}
                      />
                    </div>
                  </>
                }
              />

              <Route
                path="tech"
                element={
                  <>
                    <h1 className="App__heading">TECH</h1>
                    <div className="App__products">
                      <Tech
                        currency={selectedCurrency}
                        products={products}
                        onProductClick={handleProductClick}
                      />
                    </div>
                  </>
                }
              />

              <Route
                path={`/productid/:${productInfo?.id}`}
                element={
                  <ProductInfo
                    products={products}
                    selectedProductId={productInfo?.id}
                    currency={selectedCurrency}
                    onAddToCart={handleAddToCartClick}
                    onColorSelect={this.handleColorSelect}
                  />
                }
              />

              <Route
                path="*"
                element={(
                  <>
                    <h1 className="App__heading">Page Not Found</h1>
                  </>
                )}
              />
            </Routes>
          </main>
          {'       '}
        </div>
      </ApolloProvider>
    );
  }

  
}

export default App;
