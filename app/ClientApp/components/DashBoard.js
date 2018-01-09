import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import request from 'superagent';
import * as DashBoardStore from '../store/DashBoardStore';
import PageLoadBar from './PageLoadBar';
import MyPostRow from './MyPostRow';

class DashBoard extends React.Component {
    constructor(props, context) {
        super(props, context);
        // this.state = { progress: 0, editorState: EditorState.createWithContent(convertFromRaw()) };
        [ 'loading', 'uploadImageCallBack' ].map(fn => 
            this[fn] = this[fn].bind(this));
        let { staticContext } = this.context.router;
        if (staticContext) {
            this.userId = staticContext.requestUrl;
        }
    }
    
    static contextTypes = {
        router: PropTypes.object
    };

    uploadImageCallBack(img) {
        return request.post('https://api.imgur.com/3/image')
               .set('Authorization', 'Client-ID 8d26ccd12712fca')
               .attach('image', img)
               .on('progress', e => console.log(e.percent))
               .then(res => resolve(JSON.parse(res.text)))
               .catch(err => reject(err));
    }

    loading() {
        var { progress, onProgressChanged } = this.props;
        this.id = setInterval(() => {
            onProgressChanged(++progress);
            if (progress >= 100) {
                clearInterval(this.id);
                this.id = null;
            }
        }, 5);
    }

    componentDidMount(){
        this.loading();
    }

    componentWillUnmount() {
        if (this.id)
            clearInterval(this.id);
    }

    render() {
        const { progress, editorState, onEditorChanged } = this.props;
        const editor = typeof window === 'undefined' ? null : 
                            <Editor editorState={ editorState }
                                    wrapperClassName='post-editor-wrapper' 
                                    editorClassName='post-editor'
                                    onEditorStateChange={ onEditorChanged } 
                                    toolbar={ {
                                                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                                                image: {
                                                    uploadCallback: this.uploadImageCallBack,
                                                    alt: { present: true, mandatory: false },
                                                },
                                                textAlign: {
                                                    inDropdown: true,
                                                },
                                                list: {
                                                    inDropdown: true,
                                                }
                                            } }
                            />;
        return (
            <div>
                <PageLoadBar progress={ progress }/>
                <h2>Hello changheng!</h2>
                <div>
                    <h3 style={ { display: 'inline-block' } }>Write a new post =)</h3>
                    <div className='btn-group post-title-btn'>
                        <button className='btn btn-default'>publish</button>
                        <button className='btn btn-default'>draft</button>
                        <button className='btn btn-default'>discard</button>
                        <button className='btn btn-default'>preview</button>
                    </div>
                </div>
                <h4>Title:</h4>
                <input className='post-input' type='text'/>
                <h4>Excerpt:</h4>
                <textarea className='post-input' rows='4'/>
                <h4>Content:</h4>
                { editor }
                <h3>My posts</h3>
                <table style={ { width: '100%' } }>
                    <thead style={ { display: 'none' } }/>
                    <tbody>
                        <MyPostRow/>
                        <MyPostRow/>
                        <MyPostRow/>
                        <MyPostRow/>
                        <MyPostRow/>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    (state) => state.dashboard, 
    DashBoardStore.actionCreators
)(DashBoard);