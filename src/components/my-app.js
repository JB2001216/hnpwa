import { Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';
import { connect } from '../../lib/connect-mixin.js';
import { installRouter } from '../../lib/router.js';
import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../../node_modules/@polymer/iron-pages/iron-pages.js';
import '../../node_modules/@polymer/iron-selector/iron-selector.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';

import { store } from '../store.js';
import { navigate, show404 } from '../actions/app.js';

class MyApp extends connect(store)(PolymerElement) {
  static get template() {
    return `
    <style>
      :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;

        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      .drawer-list {
        margin: 0 20px;
      }

      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }
    </style>

    <app-drawer-layout fullbleed>
      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer">
        <app-toolbar>Menu</app-toolbar>
        <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
          <a name="view1" href="[[rootPath]]view1">View One</a>
          <a name="view2" href="[[rootPath]]view2">View Two</a>
          <a name="view3" href="[[rootPath]]view3">View Three</a>
        </iron-selector>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout has-scrolling-region>

        <app-header slot="header" condenses reveals effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="my-icons:menu" drawer-toggle></paper-icon-button>
            <div main-title>My App</div>
          </app-toolbar>
        </app-header>

        <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">
          <my-view1 name="view1"></my-view1>
          <my-view2 name="view2"></my-view2>
          <my-view3 name="view3"></my-view3>
          <my-view404 name="view404"></my-view404>
        </iron-pages>
      </app-header-layout>
    </app-drawer-layout>
`;
  }

  static get is() {
    return 'my-app';
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      // This shouldn't be neccessary, but the Analyzer isn't picking up
      // Polymer.Element#rootPath
      rootPath: {
        type: String,
        value: '/'
      }
    };
  }

  update(state) {
    this.setProperties({
      page: state.app.page,
    });
  }

  ready() {
    super.ready();
    installRouter(this._notifyPathChanged.bind(this));
  }

  _notifyPathChanged() {
    store.dispatch(navigate(window.decodeURIComponent(window.location.pathname)));

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Load page import on demand. Show 404 page if fails
    let loaded;
    switch(page) {
      case 'view1':
        loaded = import('./my-view1.js');
        break;
      case 'view2':
        loaded = import('./my-view2.js');
        break;
      case 'view3':
        loaded = import('./my-view3.js');
        break;
      case 'view404':
        loaded = import('./my-view404.js');
        break;
      default:
        loaded = Promise.reject();
    }

    loaded.then(
      _ => {},
      _ => { store.dispatch(show404()) }
    );
  }
}

window.customElements.define(MyApp.is, MyApp);
