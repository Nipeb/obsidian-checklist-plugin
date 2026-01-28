import type { CachedMetadata, TagCache, TFile } from 'obsidian'

export type TodoItem = {
  checked: boolean
  status?: string
  filePath: string
  fileName: string
  fileLabel: string
  fileCreatedTs: number
  mainTag?: string
  subTag?: string
  subHeading?: string
  line: number
  spacesIndented: number
  fileInfo: FileInfo
  originalText: string
  rawHTML: string
}

type BaseGroup = {
  type: GroupByType
  todos: TodoItem[]
  id: string
  sortName: string
  className: string
  oldestItem: number
  newestItem: number
  groups?: TodoGroup[]
}

export type PageGroup = BaseGroup & {
  type: 'page'
  pageName?: string
}
export type TagGroup = BaseGroup & {
  type: 'tag'
  mainTag?: string
  subTags?: string
}

export type HeadingGroup = BaseGroup & {
  type: 'heading'
  heading: string
}

export type FolderGroup = BaseGroup & {
  type: 'folder'
  folderName: string
}

export type PropertyGroup = BaseGroup & {
  type: 'property'
  propertyValue: string
}

export type TodoGroup = PageGroup | TagGroup | HeadingGroup | FolderGroup | PropertyGroup

export type FileInfo = {
  content: string
  cache: CachedMetadata
  parseEntireFile: boolean
  frontmatterTag: string
  file: TFile
  validTags: TagCache[]
}

export type TagMeta = { main: string; sub: string }
export type LinkMeta = { filePath: string; linkName: string }

export type GroupByType = 'page' | 'tag' | 'heading' | 'folder' | 'property' | 'none'
export type SortDirection = 'new->old' | 'old->new' | 'a->z' | 'z->a'
export type LookAndFeel = 'compact' | 'classic' | 'minimal' | 'native'

export type Icon = 'chevron' | 'settings' | 'eye-off' | 'refresh-cw'

export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]
