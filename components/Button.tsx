import { cssInterop } from 'nativewind';
import { Button } from './ui/button';

const NButton = cssInterop(Button, {
  className: 'style',
});

export { NButton as Button };
