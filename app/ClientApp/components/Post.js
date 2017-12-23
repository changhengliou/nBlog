import * as React from 'react';
import { connect } from 'react-redux';
import * as PostStore from '../store/PostStore';
import { Link } from 'react-router-dom';

class Post extends React.Component {
    render() {
        return (
            <div>
                <h1>Posts</h1>
            </div>
        );
    }
}

export default connect(
    (state) => state.post, 
    PostStore.actionCreators
)(Post);