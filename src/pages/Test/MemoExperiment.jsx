import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';

const Updates = ({ updates }) => <h4 className={styles.update}>Paints: {updates}</h4>;

const Tile = () => {
  const eventUpdates = React.useRef(0);
  return (
    <div className={styles.tile}>
      <Updates updates={eventUpdates.current++} />
    </div>
  );
};

const TileMemo = React.memo(() => {
  const updates = React.useRef(0);
  return (
    <div className={styles.tile}>
      <Updates updates={updates.current++} />
    </div>
  );
});

export const TestMemo = () => {
  const updates = React.useRef(0);
  const [text, setText] = React.useState('');

  React.useEffect(() => updates.current++);

  return (
    <div className={styles['text-memo-blue-wrapper']}>
      The blue component contains three sub-components. 1 input field and 2 black tiles. If you typed something, you have seen that the left tile and the blue
      tile have updated with every keystroke, while the number of paints of the right tile didnt change. The right tile is wrapped in a React.memo function
      which prevents the function from re-rendering when the props dont change.
      <input value={text} placeholder='Write something' onChange={e => setText(e.target.value)} />
      <Updates updates={updates.current} />
      <Tile />
      <TileMemo />
    </div>
  );
};

// Even with React.memo, the component rerenders whenever its props changes
// So if the props change too often, it might not be a good idea to wrap a component with React.memo
const Button = React.memo(({ handleClick }) => {
  const refCount = useRef(0);
  return <button type='button' onClick={handleClick}>{`button render count ${refCount.current++}`}</button>;
});

export const RenderExample = () => {
  const [isOn, setIsOn] = useState(false);
  // 如果要做 toggle 切換 on off !this.state.isON 狀態，一般來說會建議使用 updater function 而非 Object 的原因是 React 在他的 Synthetic event 會 batch 所有的 setState，
  // 在同時觸發多個 setState 的時候，Object 會用 merge，this.state 就不會是上一個經過 setState 後的值，而是原本的 state，updater function input prevState 則是上一個經過 setState 後的值
  const handleClick = useCallback(() => setIsOn(prevIsOn => !prevIsOn), []); // useCallback prevents component from re-creating -> Button will not rerender

  return (
    <div>
      <h1>{isOn ? 'On' : 'Off'}</h1>
      <Button handleClick={handleClick} />
    </div>
  );
};

Updates.propTypes = {
  updates: PropTypes.number.isRequired,
};

Button.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
