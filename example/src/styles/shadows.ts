import { ViewStyle } from 'react-native'

type mainShadowsType = {
  big: ViewStyle
  small: ViewStyle
}

export const mainShadows: mainShadowsType = {
  big: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
}
