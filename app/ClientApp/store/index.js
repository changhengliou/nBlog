import * as PostDetail from './PostDetailStore';
import * as Post from './PostStore';
import * as DashBoard from './DashBoardStore';
import * as Setting from './SettingStore';
import * as Global from './GlobalStore';

export const reducers = {
    global: Global.reducer,
    postdetail: PostDetail.reducer,
    dashboard: DashBoard.reducer,
    post: Post.reducer,
    setting: Setting.reducer
};