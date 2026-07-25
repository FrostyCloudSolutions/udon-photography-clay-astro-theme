import {useCallback} from 'react'
import {Button, Stack} from '@sanity/ui'
import {set, useFormValue, type ArrayOfObjectsInputProps} from 'sanity'

/**
 * Wraps the Article body editor with a one-click prefill: when the
 * body is still empty and the post has photos, a button converts the
 * Photos list into editable Image row blocks (2 photos per row,
 * captions carried over). The client can then write text between
 * rows, reorder, or delete them — the rows are ordinary content.
 */
const key = () => Math.random().toString(36).slice(2, 12)

type Photo = {_key?: string; caption?: string} & Record<string, unknown>

export function ArticleBodyInput(props: ArrayOfObjectsInputProps) {
  const photos = useFormValue(['photos']) as Photo[] | undefined
  const isEmpty = !props.value || props.value.length === 0
  const canFill = isEmpty && Array.isArray(photos) && photos.length > 0

  const fill = useCallback(() => {
    if (!photos?.length) return
    const rows = []
    for (let i = 0; i < photos.length; i += 2) {
      rows.push({
        _type: 'imageRow',
        _key: key(),
        images: photos.slice(i, i + 2).map((photo) => ({...photo, _key: key()})),
      })
    }
    props.onChange(set(rows))
  }, [photos, props])

  const rowCount = photos?.length ? Math.ceil(photos.length / 2) : 0

  return (
    <Stack space={3}>
      {canFill && (
        <Button
          mode="ghost"
          tone="primary"
          text={`Fill with photo rows from Photos (${rowCount} row${rowCount === 1 ? '' : 's'} of 2)`}
          onClick={fill}
        />
      )}
      {props.renderDefault(props)}
    </Stack>
  )
}
