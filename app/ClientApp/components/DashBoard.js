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
        var id = setInterval(() => {
            this.setState({progress: this.state.progress + 1});
            if (this.state.progress >= 100)
                clearInterval(id);
        }, 5);
    }

    componentDidMount(){
        this.loading();
    }

    render() {
        return (
            <div>
                <PageLoadBar progress={this.state.progress}/>
                <h1>{ typeof window === 'undefined' ? this.userId.replace('/', '') : this.props.match.params.userId }'s dashboard</h1>
            </div>
        );
    }
}

export default connect(
    (state) => state.dashboard, 
    DashBoardStore.actionCreators
)(DashBoard);