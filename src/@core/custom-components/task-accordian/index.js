import { fetchTaskList } from '@api/task'
import { Icon } from '@iconify/react'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useQuery } from 'react-query'
import TaskGroupComponent from '../task-group'

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

export default function CustomizedAccordions({ data }) {
  const [expanded, setExpanded] = useState(null)

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const {
    data: taskList,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['task-list', data?.TaskGroupID],
    queryFn: () => fetchTaskList(data?.TaskGroupID),
    retry: false,
    enabled: !!data?.TaskGroupID
  })

  return (
    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary aria-controls='panel1d-content' id='panel1d-header' sx={{ pl: 2 }}>
        <Typography ml={3} fontWeight={700}>
          {data?.TaskGroupName ?? '-'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TaskGroupComponent isLoading={isLoading} taskList={taskList} taskGroupData={data} refetch={refetch} />
      </AccordionDetails>
    </Accordion>
  )
}
