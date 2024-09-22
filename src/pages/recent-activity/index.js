import { Icon } from '@iconify/react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { useState } from 'react'

const Accordion = styled(props => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
  boxShadow: 'none !important'
}))

const AccordionSummary = styled(props => (
  <MuiAccordionSummary expandIcon={<Icon icon={'tabler:chevron-right'} fontSize={22} elevation={0} />} {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(0)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme?.breakpoints.up('md') && theme.spacing(2)
}))

const ActivityMessage = () => {
  return (
    <Box display={'flex'} gap={4} alignItems={'start'}>
      {/* Icon */}
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        width={30}
        height={30}
        borderRadius={9999}
        bgcolor={'#5DC983'}
      >
        <Icon icon={'mdi:message'} color='white' fontSize={16} />
      </Box>
      {/* Message */}
      <Box display={'flex'} flexDirection={'column'}>
        <Box>
          <Typography component={'span'} fontWeight={600}>{`Karen`}</Typography>
          <Typography component={'span'}>{` `}</Typography>
          <Typography component={'span'}>{`leave some comments on Konsep Ilustrasi`}</Typography>
        </Box>
        <Typography variant='body2'>{moment().format('MMM DD')}</Typography>
      </Box>
    </Box>
  )
}

function RecentActivity() {
  const [expanded, setExpanded] = useState(true)

  const handleExpansion = () => {
    setExpanded(prevExpanded => !prevExpanded)
  }

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h4' fontWeight={700}>
            Recent activity
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ minHeight: '70vh' }}>
            <CardContent>
              <Accordion expanded={expanded} onChange={handleExpansion}>
                <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                  <Typography variant='h6' fontWeight={600} ml={2}>
                    Recently visited
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                    blandit leo lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary aria-controls='panel2-content' id='panel2-header'>
                  <Typography variant='h6' fontWeight={600} ml={2}>
                    My Workspaces
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                    blandit leo lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography fontWeight={700} variant='body2' fontSize={18}>
                    Recent Activity
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <ActivityMessage />
                </Grid>
                <Grid item xs={12}>
                  <ActivityMessage />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecentActivity
