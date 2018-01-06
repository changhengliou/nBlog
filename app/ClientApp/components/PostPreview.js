import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class PostPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }
    static propTypes = {
        title: PropTypes.string,
        avatar: PropTypes.string,
        excerpt: PropTypes.string,
        lastEditTime: PropTypes.string,
        lastEditExactTime: PropTypes.string,
        views: PropTypes.number,
        comments: PropTypes.number,
        showExactTime: PropTypes.bool
    }

    static defaultProps = {
        title: 'My title',
        avatar: 'https://pbs.twimg.com/profile_images/939487131713581057/SWWjueNP_bigger.jpg',
        excerpt: 'Well, now that collusion with Russia is proving to be a ' +
                 'total hoax and the only collusion is with Hillary Clinton and ' + 
                 'the FBI/Russia, the Fake News Media (Mainstream) and this phony ' + 
                 'new book are hitting out at every new front imaginable. They should ' + 
                 'try winning an election. Sad!',
        lastEditTime: '2 days ago',
        lastEditExactTime: '2018-01-15 18:33:22',
        views: 335,
        comments: 24,
        showExactTime: true
    }
    render() {
        var { title, avatar, excerpt, lastEditTime, lastEditExactTime, views, comments, showExactTime } = this.props,
            exactTime = showExactTime && this.state.show ? 
                        <div className="popover">{ lastEditExactTime }</div> : 
                        null;
        return (
            <div className="post-preview-card">
                <div className="post-preview-content">
                    <div>
                        <Link to="/">
                            <img className="avatar" src={ avatar }></img>
                        </Link>
                        <span className="post-preview-title">{ title }</span>
                    </div>
                    <div>{ excerpt }</div>
                    <div>
                        <div style={{ textAlign: 'right' }}>Read more...</div>
                        <div className="post-preview-footer">
                            <span onMouseEnter={ () => this.setState({ show: true }) }
                                  onMouseLeave={ () => this.setState({ show: false }) }>
                                { lastEditTime }
                            </span>
                            { exactTime }
                            <span className="post-preview-stats">Views ({ views }) Comments ({ comments })</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostPreview;