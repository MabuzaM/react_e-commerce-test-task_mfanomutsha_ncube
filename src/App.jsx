import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import './App.scss';
import ProductList from './components/ProductList/ProductList';
import {
  ApolloProvider,
} from 'react-apollo';

import { ApolloClient, InMemoryCache, HttpLink, from } from 'apollo-boost';
import { ProductInfo } from './components/ProductInfo/ProductInfo';
import { Cart } from './components/Cart/Cart';

const link = from(
  [
    new HttpLink({ uri: 'https://jsonplaceholder.typicode.com/todos' }),
  ]
);

const client = new ApolloClient(
  {
    cache: new InMemoryCache(),
    link: link,
  }
);

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App__header">
          <Navbar />
        </header>

        <main className="App__main">
          <h2 className="App__heading">
            Category name
          </h2>

          <div className="App__products">
            <ProductList />
          </div>
        </main>
        <Cart />
        {'       '}
        <ProductInfo />
      </div>
    </ApolloProvider>
  );
}

export default App;
