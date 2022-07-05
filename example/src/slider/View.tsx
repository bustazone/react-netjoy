import { Animated, View } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler'
import { SliderPropsType } from './View.Types'
import styles from './View.Styles'

const CustomSlider: FC<SliderPropsType> = ({ initialValue = 0, ...props }: SliderPropsType) => {
  let panRef = React.useRef(null)
  const translateX = useMemo(() => {
    return new Animated.Value(0)
  }, [])
  let lastOffsetX: number = 0
  const [currentValue, setCurrentValue] = useState(0)
  const [actualComponentWidth, setActualComponentWidth] = useState(0)
  const [actualPointerWidth, setActualPointerWidth] = useState(0)
  const [actualPointerHeight, setActualPointerHeight] = useState(0)
  const [actualTrackCompletedHeight, setActualTrackCompletedHeight] = useState(0)
  const [actualTrackPendingHeight, setActualTrackPendingHeight] = useState(0)

  useEffect(() => {
    if (actualComponentWidth === 0 || actualPointerWidth === 0) return
    if (props.steps) {
      const stepWidth = (actualComponentWidth - actualPointerWidth) / (props.steps - 1)
      const newPosition = Math.round(initialValue * stepWidth - lastOffsetX)
      translateX.setOffset(newPosition)
      translateX.setValue(0)
    } else {
      translateX.setOffset(initialValue * ((actualComponentWidth - actualPointerWidth) / 100))
      translateX.setValue(0)
    }
    const newValue = getValueFromCurrentPosition()
    setCurrentValue(newValue)
  }, [initialValue, actualComponentWidth, actualPointerWidth])

  const translateXInter = useMemo(
    () =>
      translateX.interpolate({
        inputRange: [0, Math.max(actualComponentWidth, actualPointerWidth) - actualPointerWidth],
        outputRange: [0, Math.max(actualComponentWidth, actualPointerWidth) - actualPointerWidth],
        extrapolate: 'clamp'
      }),
    [actualComponentWidth, actualPointerWidth]
  )

  const getValueFromCurrentPosition = useCallback(() => {
    let outValue = initialValue
    const currentOffset = parseInt(JSON.stringify(translateXInter), 10)
    if (actualComponentWidth === 0 || actualPointerWidth === 0) return initialValue
    if (props.steps) {
      const stepWidth = (actualComponentWidth - actualPointerWidth) / (props.steps - 1)
      outValue = Math.round(currentOffset / stepWidth)
    } else {
      outValue = (currentOffset / (actualComponentWidth - actualPointerWidth)) * 100
    }
    return outValue
  }, [props.steps, actualComponentWidth, actualPointerWidth, initialValue, translateXInter])

  return (
    <View
      style={[styles.container, props.style]}
      pointerEvents={'box-none'}
      onLayout={event => {
        setActualComponentWidth(event.nativeEvent.layout.width)
      }}
    >
      <PanGestureHandler
        ref={panRef}
        minDist={0}
        onGestureEvent={event => {
          if (props.snapStepOnMove && props.steps) {
            const stepWidth = (actualComponentWidth - actualPointerWidth) / (props.steps - 1)
            const currentDisplacement = lastOffsetX + event.nativeEvent.translationX
            const stepProportion = currentDisplacement / stepWidth
            const newPosition = Math.round(Math.round(stepProportion) * stepWidth - lastOffsetX)
            translateX.setValue(newPosition)
          } else {
            translateX.setValue(event.nativeEvent.translationX)
          }
          const newValue = getValueFromCurrentPosition()
          if (props.onProgress) props.onProgress(newValue)
          setCurrentValue(newValue)
        }}
        onHandlerStateChange={event => {
          if (event.nativeEvent.state === State.BEGAN) {
            if (props.onDragStarts) props.onDragStarts()
          } else if (event.nativeEvent.state === State.END) {
            const currentOffset = parseInt(JSON.stringify(translateXInter), 10)
            if (props.steps) {
              const stepWidth = (actualComponentWidth - actualPointerWidth) / (props.steps - 1)
              const currentStep = Math.round(currentOffset / stepWidth)
              lastOffsetX = currentStep * stepWidth
              translateX.setOffset(lastOffsetX)
              translateX.setValue(0)
            } else {
              lastOffsetX = parseInt(JSON.stringify(translateXInter), 10)
              translateX.setOffset(lastOffsetX)
              translateX.setValue(0)
            }
            const newValue = getValueFromCurrentPosition()
            if (props.onProgress) props.onProgress(newValue)
            setCurrentValue(newValue)
            props.onValueChange(newValue)
            if (props.onDragEnds) props.onDragEnds()
          }
        }}
      >
        <TapGestureHandler
          simultaneousHandlers={panRef}
          minPointers={1}
          numberOfTaps={1}
          onHandlerStateChange={event => {
            if (event.nativeEvent.state === State.BEGAN) {
              if (props.onTapStart) props.onTapStart()
              const currentOffset = Math.round(event.nativeEvent.x - actualPointerWidth / 2)
              if (props.steps) {
                const stepWidth = (actualComponentWidth - actualPointerWidth) / (props.steps - 1)
                const currentStep = Math.round(currentOffset / stepWidth)
                lastOffsetX = currentStep * stepWidth
                translateX.setOffset(lastOffsetX)
                translateX.setValue(0)
              } else {
                lastOffsetX = currentOffset
                translateX.setOffset(lastOffsetX)
                translateX.setValue(0)
              }
              const newValue = getValueFromCurrentPosition()
              if (props.onProgress) props.onProgress(newValue)
              setCurrentValue(newValue)
              props.onValueChange(newValue)
            } else if (event.nativeEvent.state === State.END) {
              if (props.onTapEnds) props.onTapEnds()
            }
          }}
        >
          <View
            style={[
              {
                height: Math.max(actualPointerHeight, actualTrackCompletedHeight, actualTrackPendingHeight)
              },
              styles.innerContainer
            ]}
          >
            <View style={[styles.trackContainer]}>
              <Animated.View
                style={[
                  styles.trackCompletedContainer,
                  {
                    right: Animated.subtract(actualComponentWidth - actualPointerWidth / 2, translateXInter)
                  }
                ]}
                onLayout={event => {
                  setActualTrackCompletedHeight(Math.round(event.nativeEvent.layout.height))
                }}
              >
                <View style={{ width: actualComponentWidth }}>{props.renderTrackCompleted()}</View>
              </Animated.View>
              <Animated.View
                style={[
                  styles.trackPendingContainer,
                  {
                    left: Animated.add(translateXInter, actualPointerWidth / 2)
                  }
                ]}
                onLayout={event => {
                  setActualTrackPendingHeight(Math.round(event.nativeEvent.layout.height))
                }}
              >
                <View style={{ width: actualComponentWidth }}>{props.renderTrackPending()}</View>
              </Animated.View>
            </View>
            <Animated.View
              style={[
                styles.pointerContainer,
                {
                  transform: [
                    {
                      translateX: translateXInter
                    }
                  ]
                }
              ]}
              pointerEvents={'box-none'}
              onLayout={event => {
                setActualPointerWidth(Math.round(event.nativeEvent.layout.width))
                setActualPointerHeight(Math.round(event.nativeEvent.layout.height))
              }}
            >
              {props.renderPointer(currentValue)}
            </Animated.View>
          </View>
        </TapGestureHandler>
      </PanGestureHandler>
    </View>
  )
}

export default CustomSlider
