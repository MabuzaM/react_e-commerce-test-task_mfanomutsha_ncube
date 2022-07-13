// import { gql } from '@apollo/client';
import { gql } from 'apollo-boost';
export const LOAD_PRODUCTS = gql`

`

export const LOAD_CATEGORIES = gql`
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

export const GET_PRODUCT = gql`

`
