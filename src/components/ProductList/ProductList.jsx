import React from 'react';
import './ProductList.scss';
// import { ProductCard } from '../ProductCard/ProductCard';
// import { LOAD_PRODUCTS } from '../../graphQl/Queries';
import { gql } from 'apollo-boost';
import { ApolloProvider, graphql, Query } from 'react-apollo';

import { ApolloClient, InMemoryCache, HttpLink, from } from 'apollo-boost';
// import { Interface } from 'readline';

export const getCategories = gql`
  {
    todos {
      id
      title
    }
  }
`

const client = new ApolloClient(
  {
    cache: new InMemoryCache(),
    link: 'https://jsonplaceholder.typicode.com/todos'
  }
);

class ProductList extends React.PureComponent {
  componentDidMount() {
    const fetchData = () => {
      return (<Query query={getCategories}>
        {
          ({ loading, data }) => {
            const { todos } = data;

            if (loading) {
              return (<p>Loading....</p>);
            }

            return todos.map((post) => (
              <h1>{post.title}</h1>
            ));
          }
        }
      </Query>);
    }
  }

  render () {
    console.log(this.props);

    return (
      <ApolloProvider client={client}>
        { this.componentDidMount.fetchData }
      </ApolloProvider>
    );
  }

}

export default graphql(getCategories)(ProductList);
