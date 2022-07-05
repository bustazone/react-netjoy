import { TextStyle } from 'react-native'
type mainFontsType = {
  thin: TextStyle
  regular: TextStyle
  medium: TextStyle
  bold: TextStyle
}
export const mainFonts: mainFontsType = {
  thin: {
    fontFamily: 'Rubik-Light'
  },
  regular: {
    fontFamily: 'Rubik-Regular'
  },
  medium: {
    fontFamily: 'Rubik-Medium'
  },
  bold: {
    fontFamily: 'Rubik-Bold'
  }
}
