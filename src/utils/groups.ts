import { classifyString, sortGenericItemsInplace } from './helpers'

import type { TodoItem, TodoGroup, GroupByType, SortDirection, TagGroup } from 'src/_types'
export const groupTodos = (
  items: TodoItem[],
  groupBy: GroupByType,
  sortGroups: SortDirection,
  sortItems: SortDirection,
  subGroupSort: SortDirection,
  groupByProperty?: string,
  subGroupByType?: GroupByType,
  parentId?: string,
): TodoGroup[] => {
  const groups: TodoGroup[] = []
  for (const item of items) {
    let itemKey = ''
    if (groupBy === 'page') {
      itemKey = item.filePath
    } else if (groupBy === 'heading') {
      itemKey = item.subHeading ?? 'No Heading'
    } else if (groupBy === 'folder') {
      const parts = item.filePath.split('/')
      itemKey = parts.length > 1 ? parts.slice(0, -1).join('/') : '/'
    } else if (groupBy === 'property') {
      itemKey = groupByProperty && item.fileInfo.cache.frontmatter?.[groupByProperty] ? String(item.fileInfo.cache.frontmatter[groupByProperty]) : 'No Property'
    } else if (groupBy === 'tag') {
      // For tag grouping, we want to group by the main tag first
      itemKey = item.mainTag ? `#${item.mainTag}` : '#No Tag'
    } else {
      itemKey = `#${[item.mainTag, item.subTag].filter(e => e != null).join('/')}`
    }

    if (parentId) {
      itemKey = `${parentId}::${itemKey}`
    }

    let group = groups.find(g => g.id === itemKey)
    if (!group) {
      const newGroup: TodoGroup = {
        id: itemKey,
        sortName: '',
        className: '',
        type: groupBy,
        todos: [],
        oldestItem: Infinity,
        newestItem: 0,
      } as any

      if (newGroup.type === 'page') {
        newGroup.pageName = item.fileLabel
        newGroup.sortName = item.fileLabel
        newGroup.className = classifyString(item.fileLabel)
      } else if (newGroup.type === 'tag') {
        newGroup.mainTag = item.mainTag
        newGroup.subTags = item.subTag // This might vary within the group if we group by mainTag
        newGroup.sortName = itemKey
        newGroup.className = classifyString(itemKey)
      } else if (newGroup.type === 'heading') {
        newGroup.heading = item.subHeading ?? 'No Heading';
        newGroup.sortName = newGroup.heading;
        newGroup.className = classifyString(newGroup.heading);
      } else if (newGroup.type === 'folder') {
        newGroup.folderName = itemKey;
        newGroup.sortName = itemKey;
        newGroup.className = classifyString(itemKey);
      } else if (newGroup.type === 'property') {
        newGroup.propertyValue = itemKey;
        newGroup.sortName = itemKey;
        newGroup.className = classifyString(itemKey);
      }
      groups.push(newGroup)
      group = newGroup
    }
    if (group.newestItem < item.fileCreatedTs)
      group.newestItem = item.fileCreatedTs
    if (group.oldestItem > item.fileCreatedTs)
      group.oldestItem = item.fileCreatedTs

    group.todos.push(item)
  }

  const nonEmptyGroups = groups.filter(g => g.todos.length > 0)

  sortGenericItemsInplace(
    nonEmptyGroups,
    sortGroups,
    'sortName',
    sortGroups === 'new->old' ? 'newestItem' : 'oldestItem',
  )

  if (!subGroupByType || subGroupByType === 'none')
    for (const g of groups)
      sortGenericItemsInplace(
        g.todos,
        sortItems,
        'originalText',
        'fileCreatedTs',
      )
  else
    for (const g of nonEmptyGroups) {
      if (subGroupByType) {
        g.groups = groupTodos(
          g.todos,
          subGroupByType,
          subGroupSort,
          sortItems,
          subGroupSort,
          null,
          'none',
          g.id
        )
      }
    }

  return nonEmptyGroups
}
