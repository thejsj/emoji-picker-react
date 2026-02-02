import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EmojiPicker from '../src/index';

const App = () => {
  const [emojis, setEmojis] = React.useState('');
  const [filterString, setFilterString] = React.useState('');
  return (
    <div>
      <h2>Emojis: {emojis}</h2>
      <input type="text" value={filterString} onChange={(e) => setFilterString(e.target.value)} />
      <EmojiPicker onEmojiClick={(e) => setEmojis(emojis + e.emoji)} searchDisabled={false}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
