import { colors } from './colors';
import { typography } from './typography';
import { fonts } from './fonts';

export const theme = {
  colors,
  typography,
  fonts,
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 36, margin: 20,
  },
  radius: {
    sm: 8, md: 16, lg: 24, xl: 32, full: 999,
  },
  shadows: {
    card: {
      shadowColor: '#568155',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 20,
      elevation: 2,
    },
  },
};