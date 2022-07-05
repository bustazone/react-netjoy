import { ColorValue, Platform, StatusBar } from 'react-native'

export const setColorTransparentStatusBar = (color: ColorValue): void => {
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(false)
    StatusBar.setBackgroundColor(color)
    StatusBar.setBarStyle('dark-content')
  } else if (Platform.OS === 'ios') {
  }
}

export const setLightTransparentStatusBar = (): void => {
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true)
    StatusBar.setBackgroundColor('transparent')
    StatusBar.setBarStyle('light-content')
  } else if (Platform.OS === 'ios') {
  }
}

export const setDarkTransparentStatusBar = (): void => {
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true)
    StatusBar.setBackgroundColor('transparent')
    StatusBar.setBarStyle('dark-content')
  } else if (Platform.OS === 'ios') {
  }
}
