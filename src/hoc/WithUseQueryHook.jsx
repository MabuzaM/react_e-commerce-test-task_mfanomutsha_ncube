import React, { FC, PureComponent } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY, GET_PRODUCT_BY_ID } from '../api/graphQL';

const WithUseQueryHook = ({ selectedCategory }) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {input: {title: selectedCategory}}
  });

  class EnhancedComponent extends PureComponent {
    render() {
      console.log(data)
      return;
    }
  }

  return <EnhancedComponent />;
}

export default WithUseQueryHook;
