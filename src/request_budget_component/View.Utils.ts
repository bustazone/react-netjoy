export function randomID() {
  const number = Math.floor(Math.random() * Math.pow(10, 7))
  let zeros = ''
  console.log(number.toString().length)
  for (let i = 0; i < 7 - number.toString().length; i++) {
    zeros = `${zeros}0`
  }
  return `${zeros}${number}`
}
