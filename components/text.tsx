import { cssInterop } from 'nativewind';
import { Text } from './ui/text';

const NText = cssInterop(Text, {
  className: 'style',
});

export { NText as Text };
