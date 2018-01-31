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

// This element is connected to the redux store.
import { store } from '../store.js';
import { getAllProducts, addToCart } from '../actions/shop.js';

class ShopProducts extends connect(store)(LitElement) {
  static get is() {
    return 'shop-products';
  }

  static get properties() { return {
    products: Object
  }}

  render(props) {
    return html`
      ${Object.values(props.products).map((item) =>
        html`
          <div>
            <shop-item name="${item.title}" amount="${item.inventory}" price="${item.price}"></shop-item>
            <button
                disabled="${item.inventory === 0}"
                on-click="${(e) => this.addToCart(e)}"
                data-index$="${item.id}">
              ${item.inventory === 0 ? 'Sold out' : 'Add to cart'}
            </button>
          </div>
        `
      )}
    `;
  }

  ready() {
    super.ready();
    store.dispatch(getAllProducts());
  }

  // This is called every time something is updated in the store.
  update(state) {
    this.products = state.shop.products;
  }

  addToCart(event) {
    store.dispatch(addToCart(event.target.dataset['index']));
  }
}

window.customElements.define(ShopProducts.is, ShopProducts);
