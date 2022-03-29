import * as React from 'react';
import { SvgCss } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

const xml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="20" cy="20" r="20" fill="#FF9800"/>
<path d="M20 12.0001L20 28.0001" stroke="white" stroke-width="2" stroke-linecap="round"/>
<path d="M12 19.9999L28 19.9999" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

const AddIcon: React.FC<Props> = ({ size, color }) => {
  return <SvgCss xml={xml} width={size} height={size} fill={color ? color : 'white'} />;
};
export { AddIcon };
