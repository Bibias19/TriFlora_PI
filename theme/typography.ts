import { TextStyle } from 'react-native';
import { fonts } from './fonts';

export const typography = {
  displayLg: { fontFamily: fonts.title, fontSize: 36, fontWeight: '600' } as TextStyle,
  headlineMd: { fontFamily: fonts.title, fontSize: 22, fontWeight: '500' } as TextStyle,
  headlineSm: { fontFamily: fonts.title, fontSize: 18, fontWeight: '600' } as TextStyle,
  bodyLg: { fontFamily: fonts.body, fontSize: 16, fontWeight: '400' } as TextStyle,
  bodySm: { fontFamily: fonts.body, fontSize: 12, fontWeight: '400' } as TextStyle,
  price: { fontFamily: fonts.bodyBold, fontSize: 20, fontWeight: '700' } as TextStyle,
  label: { fontFamily: fonts.bodyBold, fontSize: 12, fontWeight: '700' } as TextStyle,
};