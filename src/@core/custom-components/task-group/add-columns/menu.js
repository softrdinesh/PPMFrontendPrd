import { Icon } from '@iconify/react'
import { Box, Grid, Menu, MenuItem, TextField, Typography, useTheme, Zoom } from '@mui/material'
import React from 'react'

const additionColumnsData = [
  { id: 1, title: 'Date', icon: 'solar:calendar-date-linear' },
  { id: 2, title: 'Status', icon: 'material-symbols:table-chart-view-outline' },
  { id: 3, title: 'Dropdown', icon: 'hugeicons:book-02' },
  { id: 4, title: 'Number', icon: 'mingcute:dots-fill' },
  { id: 5, title: 'Text', icon: 'streamline:pencil' },
  { id: 6, title: 'People', icon: 'tdesign:user' }
]

const AddColumnsMenu = ({ open, close }) => {
  const theme = useTheme()

  return (
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
              {additionColumnsData?.map(item => (
                <Grid item xs={12} md={6} key={item?.id}>
                  <Box
                    component={MenuItem}
                    display={'flex'}
                    alignItems={'center'}
                    gap={3}
                    p={0}
                    px={0}
                    py={1}
                    onClick={close}
                  >
                    <Icon icon={item?.icon} fontSize={20} color={theme?.palette?.primary?.main} />
                    <Typography fontSize={14}>{item?.title}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Menu>
  )
}

export default AddColumnsMenu
