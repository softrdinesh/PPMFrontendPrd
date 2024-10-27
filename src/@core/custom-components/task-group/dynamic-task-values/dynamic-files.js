import { updateSubTask } from '@api/sub-task'
import { taskFileUpload, updateTask } from '@api/task'
import CustomButton from '@components/button'
import { Icon } from '@iconify/react'
import {
  Box,
  Dialog,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom
} from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import { Controller, Form, useForm } from 'react-hook-form'
import { images } from 'src/constants/images'
import { menuItems } from './dynamic-files-menu'

const defaultValues = {
  value: '',
  file: null,
  displayText: ''
}

const DynamicFiles = ({ columnData = null, rowData = null, dynamicValue = null, refetch, isSubTask = false }) => {
  console.log('dynamicValue :', dynamicValue)
  console.log('rowData :', rowData)
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(menuItems[0])
  const [open, setOpen] = useState(false)

  // ** Hooks
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting }
  } = useForm({ defaultValues })

  //** Function
  const handleOpen = event => setAnchorEl(event?.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleFileTypeClick = data => {
    setSelectedType(data)
    setAnchorEl(null)
    reset(defaultValues)
    setOpen(true)
  }

  const handleDialogClose = () => {
    setOpen(false)
  }

  const onSubmit = async data => {
    if (!data?.file) {
      try {
        const body = {
          DynamicID: dynamicValue?.DynamicID ?? null,
          AdditionalColumnID: columnData?.AdditionalColumnID,
          value: data?.value,
          displayText: data?.displayText,
          Title: `File was added to column '${columnData?.ColumnName}'`,
          PreviousState: dynamicValue?.DisplayText,
          NewState: data?.displayText
        }
        if (isSubTask) {
          body.TaskID = rowData?.TaskMasterID
          const response = await updateSubTask({ id: rowData?.SubTaskID, body })
          if (response) {
            refetch()
            setOpen(false)
            handleClose()
          }
        } else {
          const response = await updateTask({ id: rowData?.TaskID, body })
          if (response) {
            refetch()
            setOpen(false)
            handleClose()
          }
        }
      } catch (error) {
        console.error('error :', error)
      }
    } else {
      try {
        const formData = new FormData()

        const body = {
          DynamicID: dynamicValue?.DynamicID ?? null,
          AdditionalColumnID: columnData?.AdditionalColumnID,
          value: data?.value,
          displayText: data?.displayText,
          Title: `File was added to column '${columnData?.ColumnName}'`,
          PreviousState: dynamicValue?.DisplayText,
          NewState: data?.displayText
        }

        for (let x in body) {
          formData.append(x, body[x])
        }
        formData.append('file', data?.file)

        await taskFileUpload({ id: rowData?.TaskID, body: formData })
      } catch (error) {
        console.error('error ff :', error)
      }
    }
  }

  return (
    <>
      <Box display={'flex'} height={'100%'} alignItems={'center'}>
        {!dynamicValue ? (
          <IconButton onClick={handleOpen}>
            <Icon icon={'bi:plus-circle-dotted'} />
          </IconButton>
        ) : (
          <Box
            borderRadius={100}
            border={1}
            borderColor={'primary.main'}
            display={'flex'}
            alignItems={'center'}
            gap={2}
            py={0.5}
            px={3}
          >
            <Tooltip title={dynamicValue?.DisplayText}>
              <Typography variant='body2' color={'primary.main'} fontSize={13}>
                {dynamicValue?.DisplayText?.slice(0, 8)}
              </Typography>
            </Tooltip>
            <Box>
              <IconButton
                size='small'
                onClick={() => {
                  window?.open(dynamicValue?.DynamicColumnValues)
                }}
              >
                <Icon icon={'ion:open-outline'} color={theme?.palette?.primary?.main} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose} TransitionComponent={Zoom}>
        {menuItems?.map(item => (
          <MenuItem
            key={item.title}
            sx={{ borderBottom: item?.hasBottomBorder && 1, borderColor: 'divider' }}
            onClick={() => handleFileTypeClick(item)}
          >
            <Box display={'flex'} gap={2} alignItems={'center'}>
              <Icon icon={item?.icon} fontSize={20} color={theme?.palette.primary.main} />
              <Typography variant='body1' fontSize={15}>
                {item?.title}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={open} fullWidth maxWidth='md'>
        <Box minHeight={600} display={'flex'}>
          <Grid container spacing={6} height={'100%'} alignItems={'stretch'}>
            {/* Upload Files */}
            <Grid item xs={12} md={8}>
              <Form control={control} onSubmit={handleSubmit(onSubmit)}>
                <Box
                  minHeight={600}
                  width={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  p={{ xs: 4, md: 10 }}
                  gap={10}
                >
                  {/* Title  */}
                  <Box>
                    <Typography variant='h5' color={'primary.main'} fontWeight={700} mb={3}>
                      Upload file from {selectedType?.title}
                    </Typography>
                    <Typography whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                      Kindly upload any file that you want (it will be supported all format)
                    </Typography>
                  </Box>

                  {/* Form */}
                  <Box flex={1}>
                    {/* File */}
                    {selectedType?.type === 'computer' ? (
                      <Controller
                        control={control}
                        name='file'
                        rules={{ required: `Please upload a file` }}
                        render={({ field, formState: { errors } }) => (
                          <>
                            <Typography
                              variant='subtitle1'
                              fontWeight={700}
                              mb={2}
                            >{`Upload a file from your device`}</Typography>
                            {field?.value ? (
                              <Box
                                width={'max-content'}
                                display={'flex'}
                                flexDirection={'column'}
                                justifyContent={'center'}
                                gap={2}
                              >
                                <Box
                                  border={1}
                                  borderRadius={1}
                                  width={100}
                                  height={100}
                                  display={'flex'}
                                  alignItems={'center'}
                                  justifyContent={'center'}
                                  position={'relative'}
                                >
                                  <Icon icon={'mdi:file-outline'} fontSize={30} />
                                  <Box
                                    position={'absolute'}
                                    top={-10}
                                    right={-10}
                                    bgcolor={'error.main'}
                                    borderRadius={100}
                                  >
                                    <IconButton size='small' onClick={() => field.onChange(null)}>
                                      <Icon icon={'mdi:close'} color='white' />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Typography
                                  variant='subtitle2'
                                  width={'100%'}
                                  whiteSpace={'nowrap'}
                                  overflow={'hidden'}
                                  textOverflow={'ellipsis'}
                                >
                                  {field?.value?.name}
                                </Typography>
                              </Box>
                            ) : (
                              <TextField
                                type='file'
                                fullWidth
                                onChange={e => {
                                  field.onChange(e?.target?.files[0])
                                }}
                                error={!!errors?.file}
                                helperText={errors?.file?.message}
                                size='small'
                                placeholder={selectedType?.inputPlaceholder ?? 'e.g. Pdf, Xls, Adobe, Miro, Etc.,'}
                                InputProps={{
                                  startAdornment: (
                                    <Box display={'flex'} mr={2}>
                                      <Icon
                                        icon={selectedType?.icon}
                                        fontSize={20}
                                        color={theme?.palette.primary.main}
                                      />
                                    </Box>
                                  )
                                }}
                              />
                            )}
                          </>
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name='value'
                        rules={{
                          required: `Please enter a ${selectedType?.inputTitle ?? ''} link`,
                          validate: value => {
                            if (selectedType?.regex) {
                              const isValid = selectedType.regex.some(pattern => pattern.test(value))

                              return (
                                isValid ||
                                `Please enter a valid ${selectedType?.inputTitle ?? selectedType?.title} link`
                              )
                            }

                            return true
                          }
                        }}
                        render={({ field, formState: { errors } }) => (
                          <>
                            <Typography
                              variant='subtitle1'
                              fontWeight={700}
                              mb={2}
                            >{`Paste any ${selectedType?.inputTitle ?? selectedType?.title ?? 'file'} link`}</Typography>
                            <TextField
                              fullWidth
                              {...field}
                              error={!!errors?.value}
                              helperText={errors?.value?.message}
                              size='small'
                              placeholder={selectedType?.inputPlaceholder ?? 'e.g. Pdf, Xls, Adobe, Miro, Etc.,'}
                              InputProps={{
                                startAdornment: (
                                  <Box display={'flex'} mr={2}>
                                    <Icon icon={selectedType?.icon} fontSize={20} color={theme?.palette.primary.main} />
                                  </Box>
                                )
                              }}
                            />
                          </>
                        )}
                      />
                    )}

                    {/* Display Text */}
                    <Controller
                      control={control}
                      name='displayText'
                      rules={{ required: 'Please enter a text to display file' }}
                      render={({ field, formState: { errors } }) => (
                        <>
                          <Typography
                            variant='subtitle1'
                            fontWeight={700}
                            mt={4}
                            mb={2}
                          >{`Text to display`}</Typography>
                          <TextField
                            fullWidth
                            {...field}
                            error={!!errors?.displayText}
                            helperText={errors?.displayText?.message}
                            size='small'
                            placeholder={'Add your file name here'}
                          />
                        </>
                      )}
                    />
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
                    <CustomButton size='small' variant='text' onClick={handleDialogClose}>
                      Cancel
                    </CustomButton>
                    <CustomButton variant='contained' size='small' type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </CustomButton>
                  </Box>
                </Box>
              </Form>
            </Grid>
            {/* SideBackground */}
            <Grid item xs={12} md={4} display={{ xs: 'none', md: 'flex' }}>
              <Box
                bgcolor={theme.palette.primary.light + 22}
                minHeight={600}
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                flexDirection={'column'}
                gap={20}
              >
                <Image src={images.ImgUploadBg} alt='' />
                <Typography variant='body1' fontWeight={600}>
                  Upload anything...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}

export default DynamicFiles
