// ** MUI Imports
import Box from '@mui/material/Box'

// import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'

import classes from './spinner.module.css'

import ppmLogo from '@images/logos/logo-pp-small.png'

const FallbackSpinner = ({ sx, height }) => {
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
      <Image src={ppmLogo} alt='Loading....' width={70} height={70} className={classes.spinnerImage} />
      <div className={classes.ringContainer}>
        <div className={classes.circle} />
        <div className={classes.circle} />
        <div className={classes.circle} />
      </div>
    </Box>
  )
}

export default FallbackSpinner
