import { fetchAllRecentActivities } from '@api/user'
import Avatar from '@components/avatar'
import { Icon } from '@iconify/react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import { getInitials } from '@utils/get-initials'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { images } from 'src/constants/images'

const Accordion = styled(props => <MuiAccordion defaultExpanded disableGutters elevation={0} square {...props} />)(
  () => ({
    boxShadow: 'none !important'
  })
)

const AccordionSummary = styled(props => (
  <MuiAccordionSummary expandIcon={<Icon icon={'tabler:chevron-right'} fontSize={22} elevation={0} />} {...props} />
))(({ theme }) => ({
  paddingInline: 0,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(0)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme?.breakpoints.up('md') && theme.spacing(4)
}))

const ActivityMessage = ({ rca }) => {
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
          <Typography component={'span'} fontWeight={600}>{`${rca?.doneBy?.Name}`}</Typography>
        </Box>
        <Typography component={'span'}>{`${rca?.Description}`}</Typography>
        <Typography variant='body2'>{moment(rca?.DoneAt).format('MMM DD')}</Typography>
      </Box>
    </Box>
  )
}

const RecentActivityCard = ({ rv }) => {
  const router = useRouter()

  return (
    <Box
      border={1}
      width={'max-content'}
      display={'flex'}
      flexDirection={'column'}
      p={3}
      borderRadius={1}
      gap={2}
      borderColor={'divider'}
      sx={{ cursor: 'pointer' }}
      onClick={() => router.push(`/project/${rv?.ID}`)}
    >
      <Image src={images.ImgRecentVisitedCard} alt='' />
      <Box display={'flex'} gap={4} alignItems={'center'}>
        <Icon icon={'lucide:sidebar'} fontSize={22} />
        <Typography variant='subtitle1' fontWeight={700}>
          {rv?.ProjectName}
        </Typography>
      </Box>
      <Box display={'flex'} gap={4} alignItems={'center'}>
        <Image src={images.ImgProjectItemLogo} alt='' width={23} />
        <Typography variant='subtitle1' fontWeight={500}>
          {`${rv?.ProjectName} > ${rv?.workspace?.WorkspaceName}`}
        </Typography>
      </Box>
    </Box>
  )
}

const WorkspaceCard = ({ workspace }) => {
  return (
    <Box
      border={1}
      width={'100%'}
      display={'flex'}
      p={3}
      borderRadius={1}
      gap={3}
      borderColor={'divider'}
      alignItems={'center'}
    >
      <Avatar skin={'light'} color={'warning'} variant='rounded' sx={{ width: 50, height: 50, fontSize: 27 }}>
        {getInitials(workspace?.WorkspaceName)}
      </Avatar>
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        <Typography variant='body1' fontWeight={600} fontSize={18}>
          {workspace?.WorkspaceName}
        </Typography>
      </Box>
    </Box>
  )
}

function RecentActivity() {
  const { data } = useQuery({ queryKey: ['recent-activity-page'], queryFn: fetchAllRecentActivities })

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
              <Accordion>
                <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                  <Typography variant='h6' fontWeight={600} ml={2}>
                    Recently visited
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    display={'flex'}
                    gap={3}
                    sx={{
                      overflowX: 'auto', // Enable horizontal scrolling
                      whiteSpace: 'nowrap', // Prevent child elements from wrapping to a new line
                      paddingBottom: 1, // Optional: Adds padding for scroll visibility
                      '&::-webkit-scrollbar': {
                        height: '8px' // Customize scrollbar height
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888', // Customize scrollbar color
                        borderRadius: '4px'
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555' // Scrollbar on hover
                      }
                    }}
                  >
                    {data?.recentlyVisited?.map(rv => (
                      <Box py={2} key={rv?.ID}>
                        <RecentActivityCard rv={rv} />
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary aria-controls='panel2-content' id='panel2-header'>
                  <Typography variant='h6' fontWeight={600} ml={2}>
                    My Workspaces
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {data?.myWorkspaces?.map(workspace => (
                    <Box py={2} key={workspace?.WorkspaceID}>
                      <WorkspaceCard workspace={workspace} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: theme => theme.shadows[10] }}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography fontWeight={700} variant='body2' fontSize={18}>
                    Recent Activity
                  </Typography>
                </Grid>
                {data?.recentActivities?.map(rca => (
                  <Grid item xs={12} key={rca?.RecentActivityID}>
                    <ActivityMessage rca={rca} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecentActivity
