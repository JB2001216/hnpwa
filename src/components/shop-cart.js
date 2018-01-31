/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'

import { connect } from '../../node_modules/redux-helpers/connect-mixin.js';
import './shop-item.js'

// This element is connected to the redux store.
import { store } from '../store.js';
import { removeFromCart } from '../actions/shop.js';

class ShopCart extends connect(store)(LitElement) {
  render(props) {
    return html`
      <p hidden="${props.cart.addedIds.length !== 0}">Please add some products to cart.</p>
      ${this._displayCart(props.cart).map((item) =>
        html`
          <div>
            <shop-item name="${item.title}" amount="${item.amount}" price="${item.price}"></shop-item>
            <button
                on-click="${(e) => this._removeFromCart(e)}"
                data-index$="${item.id}">
              Remove
            </button>
          </div>
        `
      )}
    `;
  }

  static get is() {
    return 'shop-cart';
  }

  static get properties() { return {
    cart: Object,
    products: Object
  }}

  // This is called every time something is updated in the store.
  update(state) {
    this.products = state.shop.products;
    this.cart = state.shop.cart;
  }

  _displayCart(cart) {
    const items = [];
    for (let id of cart.addedIds) {
      const item = this.products[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }

  _calculateTotal(cart) {
    let total = 0;
    for (let id of cart.addedIds) {
      const item = this.products[id];
      total += item.price * cart.quantityById[id];
    }
    return parseFloat(Math.round(total * 100) / 100).toFixed(2);
  }

  _removeFromCart(event) {
    store.dispatch(removeFromCart(event.target.dataset['index']));
  }
}

window.customElements.define(ShopCart.is, ShopCart);
