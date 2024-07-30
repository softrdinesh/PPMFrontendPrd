import { Icon } from '@iconify/react'
import { Box, Dialog, Grid, Menu, MenuItem, TextField, Typography, useTheme, Zoom } from '@mui/material'
import React, { useState } from 'react'

const getIcon = key => {
  switch (key) {
    case 'USR':
      return 'tdesign:user'
    case 'TXT':
      return 'streamline:pencil'

    case 'DDL':
      return 'hugeicons:book-02'

    case 'DPK':
      return 'solar:calendar-date-linear'

    case 'LBL':
      return 'material-symbols:table-chart-view-outline'

    case 'NUM':
      return 'mingcute:dots-fill'

    default:
      return 'mingcute:dots-fill'
  }
}

const AddColumnsMenu = ({ open, close, columns }) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleTypeClicked = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleTypeClose = () => setAnchorEl(null)

  return (
    <>
      <Menu
        open={Boolean(open)}
        onClose={close}
        anchorEl={open}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box p={4} maxWidth={'300px'}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                size='small'
                fullWidth
                placeholder='Search'
                InputProps={{
                  startAdornment: (
                    <Icon
                      icon={'ion:search'}
                      fontSize={24}
                      color={theme?.palette?.grey[400]}
                      style={{ marginRight: 10 }}
                    />
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px' // Make the border radius high to achieve pill shape
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography fontWeight={'bold'} fontSize={13} textTransform={'uppercase'}>
                    Essentials
                  </Typography>
                </Grid>
                {columns?.map(item => (
                  <Grid item xs={12} md={6} key={item?.ColumnTypeID}>
                    <Box
                      component={MenuItem}
                      display={'flex'}
                      alignItems={'center'}
                      gap={3}
                      p={0}
                      px={0}
                      py={1}
                      onClick={handleTypeClicked}
                    >
                      <Icon icon={getIcon(item?.Key)} fontSize={20} color={theme?.palette?.primary?.main} />
                      <Typography fontSize={14} textTransform={'capitalize'}>
                        {item?.Title}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Menu>
      <Dialog open={Boolean(anchorEl)} onClose={handleTypeClose} TransitionComponent={Zoom}>
        <Box p={4} maxWidth={'300px'}>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}

export default AddColumnsMenu
