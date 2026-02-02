import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EmojiPicker from '../src/index';

const App = () => {
  const [emojis, setEmojis] = React.useState('');
  const [filterString, setFilterString] = React.useState('');

  return (
    <div>
      <h2>Emojis: {emojis}</h2>
      <input
        type="text"
        value={filterString}
        onChange={(e) => setFilterString(e.target.value)}
        placeholder="Type to filter emojis..."
      />
      {/* External control of emoji filter via filterString prop */}
      {/* When filterString is provided, hide the internal search and use external control */}
      <EmojiPicker
        filterString={filterString}
        onEmojiListSearch={(searchString) => console.log(searchString)}
        skinTonesDisabled={true}
        onEmojiClick={(e) => setEmojis(emojis + e.emoji)}
      />
    </div>
  );
};

const container = document.getElementById('root');
ReactDOM.render(<App />, container);
