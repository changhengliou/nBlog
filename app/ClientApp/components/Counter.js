import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CounterStore from '../store/CounterStore';
import PageLoadBar from './PageLoadBar';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.loading = this.loading.bind(this);
        this.state = {progress: 0};
    }

    loading() {
        var id = setInterval(() => {
            this.setState({progress: this.state.progress + 1});
            if (this.state.progress >= 100)
                clearInterval(id);
        }, 5);
    }

    componentWillMount(){
        this.loading();
    }

    render() {
        return (
            <div>
                <PageLoadBar progress={this.state.progress}/>
                <h1>Counter</h1>
                <p>This is a simple example of a React component.</p>
                <p>Current count: <strong>{ this.props.count }</strong></p>
                <button className="btn btn-default" onClick={ () => { this.props.increment() } }>Increment</button>
            </div>
        );
    }
}

export default connect(
    (state) => state.counter, 
    CounterStore.actionCreators
)(Counter);