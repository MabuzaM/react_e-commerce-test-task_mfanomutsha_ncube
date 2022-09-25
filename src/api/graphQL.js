import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

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

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GET_PRODUCTS_BY_CATEGORY($input: CategoryInput) {
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
  query Product($productId: String!) {
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
`

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});
