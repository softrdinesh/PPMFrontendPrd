import { useMemo, useState } from 'react'

import { Card, Grid2, Typography } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'

import CustomButton from '@/components/button'
import DeleteDialog from '@/components/dialog/delete-dialog'
import IconifyIcon from '@/components/icon'
import { useBugQueue } from '@/context/bug-queue-context'
import { useAuth } from '@/hooks/useAuth'

interface DeleteBugsComponentProps {
  showCard: boolean
  selectedRows: any // row-selection state object: { [bugID]: true }
  groupid: any
  workspaceid: any
  setSelectedRows: (value: any) => void
}

const DeleteBugsComponent = ({ showCard, groupid, workspaceid, selectedRows, setSelectedRows }: DeleteBugsComponentProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false)


  const { refetch } = useBugQueue()
  const { user } = useAuth()


  // ** Memos
  const showSelected = useMemo(() => Object?.keys(selectedRows)?.length !== 0, [selectedRows])
 

  const handleDelete = async () => {
    const finalArray = Object.keys(selectedRows)
      .filter(key => selectedRows[key]) // keep only truthy (selected) entries
      .map(id => Number(id))
      .filter(id => !isNaN(id) && id !== 0)

    if (finalArray.length === 0) {
      setDeleteOpen(false)
      return
    }

    try {
      await Promise.all(
        finalArray.map(bugId =>
          axios.post(`${process.env.NEXT_PUBLIC_API_URL1}/RemoveBugQueue`, null, {
            params: {
              BugID: bugId,
              GroupID: groupid,
              LoginuserID: user?.id
            }
          })
        )
      )

      // FIX: re-fetch the group's bug list from GetBugInfoList after delete
      // so the table reflects the removed rows immediately.
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL1}/GetBugInfoList`, {
        params: { GroupID: groupid }
      })

      toast.success('Bug deleted successfully')
        window.dispatchEvent(new Event('bugDeleted'))
      await refetch()
      setSelectedRows({})
    } catch (error) {
      console.error('Error deleting bug(s):', error)
      toast.error('Failed to delete bug(s)')
    } finally {
      setDeleteOpen(false)
    }
  }

  return (
    <Grid2 size={12}>
      <Card
        sx={{
          display: showCard ? 'block' : 'none',
          animation: showSelected ? 'slide-in-anime 200ms linear' : 'slide-out-anime 200ms linear'
        }}
      >
        <div className='m-2 p-2 flex gap-5 items-center'>
          <Typography fontWeight={600}>{`${Object?.keys(selectedRows)?.length} entries selected`}</Typography>
          <CustomButton
            variant='contained'
            size='small'
            color='error'
            sx={{
              backgroundColor: theme => theme.palette.error.light + '44',
              border: 1,
              borderColor: 'error',
              color: 'error.main',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: theme => theme.palette.error.light + '55'
              }
            }}
            onClick={() => setDeleteOpen(true)}
            startIcon={<IconifyIcon icon={'solar:trash-bin-minimalistic-2-bold'} color='red' />}
          >
            Delete
          </CustomButton>
        </div>
      </Card>
      <DeleteDialog
        open={deleteOpen}
        setOpen={val => setDeleteOpen(!!val)}
        description={`All selected rows will be permanently deleted! You cannot revert once deleted.`}
        onConfirm={handleDelete}
        refetch={refetch}
      />
    </Grid2>
  )
}

export default DeleteBugsComponent
