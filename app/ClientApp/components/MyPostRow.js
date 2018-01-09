import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class DashBoard extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        author: PropTypes.string,
        views: PropTypes.number,
        likes: PropTypes.array,
        comments: PropTypes.array,
        labels: PropTypes.array,
        lastEditTime: PropTypes.object
    };

    static defaultProps = {
        title: 'example blog 1',
        views: 233,
        likes: [ 'id-1', 'id-2', 'id-3' ],
        comments: [],
        lastEditTime: new Date()
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
                    <span className='glyphicon glyphicon-thumbs-up'/> { likes.length }
                </td>
                <td>
                    <span className='glyphicon glyphicon-comment'/> { comments.length }
                </td>
                <td>
                    { lastEditTime.toLocaleDateString() }
                </td>
            </tr>
        );
    }
}