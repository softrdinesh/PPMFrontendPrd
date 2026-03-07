import { useMemo, useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  Grid,
  IconButton,
  Menu,
  TextField,
  Typography,
  Zoom
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import type { AdditionalColumn } from '@/services/modules/project/types'
import { updateSubTask } from '@/services/modules/sub-task'
import type { AdditionalSubTaskListItem } from '@/services/modules/sub-task/types'
import { deleteDynamicValue, updateTasks } from '@/services/modules/task'
import { addDropdownItem, fetchDropDownList } from '@/services/modules/task-group'
import type { DynamicDropdownList } from '@/services/modules/task-group/types'
import type { AdditionalValue, SprintItem } from '@/services/modules/sprint-item/types'
import CustomButton from '@components/button'
import { useAuth } from '@/hooks/useAuth'

interface DynamicDropdownProps {
  rowData: SprintItem 
  refetch: () => void
  isSubTask?: boolean
  dynamicValue?: AdditionalValue[]
  columnData?: AdditionalColumn
  canEdit?: boolean
}

type FormValidateType = { dropdown: any }

// Define interface for the sprint dropdown response
interface SprintDropdownResponse {
  dynamicDropdownID: number;
  valuetxt: string;
}

const DynamicDropdown = ({ columnData, rowData, dynamicValue, refetch, canEdit }: DynamicDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [createMenu, setCreateMenu] = useState(false)
  const { user } = useAuth();
console.log(columnData,rowData,'columnData')
  // API function for fetching sprint dropdown values - inside component
  const fetchSprintDropdownValues = async (sprintGroupId: string, sprintId: string): Promise<SprintDropdownResponse[]> => {
    const response = await axios.get(
      `https://uat.ppmbackend.projectpulse360.com/SprintGetDynamicDropdownvaluelist?SprintGroupID=${sprintGroupId}&SprintID=${sprintId}`
    );
    return response.data;
  };

  // API function for creating new dynamic values
  const callInsertDynamicValuesAPI = async (newValue: string) => {
    const DynamicColumnID = columnData?.additionalColumnID;
    const LoginuserID = user?.id;
    const SprintID = rowData?.SprintID;
    const SprintGroupID = rowData?.SprintGroupID;
    const DynamicValue = newValue;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL1;

    const apiUrl = `${BASE_URL}/SprintCreateDynamicDropdownValues?AdditionalColID=${DynamicColumnID}&LoginUserID=${LoginuserID}&SprintGrpID=${SprintGroupID}&SprintID=${SprintID}&Dynamicvalue=${encodeURIComponent(DynamicValue)}`;

    try {
      const response = await axios.post(apiUrl);
      toast.success('Value created successfully');
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Failed to create value');
      throw error;
    }
  };

  // This query remains unchanged
  const { data: dropdownItems, refetch: refetchDDL } = useQuery({
    queryKey: ['dropdown-items', rowData?.TaskGroupID],
    queryFn: () => fetchDropDownList({ taskGroupID: rowData?.TaskGroupID?.toString() })
  })

  // Query for fetching sprint dropdown values
  const { data: sprintDropdownValues, refetch: refetchSprintValues } = useQuery({
    queryKey: ['sprint-dropdown-values', rowData?.SprintGroupID, rowData?.SprintID],
    queryFn: () => fetchSprintDropdownValues(
      rowData?.SprintGroupID?.toString() || '',
      rowData?.SprintID?.toString() || ''
    ),
    enabled: !!(rowData?.SprintGroupID && rowData?.SprintID)
  });

  // Transform sprint dropdown values to match the expected format
  const transformedSprintValues = useMemo(() => {
    if (!sprintDropdownValues) return [];
    
    return sprintDropdownValues.map(item => ({
      Dynamic_ddl_ID: item.dynamicDropdownID,
      Valuetxt: item.valuetxt
    }));
  }, [sprintDropdownValues]);

  // Combine both sources or use whichever is appropriate
  const listItems = useMemo(() => {
    // If we have sprint dropdown values, use them (filtering out already selected ones)
    if (transformedSprintValues.length > 0) {
      return transformedSprintValues.filter(i =>
        dynamicValue?.every(val => {
          // Check both possible structures for the selected value ID
          const selectedId = val?.dynamicddlID || val?.Dropdown?.Dynamic_ddl_ID;
          return selectedId !== i?.Dynamic_ddl_ID;
        })
      );
    }
    
    // Otherwise fall back to the original dropdown items
    const finalArr = dropdownItems?.filter(i =>
      dynamicValue?.every(val => {
        // Check both possible structures for the selected value ID
        const selectedId = val?.dynamicddlID || val?.Dropdown?.Dynamic_ddl_ID;
        return selectedId !== i?.Dynamic_ddl_ID;
      })
    )

    return finalArr ?? []
  }, [dynamicValue, dropdownItems, transformedSprintValues])

  const handleOpen = (e: any) => {
    canEdit && setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCreateMenu(false)
  }

  // const handleDropdownSelect = async (item: DynamicDropdownList | null) => {
  //   try {
  //     if (!item) return;
      
  //     const body: any = {
  //       DynamicID: null,
  //       AdditionalColumnID: columnData?.additionalColumnID,
  //       value: item?.Dynamic_ddl_ID,
  //       Title: `Column '${columnData?.ColumnName}' was updated`,
  //       PreviousState: `${dynamicValue?.length} items selected`,
  //       NewState: `${dynamicValue?.length ? dynamicValue?.length + 1 : 1} items selected`
  //     }

  //     // Call the appropriate update API based on whether it's a subtask or main task
  //     const response = await updateTasks({ id: rowData?.TaskID?.toString(), body });
      
  //     if (response) {
  //       toast.success('Value selected successfully');
  //       await refetch();
  //       await refetchSprintValues();
  //       handleClose();
  //     }
  //   } catch (error) {
  //     console.error('error selecting dropdown value :', error)
  //     toast.error('Failed to select value');
  //   }
  // }
  const handleDropdownSelect = async (item: DynamicDropdownList | null) => {
  try {
    if (!item) return;
    
    // Construct the API URL with the required parameters
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL1;
    const DynamicColumnID = columnData?.additionalColumnID;
    const LoginuserID = user?.id;
    const SprintID = rowData?.SprintID;
    const SprintGroupID = rowData?.SprintGroupID;
    const DynamicValue = item?.Dynamic_ddl_ID;
    
    const apiUrl = `${BASE_URL}/InsertDynamicValues?DynamicColumnID=${DynamicColumnID}&LoginuserID=${LoginuserID}&SprintID=${SprintID}&SprintGroupID=${SprintGroupID}&DynamicValue=${DynamicValue}`;
    
    // Make the API call using POST method (since GET returned 405)
    const response = await axios.post(apiUrl);
    
    if (response) {
      toast.success('Value selected successfully');
      await refetch();
      await refetchSprintValues();
      handleClose();
    }
  } catch (error) {
    console.error('error selecting dropdown value :', error)
    toast.error('Failed to select value');
  }
}

  const handleDeleteLabel = async (id: string) => {
    try {
      await deleteDynamicValue(id);
      toast.success('Value deleted successfully');
      refetch();
      refetchSprintValues();
    } catch (error) {
      console.error('error deleting value :', error);
      toast.error('Failed to delete value');
    }
  }

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValidateType>({
    defaultValues: {
      dropdown: ''
    }
  });

  // Submit handler for creating new dropdown value
  const onSubmit = async (data: FormValidateType) => {
    try {
      if (!data.dropdown) return;
      
      // Call the create API
      const response = await callInsertDynamicValuesAPI(data.dropdown);
      
      if (response) {
        // Refetch the sprint dropdown values to include the newly created one
        await refetchSprintValues();
        
        // Reset form and close create menu (go back to selection view)
        reset();
        setCreateMenu(false);
        // Don't close the main menu - this allows manual selection
      }
    } catch (error) {
      console.error('error creating dropdown value :', error);
    }
  };

  return (
    <Box display={'flex'} alignItems={'center'} height={'100%'}>
      <Box onClick={handleOpen} sx={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}>
        {dynamicValue?.length ? (
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <Chip variant='tonal' size='small' label={dynamicValue?.[0]?.dynamicDropdownValueList?.[0]?.valueText || dynamicValue?.[0]?.Dropdown?.Valuetxt} />
            {dynamicValue?.length >= 2 && `+${dynamicValue?.length - 1}`}
          </Box>
        ) : canEdit ? (
          <IconButton>
            <Icon icon={'bi:plus-circle-dotted'} />
          </IconButton>
        ) : (
          '-'
        )}
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionComponent={Zoom}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'center', vertical: 'center' }}
        sx={{ '& .MuiList-root': { p: 0 } }}
      >
        {createMenu ? (
          <Box component={'form'} onSubmit={handleSubmit(onSubmit)} width='300px' p={2} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} p={2}>
                <Box display={'flex'} alignItems={'center'} mt={2} gap={2}>
                  <FormControl fullWidth>
                    <Controller
                      name='dropdown'
                      rules={{ required: true }}
                      control={control}
                      render={({ field: { value, onChange }, formState: { errors } }) => (
                        <TextField
                          value={value}
                          onChange={onChange}
                          error={!!errors?.dropdown}
                          helperText={errors?.dropdown ? 'This field is required' : ''}
                          size='small'
                          placeholder='Dropdown name'
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box minHeight={'50px'}></Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={2}>
                  <CustomButton circular onClick={() => setCreateMenu(false)} size='small' variant='contained'>
                    {'Back'}
                  </CustomButton>
                  <CustomButton disabled={isSubmitting} circular type='submit' size='small' variant='contained'>
                    {isSubmitting ? 'Saving..' : 'Save'}
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box width='300px' p={2} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} p={2}>
                <Box display={'flex'} alignItems={'center'} mt={2} gap={2}>
                  <FormControl fullWidth>
                    <Autocomplete
                      clearOnBlur
                      value={null}
                      options={listItems ?? []}
                      id='autocomplete-free-solo-with-text'
                      renderOption={(props, option) => (
                        <li {...props} key={option.Dynamic_ddl_ID}>
                          {option.Valuetxt}
                        </li>
                      )}
                      size='small'
                      renderInput={params => <TextField {...params} placeholder='Select a value' />}
                      getOptionLabel={option => {
                        return option.Valuetxt || ''
                      }}
                      isOptionEqualToValue={(option, value) => option.Dynamic_ddl_ID === value?.Dynamic_ddl_ID}
                      onChange={(event, newValue) => {
                        handleDropdownSelect(newValue)
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box minHeight={'50px'}>
                  {dynamicValue?.length ? (
                    <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} rowGap={3} columnGap={3}>
                      {dynamicValue?.map((item, index) => {
                        // Get the value text from either structure
                        const valueText = item?.dynamicDropdownValueList?.[0]?.valueText || item?.Dropdown?.Valuetxt;
                        const itemId = item?.dynamicddlID || item?.Dropdown?.Dynamic_ddl_ID;
                        
                        return (
                          <Box
                            key={itemId || index}
                            borderRadius={10}
                            py={1}
                            px={3}
                            bgcolor={'#DCE3F6'}
                            border={1.2}
                            borderColor={'#004AAA'}
                            display={'flex'}
                            alignItems={'center'}
                            gap={2.5}
                          >
                            <Typography lineHeight={1} fontSize={14}>
                              {valueText}
                            </Typography>
                            
                            <IconButton
                              size='small'
                              sx={{ p: 0 }}
                              onClick={() => handleDeleteLabel(itemId?.toString() || index.toString())}
                            >
                              <Icon icon={'ep:close-bold'} color='red' />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      display={'flex'}
                      bgcolor={'background.default'}
                      p={3}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      None Selected
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'end'} p={2}>
                  <CustomButton onClick={() => setCreateMenu(true)} size='small' variant='contained'>
                    {'Create new value'}
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default DynamicDropdown
