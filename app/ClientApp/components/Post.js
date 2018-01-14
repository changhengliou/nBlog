import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import request from 'superagent';
import * as PostStore from '../store/PostStore';
import PostPreview from './PostPreview';
import { getDateDiffByDay } from '../../utils/util';
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.renderPosts = this.renderPosts.bind(this);
    }

    componentDidMount() {
        this.props.getPosts();
    }

    renderPosts() {
        var { posts, msg } = this.props;
        if (!Array.isArray(posts)) 
            return <div>loading...</div>;
        
        return posts.map((obj, index) => 
            <PostPreview title={ obj.title }
                         excerpt={ obj.excerpt }
                         lastEditTime={ getDateDiffByDay(new Date(), new Date(obj.lastEditTime)) }
                         lastEditExactTime={ obj.lastEditTime }
                         _id={ obj._id }
                         key={ index }/>)
    }
    
    render() {
        var { posts, msg } = this.props;
        return (
            <div>
                <h1>Trending Posts</h1>
                { this.renderPosts() }
            </div>
        );
    }
}

export default connect(
    (state) => state.post, 
    PostStore.actionCreators
)(Post);