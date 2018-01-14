import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { Link } from 'react-router-dom';
import { getDateString } from '../../utils/util';

export default class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        [ 'onEditBtnClick', 'renderArrayAsCount', 'renderDateTime' ].map(fn => this[fn] = this[fn].bind(this));
    }

    static propTypes = {
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        author: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string,
                email: PropTypes.string
            })
        ]),
        views: PropTypes.number,
        likes: PropTypes.array,
        comments: PropTypes.array,
        labels: PropTypes.array,
        lastEditTime: PropTypes.oneOfType([
            PropTypes.instanceOf(Date),
            PropTypes.string
        ]),
        onClick: PropTypes.func
    };

    onEditBtnClick(e) {
        const { title, views, likes, comments, lastEditTime, author, _id } = this.props,
            { onClick } = this.props; 
        onClick ? onClick(e, {
            _id: _id,
            author: author,
            title: title,
            views: views,
            likes: likes,
            comments: comments,
            lastEditTime: lastEditTime
        }) : null;
    }

    renderArrayAsCount(views) {
        if (Array.isArray(views))
            return views.length;
        if (!views)
            return 0;
        return views;
    }

    renderDateTime(date) {
        if (typeof date === 'string')
            return date;
        return getDateString(date);
    }

    render() {
        const { title, views, likes, comments, lastEditTime } = this.props;
            
        return (
            <tr className='post-table-row'>
                <td>
                    <input type='checkbox'/>
                </td>
                <td>
                    <Link to='/'>{ title }</Link>
                </td>
                <td>
                    <span className='glyphicon glyphicon-eye-open'/> { views }
                </td>
                <td>
                    <span className='glyphicon glyphicon-thumbs-up'/> { this.renderArrayAsCount(likes) }
                </td>
                <td>
                    <span className='glyphicon glyphicon-comment'/> { this.renderArrayAsCount(comments) }
                </td>
                <td>
                    { this.renderDateTime(lastEditTime) }
                </td>
                <td>
                    <button className='btn-sm btn-default' onClick={ this.onEditBtnClick }>Edit</button>
                </td>
            </tr>
        );
    }
}