import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class PostPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
        this.renderLastEditTime = this.renderLastEditTime.bind(this);
    }

    static propTypes = {
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        avatar: PropTypes.string,
        excerpt: PropTypes.string,
        lastEditTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        lastEditExactTime: PropTypes.string,
        labels: PropTypes.array,
        views: PropTypes.number,
        comments: PropTypes.number,
        showExactTime: PropTypes.bool
    }

    static defaultProps = {
        avatar: 'https://pbs.twimg.com/profile_images/939487131713581057/SWWjueNP_bigger.jpg',
        labels: [],
        views: 335,
        comments: 24,
        showExactTime: true
    }
    
    renderLastEditTime(time) {
        if (!time || time < 1)
            return 'Less than 1 day ago';
        if (time == 1)
            return '1 day ago';
        return `${time} days ago`;
    }
    render() {
        var { _id, title, avatar, excerpt, lastEditTime, lastEditExactTime, views, comments, labels, showExactTime } = this.props,
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
                        <div style={{ textAlign: 'right' }}>
                            <Link to={`/${_id}/post`} style={ { color: '#337ab7' } }>Read more...</Link>
                        </div>
                        <div className="post-preview-footer">
                            <span onMouseEnter={ () => this.setState({ show: true }) }
                                  onMouseLeave={ () => this.setState({ show: false }) }>
                                { this.renderLastEditTime(lastEditTime) }
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