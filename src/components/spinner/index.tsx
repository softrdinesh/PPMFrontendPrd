// ** MUI Imports
import Image from 'next/image'

import Box from '@mui/material/Box'

// import CircularProgress from '@mui/material/CircularProgress'

import type { SxProps, Theme } from '@mui/material'

import ppmLogo from '@public/images/logos/logo-pp.png'

const FallbackSpinner = ({ sx, height }: { sx?: SxProps<Theme> | undefined; height?: string }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: height ?? '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        ...sx
      }}
    >
      <Image
        src={ppmLogo}
        alt='Loading....'
        quality={100}
        sizes='100vw'
        className='w-full h-auto max-w-48 animate-bounce duration-1000 ease-in-out'
      />
    </Box>
  )
}

export default FallbackSpinner
