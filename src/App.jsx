import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import './App.scss';
import { CartOverlay } from './components/CartOverlay/CartOverlay';
import { CurrencySwitcher } from './components/CurrencySwticher/CurrencySwitcher';
import { Cart } from './components/Cart/Cart';
import { ApolloProvider } from '@apollo/client';
import ProductInfo from './components/ProductInfo/ProductInfo';
import {
  client,
  GET_PRODUCTS_BY_CATEGORY,
  CURRENCIES_QUERY,
  CATEGORIES_QUERY,
} from './api/graphQL';
import {
  Routes,
  Route,
  Navigate,
  NavLink
} from 'react-router-dom';
import { Order } from './components/Order/Order';
import cn from 'classnames';
import { convertObjectToString } from './helpers/helperFunctions';
import { ProductCard } from './components/ProductCard/ProductCard';

class App extends React.PureComponent {
  state = {
    categories: [],
    selectedId: '',
    currencies: [],
    selectedCurrency: '$',
    productInfo: null,
    cartProducts: [],
    productCount: 0,
    categoryProducts: [],
    quantity: 0,
    isCartVisible: false,
    isCurrencySwitcherShown: false,
    selectedCategory: '',
    loading: false,
    errorState: false,
  }

   componentDidMount() {
    client.query({
      query: CURRENCIES_QUERY,
    }).then(({loading, error, data }) => {
      if (loading && !data) this.setState({loading: true})
      if (error) this.setState({errorState: true})
      this.setState({currencies: data.currencies})
    })

    client.query({
      query: CATEGORIES_QUERY,
    }).then(({loading, error, data }) => {
      if (loading && !data) this.setState({loading: true})
      if (error) this.setState({errorState: true})
      this.setState({
        categories: [...this.state.categories, ...data.categories
          .filter(category => category.name)]
      })
    })
  }

  componentDidUpdate() {
    const { selectedCategory } = this.state;

    if (this.state.cartProducts.find(product => product.id === this.state.productInfo.id)) {
      this.setState({
        isInCart: true,
      });
    }

    client.query(
      {query: GET_PRODUCTS_BY_CATEGORY, variables: {input: {title: this.state.selectedCategory}}}
    ).then(({ loading, error, data }) => {
      if (loading && !data) this.setState({loading: true})
      if (error) this.setState({errorState: true})

      this.setState({
        categoryProducts: data.category.products
      })
    })
  }

  handleSelectClick = (event) => {
    this.setState({
      selectedCurrency: event.target.id,
      isCartVisible: false,
      isCurrencySwitcherShown: false,
    });
  }

  handleShowCartOverlay = () => {
    this.setState({isCartVisible: !this.state.isCartVisible});
  }

  handleHideCartOverlay = () => {
    this.setState({isCartVisible: false});
  }

  checkIfProductIsInCart = (selectedProduct, selectedAttributes) => {
    if (this.state.cartProducts !== []) {
      return this.state.cartProducts?.find(
        product => (product.id + convertObjectToString(product?.baseAttributes) === selectedProduct.id + convertObjectToString(selectedAttributes)) 
      )        
    }

    return;
  }

  handleProductClick = (selectedProduct, allAttributes) => {
    const itemWithColor = selectedProduct.attributes.find(attribute => attribute.name === 'Color');
    const productCount = this.checkIfProductIsInCart(selectedProduct, allAttributes)
      ? (this.checkIfProductIsInCart(selectedProduct, allAttributes).itemCount)
      : (1)

    if (itemWithColor) {
      this.setState({
        productInfo: {
          ...selectedProduct,
          itemCount: productCount,
          baseColor: allAttributes.Color,
          baseAttributes: allAttributes && (allAttributes),
        }
      });
    } else {
      this.setState({
        productInfo: {
          ...selectedProduct,
          itemCount: productCount,
          baseAttributes: allAttributes && (allAttributes),
        }
      });
    }
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

  handleAddToCartWithBaseAttributes = (selectedProduct, selectedAttributes, price) => {
    if (this.state.cartProducts !== []) {
      this.setState({
        cartProducts: [...this.state.cartProducts,
          {...selectedProduct,
            itemCount: 1,
            imgUrlIndex: 0,
            baseColor: selectedAttributes.Color,
            baseAttributes: {...selectedAttributes},
          }],
        productCount: this.state.productCount + 1,
        quantity: this.state.quantity + 1      
      });
    }

    const itemInCart = this.checkIfProductIsInCart(selectedProduct, selectedAttributes); 

    if (itemInCart) {
      const updatedProduct = {...itemInCart};
      updatedProduct.itemCount++;
      updatedProduct.price += price;
      
      this.setState({
        cartProducts: [...this.state.cartProducts.filter(cartProduct => (
          cartProduct.id !== updatedProduct.id
            && convertObjectToString(cartProduct?.baseAttributes) !== convertObjectToString(updatedProduct.baseAttributes)
        )), {...updatedProduct}],
      });

    } else {
      this.setState({
        cartProducts: [...this.state.cartProducts,
          {...this.state.productInfo,
            itemCount: 1,
            imgUrlIndex: 0,
            baseColor: selectedAttributes.Color,
            baseAttributes: {...selectedAttributes},
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
      cartProducts: [...this.state.cartProducts
        .filter(cartProduct => {
          return cartProduct?.id !== itemInCart?.id &&
            convertObjectToString(cartProduct?.baseAttributes) !== convertObjectToString(itemInCart?.baseAttributes)
        })]
    })
  }

  changeCartQuantity = (quant) => {
    this.setState({quantity: quant})
  }

  handleShowCurrencySwitcher = () => {
    this.setState({isCurrencySwitcherShown: !this.state.isCurrencySwitcherShown})
  }

  handleHideCurrencySwitcher = () => {
    this.setState({isCurrencySwitcherShown: false})
  }

  handleRouteChange = (categoryName) => {
    this.setState({selectedCategory: categoryName});

  //   client.query(
  //     {query: GET_PRODUCTS_BY_CATEGORY, variables: {input: {title: this.state.selectedCategory}}}
  // ).then(({ loading, error, data }) => {
  //   if (loading && !data) this.setState({loading: true})
  //   if (error) this.setState({errorState: true})

  //   this.setState({
  //     categoryProducts: data.category.products
  //   })
  // })
  }

  handleShowAddToCartIcon = (id) => {
    this.setState({selectedId: id});
  }

  handleHideAddToCartIcon = (id) => {
    this.setState({selectedId: id});
  }

  render() {
    const {
      categories,
      currencies,
      selectedId,
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
      handleAddToCartWithBaseAttributes,
      handleAddToCartClick,
      changeCartQuantity,
      removeItemFromCart,
      handleColorSelect,
      handleShowCartOverlay,
      handleHideAddToCartIcon,
      handleHideCartOverlay,
      handleShowCurrencySwitcher,
      handleHideCurrencySwitcher,
      handleProductHover,
      handleRouteChange,
      handleShowAddToCartIcon,
    } = this;

    let productsByCategory = [];

    if (selectedCategory === 'all') {
      productsByCategory = [...categoryProducts]
    } else {
      productsByCategory = categoryProducts
    }

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
              <div
                className={cn(
                  "App__background",
                  {"App__background--visible": isCartVisible}
                )}
                onClick={() => handleHideCartOverlay()}
              >
             
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
                              // onClick={() => this.setState({selectedCategory: name})}
                              key={name}
                            >
                              {
                                name && (name)
                              }
                            </NavLink>
                          )) || this.state.errorState || this.state.loading
                        }
                      </div>
                    </>
                  }
                />

                {
                  <Route
                    path="/:selectedCategory"
                    element={
                      <>
                        <h1 className="App__heading">{`${selectedCategory}`}</h1>
                        <div className="App__products">
                          {productsByCategory.map(product => {
                            return (
                              <ProductCard
                                selectedCategory={selectedCategory}
                                product={product}
                                currency={selectedCurrency}
                                selectedProductId={selectedId}
                                onShowAddToCartIcon={handleShowAddToCartIcon}
                                onHideAddToCartIcon={handleHideAddToCartIcon}
                                onProductClick={handleProductClick}
                                onProductHover={handleProductHover}
                                onAddToCart={handleAddToCartClick}
                                onAddToCartIconClick={handleAddToCartWithBaseAttributes}
                              />
                            )
                          })
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
                  path={`/${selectedCategory}/:productId`}
                  element={
                    <ProductInfo
                      // products={categoryProducts}
                      selectedProductId={productInfo?.id}
                      currency={selectedCurrency}
                      onAddToCart={handleAddToCartWithBaseAttributes}
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
