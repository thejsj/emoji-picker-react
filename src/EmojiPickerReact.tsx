import * as React from 'react';

import { PickerStyleTag } from './Stylesheet/stylesheet';
import { Reactions } from './components/Reactions/Reactions';
import { Body } from './components/body/Body';
import { ElementRefContextProvider } from './components/context/ElementRefContext';
import { PickerConfigProvider } from './components/context/PickerConfigContext';
import { useReactionsModeState } from './components/context/PickerContext';
import { Preview } from './components/footer/Preview';
import { Header } from './components/header/Header';
import PickerMain from './components/main/PickerMain';
import { compareConfig } from './config/compareConfig';
import { useAllowExpandReactions, useOpenConfig } from './config/useConfig';

import { PickerProps } from './index';

interface EmojiPickerReactProps extends PickerProps {
  filterString?: string;
}

function EmojiPicker(props: EmojiPickerReactProps) {
  const { filterString, ...configProps } = props;

  return (
    <ElementRefContextProvider>
      <PickerStyleTag />
      <PickerConfigProvider {...configProps}>
        <ContentControl filterString={filterString} />
      </PickerConfigProvider>
    </ElementRefContextProvider>
  );
}

function ContentControl({ filterString }: { filterString?: string }) {
  const [reactionsDefaultOpen] = useReactionsModeState();
  const allowExpandReactions = useAllowExpandReactions();

  const [renderAll, setRenderAll] = React.useState(!reactionsDefaultOpen);
  const isOpen = useOpenConfig();

  React.useEffect(() => {
    if (reactionsDefaultOpen && !allowExpandReactions) {
      return;
    }

    if (!renderAll) {
      setRenderAll(true);
    }
  }, [renderAll, allowExpandReactions, reactionsDefaultOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <PickerMain>
      <Reactions />
      <ExpandedPickerContent renderAll={renderAll} filterString={filterString} />
    </PickerMain>
  );
}

function ExpandedPickerContent({ renderAll, filterString }: { renderAll: boolean; filterString?: string }) {
  if (!renderAll) {
    return null;
  }

  return (
    <>
      <Header filterString={filterString} />
      <Body />
      <Preview />
    </>
  );
}

// Custom comparison that includes filterString
function compareEmojiPickerProps(prevProps: EmojiPickerReactProps, nextProps: EmojiPickerReactProps): boolean {
  // If filterString changed, always re-render
  if (prevProps.filterString !== nextProps.filterString) {
    return false;
  }

  // Otherwise use the standard config comparison
  return compareConfig(prevProps, nextProps);
}

// eslint-disable-next-line complexity
export default React.memo(EmojiPicker, compareEmojiPickerProps);
