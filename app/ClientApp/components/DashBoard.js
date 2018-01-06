import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as DashBoardStore from '../store/DashBoardStore';
import PageLoadBar from './PageLoadBar';

class DashBoard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.loading = this.loading.bind(this);
        this.state = {progress: 0};
        
        let { staticContext } = this.context.router;
        if (staticContext) {
            this.userId = staticContext.requestUrl;
        }
    }
    
    static contextTypes = {
        router: PropTypes.object
    };

    loading() {
        this.id = setInterval(() => {
            this.setState({progress: this.state.progress + 1});
            if (this.state.progress >= 100) {
                clearInterval(this.id);
                this.id = null;
            }
        }, 5);
    }

    componentDidMount(){
        this.loading();
    }

    componentWillUnmount() {
        if(this.id)
            clearInterval(this.id);
    }

    render() {
        return (
            <div>
                <PageLoadBar progress={this.state.progress}/>
                <h1>Hello changheng!</h1>
                <h2>new post!</h2>
                <h2>my porst!</h2>
            </div>
        );
    }
}

export default connect(
    (state) => state.dashboard, 
    DashBoardStore.actionCreators
)(DashBoard);