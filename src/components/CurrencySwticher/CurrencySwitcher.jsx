import classNames from 'classnames';
import React from 'react';
import './CurrencySwitcher.scss';

export class CurrencySwitcher extends React.PureComponent {
  constructor(props) {
    super(props)
    props = {
      currencies: [],
      isCurrencySwitcherShown: false,
      onSelectCurrency: () => undefined,
    }
  }
  render() {
    const {
      currencies, 
      isCurrencySwitcherShown,
      onSelectCurrency,
    } = this.props;

    return (
      <article className={classNames(
        "CurrencySwitcher",
        {"CurrencySwitcher--visible" :isCurrencySwitcherShown}
      )}>
        {
          currencies?.map(({ label, symbol }) => (
            <p
              className="CurrencySwitcher__option" 
              key={label} 
              value={symbol}
              id={symbol}
              onClick={(event) => {
                onSelectCurrency(event)
              }}
            >
                {symbol} {' '} 
                {label}
            </p>
          ))
        }
      </article>
    )
  }
}