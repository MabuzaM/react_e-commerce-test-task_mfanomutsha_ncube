import React from 'react';
import './Navbar.scss';
// import { NavLink, Routes, Route, Link } from 'react-router-dom';
import logo from '../../icons-svg/a-logo.svg';
import cart from '../../icons-svg/empty-cart.svg';

export class Navbar extends React.PureComponent {
  render () {
    console.log(logo);

    return (
      <>
        <nav className="Nav">
          <ul className="Nav__list">
            <li className="Nav__item">
              <a className="Nav__link" href="#/">
              Women
              </a>
            </li>
            <li className="Nav__item">
              <a className="Nav__link" href="#/">
                Men
              </a>
            </li>
            <li className="Nav__item">
              <a className="Nav__link" href="#/">
                Kids
              </a>
            </li>
          </ul>
        </nav>

        <a href="/" className="Nav__logo">
          <img src={logo} alt="a logo" />
        </a>

        <article className="Nav__controls">
          <select
            name="currency"
            id="currency"
            className="Nav__currency-switcher"
          >
            <option value="$">&#36; USD</option>
            <option value="€">&euro; EUR</option>
            <option value="¥">&yen; JPY</option>
          </select>

          <a href="#/" className="Nav__cart">
            <img src={cart} alt="cart" />
          </a>
        </article>
      </>
    );
  }
}
