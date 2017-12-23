import * as React from 'react';
import { connect } from 'react-redux';
import * as SettingStore from '../store/SettingStore';
import { Link } from 'react-router-dom';

class Setting extends React.Component {
    render() {
        return (
            <div>
                <h1>Setting</h1>
            </div>
        );
    }
}

export default connect(
    (state) => state.setting, 
    SettingStore.actionCreators
)(Setting);