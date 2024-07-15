import { Icon } from '@iconify/react'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
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
  padding: theme.spacing(2)
}))

export default function CustomizedAccordions({ data }) {
  console.log('data :', data)
  const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary aria-controls='panel1d-content' id='panel1d-header' sx={{ pl: 2 }}>
        <Typography ml={3} fontWeight={700}>
          {data?.TaskGroupName ?? '-'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TaskGroupComponent />
      </AccordionDetails>
    </Accordion>
  )
}
