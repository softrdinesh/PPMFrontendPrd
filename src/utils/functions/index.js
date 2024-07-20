import { isNumber } from 'lodash'

const colorNamesToHex = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  yellow: '#FFFF00',
  green: '#008000'
}

function getHexColor(color) {
  if (color.startsWith('#')) {
    return color
  }

  return colorNamesToHex[color.toLowerCase()] || '#000000' // Default to black if color not found
}

// Utility function to calculate luminance
function getLuminance(hex) {
  hex = hex.replace('#', '')
  let r = parseInt(hex.substring(0, 2), 16) / 255
  let g = parseInt(hex.substring(2, 4), 16) / 255
  let b = parseInt(hex.substring(4, 6), 16) / 255

  let a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

// Function to get contrasting text color
export function getContrastingTextColor(color) {
  const hexColor = getHexColor(color)
  const luminance = getLuminance(hexColor)

  return isNumber(luminance) && luminance > 0.5 ? '#222222' : '#FFFFFF'
}
