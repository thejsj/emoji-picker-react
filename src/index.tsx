import * as React from 'react';

import EmojiPickerReact from './EmojiPickerReact';
import ErrorBoundary from './components/ErrorBoundary';
import { PickerConfig } from './config/config';
import { DataEmoji } from './dataUtils/DataTypes';
export { EmojiProperties, type DataEmoji } from './dataUtils/DataTypes';
import {
  MutableConfigContext,
  useDefineMutableConfig
} from './config/mutableConfig';

export { ExportedEmoji as Emoji } from './components/emoji/ExportedEmoji';

export {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  type EmojiClickData,
  SuggestionMode,
  SkinTonePickerLocation
} from './types/exposedTypes';

export { emojiByUnified } from './dataUtils/emojiSelectors';

export interface PickerProps extends PickerConfig {
  filterString?: string;
  onEmojiListSearch?: (emojis: DataEmoji[] | null) => void;
}

export default function EmojiPicker(props: PickerProps) {
  const MutableConfigRef = useDefineMutableConfig({
    onEmojiClick: props.onEmojiClick,
    onReactionClick: props.onReactionClick,
    onSkinToneChange: props.onSkinToneChange,
  });

  return (
    <ErrorBoundary>
      <MutableConfigContext.Provider value={MutableConfigRef}>
        <EmojiPickerReact {...props} />
      </MutableConfigContext.Provider>
    </ErrorBoundary>
  );
}
