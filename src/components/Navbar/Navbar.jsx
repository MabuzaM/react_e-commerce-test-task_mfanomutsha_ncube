import React from 'react';
import './Navbar.scss';
import logo from '../../icons-svg/a-logo.svg';
import currenciesArrow from '../../icons-svg/currenciesButton.svg';
import cart from '../../icons-svg/empty-cart.svg';
import { CATEGORIES_QUERY, CURRENCIES_QUERY, client } from '../../api/api';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

export class Navbar extends React.PureComponent {
  state = {
    categories: [{name: "home"}],
    currencies: [],
  }

  constructor(props) {
    super(props)
    props = {
      handleShowCurrencies: () => undefined,
      hideCurrencySwitcher: () => undefined,
      isCurrencySwitcherShown: false,
      selectedCurrency: '$',
      productCount: 0,
      showCartOverlay: () => undefined,
      hideCartOverlay: () => undefined,
      onChangeRoute: () => undefined,
    };
  }

  componentDidMount() {
    client.query({
      query: CATEGORIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({
        categories: [...this.state.categories, ...data.categories
          .filter(category => category.name !== 'all')]
      })
    }) 

    client.query({
      query: CURRENCIES_QUERY,
    }).then(({loading, error, data }) => {
      this.setState({currencies: data.currencies})
    })  
  }

  render () {
    const { categories } = this.state;
    const {
      showCartOverlay,
      handleShowCurrencySwitcher,
      hideCurrencySwitcher,
      selectedCurrency,
      productCount,
      hideCartOverlay,
      isCurrencySwitcherShown,
      onChangeRoute,
    } = this.props;

    return (
      <>
        <nav className="Nav">
          <ul className="Nav__list">
            {
              categories.map(({ name }) => (
                <li
                  key={name}
                  className="Nav__item"
                  onClick={() => {
                    onChangeRoute(name);
                    hideCartOverlay();
                  }}
                >
                  <NavLink to={name} className="Nav__link">
                    {
                      name && (name)
                    }
                  </NavLink>
                </li>
              ))
            }
          </ul>
        </nav>

        <NavLink
          to="/home"
          className="Nav__logo"
          onClick={() => hideCartOverlay()}
        >
          <img src={logo} alt="a logo" />
        </NavLink>

        <article className="Nav__controls">
          <div
            className="Nav__currency-switcher"
            onClick={() => {
              handleShowCurrencySwitcher();
              hideCartOverlay();
            }}
          >
            <p className="Nav__currency-selected">
              {selectedCurrency}
            </p>
            <img
              src={currenciesArrow}
              alt="arrow"
              className={classNames(
                "Nav__currency-arrow",
                {"Nav__currency-arrow--open": isCurrencySwitcherShown}
              )}
            />
          </div>

          <div
            className="Nav__cart"
            onClick={() => {
              showCartOverlay();
              hideCurrencySwitcher();
            }}
            >
              <div className="Nav__cart-count">{productCount}</div>
              <img src={cart} alt="cart" className="Nav__cart-image"/>
          </div>
        </article>
      </>
    );
  }
}
