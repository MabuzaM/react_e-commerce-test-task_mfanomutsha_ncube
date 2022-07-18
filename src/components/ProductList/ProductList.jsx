import React from 'react';
import './ProductList.scss';
import { ProductCard } from '../ProductCard/ProductCard';
// import { LOAD_PRODUCTS } from '../../graphQl/Queries';
import { gql } from 'apollo-boost';
import { ApolloProvider, graphql, Query } from 'react-apollo';

import { ApolloClient, InMemoryCache, HttpLink, from } from 'apollo-boost';
// import { Interface } from 'readline';

export const getCategories = gql`
  {
    categories {
      name
      products {
        id
        name
        category
        inStock
      }
    }
  }
`

// const client = new ApolloClient(
//   {
//     cache: new InMemoryCache(),
//     link: 'http://localhost:4000'
//   }
// );

const client = new ApolloClient({
  link: 'https://flyby-gateway.herokuapp.com/',
  cache: new InMemoryCache(),
});

class ProductList extends React.PureComponent {
  componentDidMount() {
    // const fetchData = async () => {
    //   const response = await fetch('http://localhost:4000')

    //   const jsonData = await response.json();

    //   return jsonData;
    // }
    // console.log(fetchData().then(jsonData => jsonData));

    client.query({
        query: gql`
          query GetLocations {
            locations {
              id
              name
              description
              photo
            }
          }
        `,
      }).then((result) => console.log(result));

    // const fetchData = () => (
    //   <ApolloProvider client={client}>
    //     <Query query={getCategories}>
    //       {
    //         ({ loading, data }) => {
    //           const { todos } = data;

    //           if (loading) {
    //             return (<p>Loading....</p>);
    //           }

    //           return todos.map((post) => (
    //             <h1>{post.title}</h1>
    //           ));
    //         }
    //       }
    //     </Query>
    //   </ApolloProvider>
    // )

    // console.log(fetchData());
  }

  render () {
    return (
      <ApolloProvider client={client}>
        {
          <>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          </>
        }
      </ApolloProvider>
    );
  }

}

export default graphql(getCategories)(ProductList);
