// ** Icon Imports
import { Icon } from '@iconify/react'

const IconifyIcon = ({ icon, fontSize, ...rest }) => {
  return <Icon icon={icon} fontSize={fontSize ?? '1.5rem'} {...rest} />
}

export default IconifyIcon
