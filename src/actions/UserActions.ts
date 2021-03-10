import { actionCreatorFactory } from 'typescript-fsa';
import IUser from '../states/IUser';

// action creator を作成する
// 引数は、アクションのグループごとに一意
// ファイル単位で、1つの creator があれば良い
const actionCreator = actionCreatorFactory('user-action');

// アクションの定義
// 引数は（同じ creator から生成される）アクションごとに一意
export const changeUserAction = actionCreator<Partial<IUser>>('change-user');
