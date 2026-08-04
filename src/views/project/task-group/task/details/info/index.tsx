import { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import { Box, Grid2 as Grid, IconButton, Typography, useMediaQuery } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import HtmlEditor from '@/components/input/html-editor'
import { useProject } from '@/context/project-context'
import { updateTasks } from '@/services/modules/task'
import type { TaskListItemType } from '@/services/modules/task/types'
import { getInitials } from '@/utils/getInitials'
import CustomButton from '@components/button'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams } from 'next/navigation'

const MobileProjectDetail = () => {
  const { project: projectData } = useProject()


  return (
    <div className='w-full relative rounded-xl bg-primaryLighter h-full flex flex-col sm:flex-row items-center justify-between p-5 gap-4'>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={4}>
        <Box position={'relative'} display={'flex'}>
          <CustomAvatar skin='light' sx={{ height: 80, width: 80 }} src={'/images/avatars/3.png'}>
            {getInitials(projectData?.CreatedBy?.Name || '')}
          </CustomAvatar>
          <Box
            display={'flex'}
            alignItems={'center'}
            gap={1}
            position={'absolute'}
            bgcolor={'white'}
            borderRadius={100}
            top={-1}
            right={-1}
            boxShadow={theme => theme.shadows[4]}
          >
            <IconButton size='small'>
              <Icon icon={'mdi:favourite-outline'} />
            </IconButton>
          </Box>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={{ xs: 'start', lg: 'center' }}
          justifyContent={'center'}
        >
          <Typography variant='body1' fontWeight={600}>
            {projectData?.CreatedBy?.Name}
          </Typography>
          <Typography variant='body2'>Product Owner</Typography>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={4}>
        {/* <CustomButton variant='contained' size='small'>
          Sprint 1.1
        </CustomButton> */}
        <Box mt={{ lg: 5 }}>
          <CustomButton variant='outlined' circular size='small'>
            View All
          </CustomButton>
        </Box>
      </Box>
    </div>
  )
}

const DesktopProjectDetail = () => {
  const { project: projectData } = useProject()
  const auth = useAuth()
  const { profile,user } = useAuth()
  return (
    <div className='w-full rounded-xl bg-primaryLighter h-full flex flex-col items-center justify-center p-5 gap-1'>
      <CustomAvatar skin='light' sx={{ height: 100, width: 100 }} src={auth?.user?.userData?.ProfilePicture || '/images/avatars/1.png'}>
        {getInitials(projectData?.CreatedBy?.Name || '')}
      </CustomAvatar>

      <Typography variant='body1' fontWeight={600}>
        {projectData?.CreatedBy?.Name}
      </Typography>
      <Typography variant='body2'>Product Owner</Typography>

      <Box display={'flex'} alignItems={'center '} gap={1} my={4}>
        <IconButton size='small'>
          <Icon icon={'mdi:favourite-outline'} />
        </IconButton>
        <Typography variant='subtitle2'>Add to favourites</Typography>
      </Box>
      {/* <CustomButton variant='contained'>Sprint 1.1</CustomButton> */}
      <Box mt={{ lg: 5 }}>
        <CustomButton variant='outlined' circular size='small'>
          View All
        </CustomButton>
      </Box>
    </div>
  )
}

interface ProjectDetailsTabProps {
  taskData: TaskListItemType
  refetchTasks: () => void
}

// Finds an image URL anywhere inside a string (handles cases where the
// description has extra text/markup around the URL, not just a pure URL)
// and replaces it with an <img> tag so it renders instead of showing as text.
const renderImageUrlsInText = (text: string) => {
  if (!text) return text
  const imageUrlRegex = /(https?:\/\/[^\s"'<>]+\.(?:jpe?g|png|gif|webp|bmp|svg)(?:\?[^\s"'<>]*)?)/gi
  return text.replace(imageUrlRegex, url => `<img src="${url}" style="max-width:100%" />`)
}

const ProjectDetailsTab = ({ taskData, refetchTasks }: ProjectDetailsTabProps) => {
  const { project: projectData } = useProject()
  const lgBreakpoint = useMediaQuery(theme => theme.breakpoints.up('lg'))
const { profile,user } = useAuth()
  const [value, setValue] = useState('')
   
//   const handleChange = async (v: string) => {
//     try {
// // const hasImageTag = /<img\b[^>]*>/i.test(value)
// const hasImageTag = /<img\b[^>]*>/i.test(v)
//     if (hasImageTag) {
//       // Extract the base64 src from the <img> tag
//       const srcMatch = v.match(/<img[^>]+src=["']([^"']+)["']/i)

//       // const srcMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i)
//       const base64Src = srcMatch?.[1]

//       if (base64Src) {
//         // Convert the base64 data URL into a real File/Blob (this is the fix)
//         const res = await fetch(base64Src)
//         const blob = await res.blob()
//         const mimeMatch = base64Src.match(/^data:(.*?);base64,/)
//         const mimeType = mimeMatch?.[1] || 'image/png'
//         const extension = mimeType.split('/')[1] || 'png'
//         const fileName = `pasted-image-${Date.now()}.${extension}`
//         const file = new File([blob], fileName, { type: mimeType })

//  handleFileUpload(file,v)
  
//       }
//     } else {

// const body = { TaskDescription: v, Title: 'Task Description Changed' }
//       const response = await updateTasks({ id: taskData?.TaskID?.toString(), body })
// toast.success('Project Details Updated Successfully!')
//       // if (response) {
//         refetchTasks()
//       // }
//     setValue(v)
//     }

      

  
//     } catch (error) {
//       console.error('error :', error)
//     }
//   }


 

  const handleChange = async (v: string) => {
    try {
      setValue(v)
    } catch (error) {
    //  console.error('error :', error)
    }
  }
const roleData = localStorage.getItem('Role');
const parsedData = JSON.parse((roleData)as any);
const rolename = parsedData?.rolename;

const handleSendUpdate = async () => {
  try {
const hasImageTag = /<img\b[^>]*>/i.test(value)
    if (hasImageTag) {
      // Extract the base64 src from the <img> tag
      const srcMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i)

      // const srcMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i)
      const base64Src = srcMatch?.[1]


      if (base64Src) {
        // Convert the base64 data URL into a real File/Blob (this is the fix)
        const res = await fetch(base64Src)
        const blob = await res.blob()
        const mimeMatch = base64Src.match(/^data:(.*?);base64,/)
        const mimeType = mimeMatch?.[1] || 'image/png'
        const extension = mimeType.split('/')[1] || 'png'
        const fileName = `pasted-image-${Date.now()}.${extension}`
        const file = new File([blob], fileName, { type: mimeType })
   
    handleFileUpload(file,value)
      }
    } else {
   

const body = { TaskDescription: value, Title: 'Task Description Changed' }
      const response = await updateTasks({ id: taskData?.TaskID?.toString(), body })
toast.success('Project Details Updated Successfully!')
      // if (response) {
        refetchTasks()
      // }
    setValue(value)
      }
  } catch (error) {
   // console.error('Error sending update:', error)
    toast.error('Failed to send update. Please try again.')
  }
}






  const handleFileUpload = async (value:any,v:any) => {
 



  try {
    const formData = new FormData();
    formData.append('file', value);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL1}/UploadProjecttaskDescription/${taskData?.TaskID?.toString()}/${user?.id}/-/${taskData.WorkspaceID.toString()}`,
      formData,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

     refetchTasks()

    // setSelectedFile(null);
    toast.success("Image Uploaded Successfully!")
  } catch (error) {
    if (axios.isAxiosError(error)) {
    //  console.error('Upload failed:', error.response?.data || error.message);
      //setUploadError(error.response?.data?.message || 'File upload failed');
    } else {
     // console.error('Unexpected error:', error);
     // setUploadError('Something went wrong');
    }
  } finally {
   // setIsUploading(false);
  }
};
  useEffect(() => {
    setValue(renderImageUrlsInText(taskData?.TaskDescription))
  }, [taskData?.TaskDescription])
  return (
    <Box height={'100%'}>
      <Grid container spacing={4} alignItems={'stretch'} height={'100%'}>
        <Grid size={{ xs: 12, lg: 8 }} order={{ xs: 2, lg: 1 }}>
          <Grid container spacing={7}>
            <Grid size={12}>
              <Typography variant='body2'>{'Task :'}</Typography>
              <Typography fontWeight={600} variant='h6'>
                {taskData?.Taskname}
              </Typography>
            </Grid>
            <Grid size={12} key={taskData?.TaskID}>
              {projectData?.userProjects?.Role?.RoleName == 'Admin' ? (
                <HtmlEditor
                  placeholder={'Please enter a project description....'}
                  // onChange={handleChange}
                          onChange={(v: string) => handleChange(v)}

                  setContent={value}
                  defaultValue={value}
                />
              ) : (
                <p dangerouslySetInnerHTML={{ __html: value }} />
              )}
              {rolename !=='Viewer' &&
              <Box textAlign={'end'} mt={4}>
                {/* <CustomButton variant='contained' > */}
                <CustomButton variant='contained' onClick={handleSendUpdate}>
                  Update
                </CustomButton>
              </Box>
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} order={{ xs: 1, lg: 2 }}>
          {lgBreakpoint ? <DesktopProjectDetail /> : <MobileProjectDetail />}
        </Grid>
      
      </Grid>
    </Box>
  )
}

export default ProjectDetailsTab
