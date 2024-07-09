// ** MUI Imports
import Workspace from '@pages/workspace'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Workspace />
      {/* <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
      </Grid> */}
    </ApexChartWrapper>
  )
}

export default Dashboard
