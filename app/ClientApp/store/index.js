import * as Counter from './CounterStore';
import * as Post from './PostStore';
import * as DashBoard from './DashBoardStore';
import * as Setting from './SettingStore';
import * as Global from './GlobalStore';

export const reducers = {
    global: Global.reducer,
    counter: Counter.reducer,
    dashboard: DashBoard.reducer,
    post: Post.reducer,
    setting: Setting.reducer
};