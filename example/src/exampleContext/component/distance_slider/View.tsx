import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { DistanceSliderViewProps } from './View.Types'
import CustomSlider from '../../../slider/View'

const DistanceSliderView: FC<DistanceSliderViewProps> = props => {
  return (
    <CustomSlider
      style={props.style}
      steps={10}
      initialValue={props.initialValue}
      renderPointer={currentValue => {
        return (
          <View style={{ width: 24, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#F00',
                justifyContent: 'center',
                alignItems: 'center',
                height: 22,
                width: 62,
                marginBottom: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 16,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {Math.floor(currentValue) + 1} Km
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#F00',
                height: 24,
                width: 24,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ backgroundColor: 'white', height: 14, width: 14, borderRadius: 30 }} />
            </View>
          </View>
        )
      }}
      renderTrackCompleted={() => {
        return (
          <View
            style={{
              backgroundColor: '#F00',
              height: 8,
              marginTop: 38,
              borderRadius: 8,
            }}
          />
        )
      }}
      renderTrackPending={() => {
        return (
          <View
            style={{
              backgroundColor: 'white',
              height: 8,
              marginTop: 38,
              borderRadius: 8,
            }}
          />
        )
      }}
      onValueChange={value => {
        console.log('onValueChange')
        props.onValueChange(value)
      }}
    />
  )
}

export default DistanceSliderView
