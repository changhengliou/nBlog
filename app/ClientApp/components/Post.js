import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as PostStore from '../store/PostStore';
import PostPreview from './PostPreview';
class Post extends React.Component {
    render() {
        return (
            <div>
                <h1>Trending Posts</h1>
                <PostPreview/>
                <PostPreview/>
                <PostPreview/>
                <PostPreview/>
                <PostPreview/>
                <PostPreview/>
            </div>
        );
    }
}

export default connect(
    (state) => state.post, 
    PostStore.actionCreators
)(Post);