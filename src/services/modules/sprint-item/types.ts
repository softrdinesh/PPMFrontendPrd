export interface SprintItem {
  SprintID: number
  Name: string
  WorkSpaceID: number
  SprintGroupID: number
  Goals: string
  SprintStatus: 'Not Started' | 'Active' | 'Paused' | 'Completed'
  SprintTimelineStart: string
  SprintTimelineEnd: string
  IsDelete: boolean
  DeletedDate: any
  Deletedby: any
  CreateDate: string
  CreateBy: number
  UpdatedDate: string
  UpdateBy: number
  SprintTimeElapsedInSeconds: number
}
