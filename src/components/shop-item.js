/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'

// This element is *not* connected to the redux store.
class ShopItem extends LitElement {
  static get is() {
    return 'shop-item';
  }

  static get properties() {
    return {
      name: String,
      amount: String,
      price: String
    }
  }

  render(props) {
    return html`
      ${props.name}:
      <span hidden="${props.amount === 0}">${props.amount}: * </span>
      $${props.price}:
      </span>
    `;
  }
}

window.customElements.define(ShopItem.is, ShopItem);
