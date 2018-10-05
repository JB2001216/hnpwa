import { LitElement, html } from '@polymer/lit-element';
import { ListItemStyle } from './styles';
import { starIcon, userIcon, clockIcon, commentIcon } from '../../icons';

export class ListItem extends LitElement {
    static get properties() {
        return {
            id: {type: Number},
            title: {type: String},
            points: {type: Number},
            user: {type: String},            
            time_ago: {type: String},
            comments_count: {type: Number},            
            url: {type: String},
            domain: {type: String}
        };
    }

    render() {
        const { 
            id, 
            title, 
            points, 
            user,            
            time_ago, 
            comments_count,             
            url, 
            domain 
        } = this;

        return html`
            <!-- Styles -->
            ${ListItemStyle}

            <!-- Content -->
            <div class='list-item-container'>                
                <div class='list-item-title-container'>
                    <a href="${url}">${title}</a>
                    <span>(${domain})</span>                    
                </div>
                <div class='list-item-information'>
                    <span>${starIcon} ${points}</span>                    
                    <span>${userIcon} <a href="/user/${user}">${user}</a></span>
                    <span>${commentIcon}<a href='/comments/${id}'>${comments_count} comments</a></span>
                    <span>${clockIcon} ${time_ago}</span>
                </div>
            </div>
        `;
    }
}