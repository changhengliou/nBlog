import React from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
class PostDetail extends React.Component {
    constructor(props) {
        super(props);
        [ 'renderComments' ].map(fn => this[fn] = this[fn].bind(this));
    }
    static propTypes = {
        title: PropTypes.string,
        excerpt: PropTypes.string,
        content: PropTypes.object,
        comments: PropTypes.array,
        likes: PropTypes.array,
        views: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number
        ]),
        lastEditTime: PropTypes.oneOfType([
            PropTypes.instanceOf(Date),
            PropTypes.string
        ])
    }

    static defaultProps = {
        comments: [],
        likes: [ 1, 2, 3],
        views: 234,
        lastEditTime: '2018-01-11'
    }

    renderComments(comments) {
        return comments.map(obj => {
            return (
                <div>
                    <h3>{ obj.author }</h3>
                    <div>{ obj.remark }</div>
                    <div>{ obj.date }</div>
                </div>
            );
        });
    }

    render() {
        var { title, content, comments, likes, views } = this.props,
            html = stateToHTML(content);
        return (
            <div className='panel panel-default'>
                <h2 className='panel-heading'>{ title }</h2>
                <div className='panel-body'>
                    <div>{ html }</div>
                    <div>likes({ likes.length })</div>
                    <div>views({ views })</div>
                </div>
                <hr/>
                { this.renderComments(comments) }
            </div>
        );
    }
}

export default PostDetail;