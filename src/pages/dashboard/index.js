// ** MUI Imports
import Grid from '@mui/material/Grid'
import Trophy from 'src/@core/components/dashboard/Trophy'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
