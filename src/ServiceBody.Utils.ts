export const extractPropertiesFromJsonObject = (jsonObject: { [key: string]: any }) => {
  const formBody = Object.keys(jsonObject).reduce<Record<string, any>>(
    (previousValue, currentValue) => {
      const value: any = jsonObject[currentValue]
      if (value === undefined || value === null) {
        return previousValue
      }
      if (value instanceof Array) {
        const arrayItem = value.reduce((accArray, valueArray) => {
          if (valueArray instanceof Object) {
            accArray.push(
              `${encodeURIComponent(currentValue)}=${encodeURIComponent(
                JSON.stringify(valueArray),
              )}`,
            )
          } else {
            accArray.push(`${encodeURIComponent(currentValue)}=${encodeURIComponent(valueArray)}`)
          }
          return accArray
        }, [])
        return previousValue.push(arrayItem)
      }
      if (value instanceof Object) {
        previousValue.push(
          `${encodeURIComponent(currentValue)}=${encodeURIComponent(JSON.stringify(value))}`,
        )
      } else {
        previousValue.push(`${encodeURIComponent(currentValue)}=${encodeURIComponent(value)}`)
      }
      return previousValue
    },
    [],
  )
  return formBody.join('&')
}
