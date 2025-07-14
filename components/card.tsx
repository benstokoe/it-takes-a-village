import { Card } from '@/components/ui/card';
import { cssInterop } from 'nativewind';

const NCard = cssInterop(Card, {
  className: 'style',
});

export { NCard as Card };
