import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserAction } from '../actions/UserActions';
import { IState } from '../states/IState';
import IUser from '../states/IUser';
import CountButton from './CountButton';
import TextBox from './TextBox';

// データは、Storeから渡されるので、プロパティは必要ありません。
const UserForm: React.FC = () => {
  // useSelector でステートの変更を受け取れます。
  const { name, count } = useSelector<IState, IUser>(a => a.user); // -- (a)
  const dispatch = useDispatch(); // -- (b)
  const onNameChange = useCallback((value: string) => {
    // 名前を変更したとき(タイプするたび)のイベント
    dispatch(changeUserAction({ name: value }));
  }, []); // [] は初回のみという意味
  const onCountClick = useCallback(() => {
    // 訪問ボタンを押したときのイベント
    dispatch(changeUserAction({ count: count + 1 }));
    // 関数外の変数は、関数が(再)定義されたときのものに固定化されるので、
    // 関数外の変数を使用するときには、下記のように第2引数の配列にそれを指定して、
    // それが変更されたときに再定義されるようにする
  }, [count]);
  return (
    <div>
      <p>
        <TextBox value={name} type="text" label="ユーザー名" onChangeText={onNameChange} />
      </p>
      <p>
        <CountButton count={count} label="訪問" onClick={onCountClick} />
      </p>
    </div>
  );
};

export default UserForm;
