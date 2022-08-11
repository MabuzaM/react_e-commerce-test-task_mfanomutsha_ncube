import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import './App.scss';
import ProductList from './components/ProductList/ProductList';
import { CartOverlay } from './components/CartOverlay/CartOverlay';
import { CurrencySwitcher } from './components/CurrencySwticher/CurrencySwitcher';
import { Cart } from './components/Cart/Cart';
import { ApolloProvider } from 'react-apollo';
import { ProductInfo } from './components/ProductInfo/ProductInfo';
import { client, PRODUCTS, CURRENCIES_QUERY, CATEGORIES_QUERY } from '../src/api/api';
import {Routes, Route, Navigate, NavLink} from 'react-router-dom';
import { Order } from './components/Order/Order';
import cn from 'classnames';

class App extends React.PureComponent {
  state = {
    categories: [],
    currencies: [],
    selectedCurrency: '$',
    productInfo: null,
    cartProducts: [],
    productCount: 0,
    itemCount: 1,
    products: [],
    categoryProducts: [],
    quantity: 0,
    isCartVisible: false,
    colorId: '',
    otherAttributes: {},
    isCurrencySwitcherShown: false,
    selectedCategory: '',
    loading: '',
    errorState: '',
  }

   componentDidMount() {
    client.query({
      query: PRODUCTS,
    }).then(({ loading, error, data }) => {
      if (loading && !data) this.setState({loading: 'Please wait while we fetch your products!'})
      if (error) this.setState({errorState: `Oops! Something went wrong with fetching products: ${error}`})
      this.setState({
        categoryProducts: data.category.products
      })
    })

    client.query({
      query: CURRENCIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({currencies: data.currencies})
    })

    client.query({
      query: CATEGORIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({
        categories: [...this.state.categories, ...data.categories
          .filter(category => category.name !== 'all')]
      })
    })  
  }

  componentDidUpdate(prevState) {
    if (this.state.cartProducts.find(product => product.id === this.state.productInfo.id)) {
      this.setState({
        isInCart: true,
      });
    }
  }

  handleSelectClick = (event) => {
    this.setState({
      selectedCurrency: event.target.id,
      isCartVisible: false,
    });
  }

  handleShowCartOverlay = () => {
    this.setState({isCartVisible: !this.state.isCartVisible});
  }

  handleHideCartOverlay = () => {
    this.setState({isCartVisible: false});
  }

  handleProductClick = (selectedProduct) => {
    this.setState({
      productInfo: selectedProduct
    });
  }

  handleProductHover = (selectedProduct, allAttributes) => {
    const itemWithColor = selectedProduct.attributes.find(attribute => attribute.name === 'Color');

    if (itemWithColor) {
      this.setState({
        productInfo: {
          ...selectedProduct,
          itemCount: 1,
          baseColor: allAttributes.Color,
          baseAttributes: allAttributes && (allAttributes),
        }
      });
    } else {
      this.setState({
        productInfo: {
          ...selectedProduct,
          itemCount: 1,
          baseAttributes: allAttributes && (allAttributes),
        }
      });
    }
  }

  handleAddToCartClick = (selectedAttributes, price) => {
    const itemInCart = this.state.cartProducts
      .find(product => product.id === this.state.productInfo.id && Object.values(product?.baseAttributes)
      .toString() === Object.values(selectedAttributes)
      .toString())
    if (itemInCart)
    {
      itemInCart.itemCount++;
      itemInCart.price = itemInCart.price += price;

      this.setState({
        cartProducts: [...this.state.cartProducts
          .filter(cartProduct => cartProduct.id !== itemInCart.id), itemInCart],
        quantity: this.state.quantity + 1,
      });
    } else {
      this.setState({
        cartProducts: [...this.state.cartProducts,
          {...this.state.productInfo,
            itemCount: 1,
            selectedColor: selectedAttributes.Color,
            baseAttributes: selectedAttributes && (selectedAttributes),
          }],
        productCount: this.state.productCount + 1,
        quantity: this.state.quantity + 1      
      });
    }

    console.log(itemInCart);
  };

  handleColorSelect = (colorId) => {
    this.setState({colorId: colorId})
  };

  removeItemFromCart = (itemInCart) => {
    this.setState({
      cartProducts: [ ...this.state.cartProducts
        .filter(cartProduct => cartProduct?.id !== itemInCart?.id)]
    })
  }

  changeCartQuantity = (quant) => {
    this.setState({quantity: quant})
  }

  colorIdSetter = (id) => {
    this.setState({colorId: id})
  };

  otherAttributesIdSetter = (name, id) => {
    this.setState({otherAttributes: {...this.state.otherAttributes, [name]: id}});
  };

  handleShowCurrencySwitcher = () => {
    this.setState({isCurrencySwitcherShown: !this.state.isCurrencySwitcherShown})
  }

  handleHideCurrencySwitcher = () => {
    this.setState({isCurrencySwitcherShown: false})
  }

  handleRouteChange = (categoryName) => {
    this.setState({selectedCategory: categoryName});
  }

  render() {
    const {
      categories,
      currencies,
      selectedCurrency,
      productInfo,
      cartProducts,
      categoryProducts,
      isCartVisible,
      isCurrencySwitcherShown,
      selectedCategory,
    } = this.state;

    const {
      handleSelectClick,
      handleProductClick,
      handleAddToCartClick,
      changeCartQuantity,
      removeItemFromCart,
      handleColorSelect,
      handleShowCartOverlay,
      handleHideCartOverlay,
      handleShowCurrencySwitcher,
      handleHideCurrencySwitcher,
      handleProductHover,
      handleRouteChange,
    } = this;

    const productsByCategory = categoryProducts
      .filter(product => product.category === this.state.selectedCategory)

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App__header">
            <Navbar
              currencies={currencies}
              selectedCurrency={selectedCurrency}
              selectedCategory={selectedCategory}
              handleShowCurrencySwitcher={handleShowCurrencySwitcher}
              isCurrencySwitcherShown={isCurrencySwitcherShown}
              productCount={cartProducts.length}
              showCartOverlay={handleShowCartOverlay}
              hideCartOverlay={handleHideCartOverlay}
              hideCurrencySwitcher={handleHideCurrencySwitcher}
              onChangeRoute={handleRouteChange}
            />
          </header>

            <main className="App__main">
              <div
                className={cn(
                  "App__background",
                  {"App__background--visible": isCartVisible}
                )}
                onClick={() => handleHideCartOverlay()}
              >
                {
                  <CartOverlay
                    productsInCart={cartProducts}
                    currency={selectedCurrency}
                    changeCartQuantity={changeCartQuantity}
                    onDeleteItem={removeItemFromCart}
                    isCartVisible={isCartVisible}
                    hideCartOverlay={handleHideCartOverlay}
                  />
                }
              
                <CurrencySwitcher
                  currencies={currencies}
                  isCurrencySwitcherShown={isCurrencySwitcherShown}
                  onSelectCurrency={handleSelectClick}
                />
              </div>

              <Routes>
                <Route
                  path="/home"
                  element={
                    <>
                      <h1 className="App__heading">Welcome to our store</h1>
                      <h3  className="App__text">Please select a department to shop from</h3>
                      <div className="App__categories">
                        {
                          categories.map(({ name }) => (
                            <NavLink
                              to={`/${name}`} 
                              className="App__links Nav__link"
                              onClick={() => handleRouteChange(name)}
                            >
                              {
                                name && (name)
                              }
                            </NavLink>
                          ))
                        }
                      </div>
                    </>
                  }
                />

                {
                  <Route
                    path={`${selectedCategory}`}
                    element={
                      <>
                        <h1 className="App__heading">{`${selectedCategory}`}</h1>
                        <div className="App__products">
                          {      
                            <ProductList
                              products={productsByCategory}
                              currency={selectedCurrency}
                              onProductClick={handleProductClick}
                              onProductHover={handleProductHover}
                              onAddToCart={handleAddToCartClick}
                            /> || <h3>this.state.loading</h3>
                          }
                        </div>
                      </>
                    }
                  />
                }

                <Route
                  path="/"
                  element={<Navigate to="/home" />}
                />

                <Route
                  path="cart"
                  element={
                    <>
                      <h1 className="App__heading">CART</h1>
                      <div className="App__cart">
                        <Cart
                          productsInCart={cartProducts}
                          currency={selectedCurrency}
                          changeCartQuantity={changeCartQuantity}
                          onDeleteItem={removeItemFromCart}
                        />
                      </div>
                    </>
                  }
                />

                <Route
                  path={`/productid/:${productInfo?.id}`}
                  element={
                    <ProductInfo
                      products={categoryProducts}
                      selectedProductId={productInfo?.id}
                      currency={selectedCurrency}
                      onAddToCart={handleAddToCartClick}
                      onColorSelect={handleColorSelect}
                    />
                  }
                />

                <Route
                  path='order'
                  element={
                    <Order
                      orderItems={cartProducts}
                      currency={selectedCurrency}
                    />
                  }              
                />

                <Route
                  path="*"
                  element={(
                    <h1 className="App__heading">Page Not Found</h1>
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
