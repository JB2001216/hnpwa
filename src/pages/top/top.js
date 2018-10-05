import { html } from '@polymer/lit-element';
import { PageViewElement } from '../../utils/page-view-elemet';
import { SharedStyles } from '../../styles/shared-styles';
// redux helpers
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../redux/store';
import { fetchTopStories } from '../../redux/top/actions';

export class Top extends connect(store)(PageViewElement) {
    static get properties() {
        return {
            topStories: {type: Array},
            page: {type: Number}
        };
    }

    _stateChanged(state) {
        this.topStories = state.top.topStories;
        this.page = state.page.show;
    }

    firstUpdated(){
        store.dispatch(fetchTopStories(this.page));
    }

    render() {
        return html`
      <!-- Styles -->
      ${SharedStyles}
      <!-- Content -->
      <section>
        <h2>Top</h2>        
      </section>
    `;
    }
}
