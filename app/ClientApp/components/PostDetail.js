import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as PostDetailStore from '../store/PostDetailStore';
import { getDateTimeString } from '../../utils/util';
class PostDetail extends React.Component {
    constructor(props) {
        super(props);
        [ 'renderComments', 'renderHtmlMarkup' ].map(fn => this[fn] = this[fn].bind(this));
    }

    componentDidMount() {
        var { getPost, match } = this.props;
        getPost(match.params.postId);
    }

    static propTypes = {
        title: PropTypes.string,
        content: PropTypes.string,
        comments: PropTypes.array,
        likes: PropTypes.array,
        views: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number
        ]),
        lastEditTime: PropTypes.oneOfType([
            PropTypes.instanceOf(Date),
            PropTypes.string
        ]),
        // if empty, render the post, otherwise, display current status
        status: PropTypes.string,
    }

    static defaultProps = {
        comments: [],
        likes: [ 1, 2, 3],
        views: 234,
        lastEditTime: '2018-01-11'
    }

    renderComments(comments) {
        if (comments.length == 0)
            return <div style={ { textAlign: 'center', marginBottom: '20px' } }>No comments yet...</div>
        return comments.map((obj, index) => {
            let btnDelete = typeof window === 'object' && obj.author === window.sessionStorage.name ? 
                                <button className='btn btn-sm btn-primary' 
                                        style={ { marginRight: '5px' } } 
                                        data-id={`${obj._id}`}
                                        onClick={ this.props.onRemoveComment }>
                                    Remove
                                </button> : 
                                null;
            return (
                <div key={index} style={ { padding: '4px 12px' } }>
                    <strong>{ obj.author }</strong>
                    <div>
                        <p style={ { textOverflow: 'ellipsis', display: 'inline-block', width: '59%', overflow: 'auto' } }>{ obj.remark }</p>
                        <div style={ { textOverflow: 'ellipsis', display: 'inline-block', float: 'right' } }>
                            { btnDelete }
                            { getDateTimeString(new Date(obj.date)) }
                        </div>
                    </div>
                </div>
            );
        });
    }

    renderHtmlMarkup(html) {
        return { __html: html };
    }

    render() {
        var { title, content, comments, likes, views, status, onCommentSubmit } = this.props;

        return status ? <h1>{ status }</h1> : (
            <div>
                <div className='panel panel-default' style={ { marginTop: '20px' } }>
                    <div className='panel-heading' style={ { fontSize: '24px' } }>{ title }</div>
                    <div className='panel-body'>
                        <div dangerouslySetInnerHTML={ this.renderHtmlMarkup(content) }/>
                        <div style={ { textAlign: 'right' } }>
                            likes({ likes.length }) views({ views })
                        </div>
                    </div>
                    <hr/>
                    { this.renderComments(comments) }
                </div>
                <div className='form-group'>
                    <label>Leave a comment:</label>
                    <form onSubmit={ onCommentSubmit } action='/zzz' name='commentForm'>
                        <textarea className='form-control input-sm' type='text' row='4' name='remark'/>
                        <div style={ { float: 'right', marginTop: '10px' } }>
                            <input type='button' 
                                   value='Submit'
                                   onClick={ (e) => document.forms.commentForm.dispatchEvent(new Event('submit')) } 
                                   className='btn btn-primary btn-sm'/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => state.postdetail,
    PostDetailStore.actionCreators
)(PostDetail);