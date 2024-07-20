import FallbackSpinner from '@components/spinner'
import { Box, Card, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import CustomizedAccordions from '../task-accordian'

import CustomButton from '@components/button'
import noDataImage from '@images/cards/no-data.svg'
import Image from 'next/image'
import NewTaskDialog from './new-task/dialog'

const TaskGroupList = ({ id, taskGroups, isLoading, refetch }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  if (isLoading) return <FallbackSpinner height={'60vh'} />

  return (
    <Card sx={{ borderRadius: '15px' }}>
      {taskGroups?.length ? (
        <Box px={3} py={4}>
          {taskGroups?.map((item, index) => (
            <CustomizedAccordions key={item?.TaskGroupID} index={index} data={item} refetchGroups={refetch} />
          ))}
        </Box>
      ) : (
        <Box
          px={3}
          py={10}
          display={'flex'}
          gap={10}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'column'}
        >
          <Image src={noDataImage} alt='NoDataFound' width={300} />
          <Typography fontWeight={600}>No Task Groups Added</Typography>
          <CustomButton variant='contained' circular onClick={handleOpen}>
            Add Now
          </CustomButton>
          <NewTaskDialog open={open} onCloseModal={handleClose} projectID={id} refetch={refetch} />
        </Box>
      )}
    </Card>
  )
}

export default memo(TaskGroupList)
