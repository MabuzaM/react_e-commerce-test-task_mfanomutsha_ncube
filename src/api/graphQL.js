import { ApolloClient, gql, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

export const CATEGORIES_QUERY = gql`
  {
    categories {
      name
    }
  }
`

export const PRODUCTS = gql`
  {
    category {
      name
      products {
        id
        name
        inStock
        description
        category
        brand
        gallery
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
      }
    }
  }
`

export const getProductsByCategory = (input) => {
  return gql`
    query Category($input: CategoryInput!) {
      category(input: $input) {
        name = "clothes"
        products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              value
              id
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
    }
  `;
}

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query Category($input: CategoryInput) {
    category(input: $input) {
      name
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;

export const CURRENCIES_QUERY = gql`
  {
    currencies {
      label
      symbol
    }
  }
`

export const GET_PRODUCT_BY_ID = gql`
  query Category($productId: String!) {
    product(id: $productId) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
`

export const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000/' }),
  cache: new InMemoryCache()
});
