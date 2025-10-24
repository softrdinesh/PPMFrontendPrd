export interface SprintItem {
  SprintID: number
  Name: string
  WorkSpaceID: number
  SprintGroupID: number
  Goals: string
  SprintStatus: 'Not Started' | 'Active' | 'Paused' | 'Completed'
  SprintTimelineStart: Date
  SprintTimelineEnd: Date
  IsDelete: boolean
  DeletedDate: any
  Deletedby: any
  CreateDate: string
  CreateBy: number
  UpdatedDate: string
  UpdateBy: number
  SprintTimeElapsedInSeconds: number
}

export interface TColumnType {
  ColumnTypeID: number
  Key: 'USR' | 'TXT' | 'DDL' | 'DPK' | 'LBL' | 'NUM' | 'FLE'
  Title: string
}
