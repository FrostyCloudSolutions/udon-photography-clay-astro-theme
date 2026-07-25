import {useCallback, useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Select,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import {insert, useClient, type ArrayOfObjectsInputProps} from 'sanity'

/**
 * Adds an "Add many from library" button to the Photos field: a
 * checkbox-style grid of every uploaded image (newest first),
 * filterable by media tag and filename, appending all selected
 * photos to the list in one click. Complements the two existing
 * paths: drag-multiple-files upload, and single Add item.
 */
const key = () => Math.random().toString(36).slice(2, 12)

interface AssetDoc {
  _id: string
  url: string
  originalFilename?: string
}

interface TagDoc {
  _id: string
  name?: {current?: string}
}

export function PhotosArrayInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({apiVersion: '2026-07-01'})
  const [open, setOpen] = useState(false)
  const [assets, setAssets] = useState<AssetDoc[]>([])
  const [tags, setTags] = useState<TagDoc[]>([])
  const [tag, setTag] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) return
    client
      .fetch(`*[_type == "media.tag"] | order(name.current asc){_id, name}`)
      .then(setTags)
      .catch(() => setTags([]))
  }, [open, client])

  useEffect(() => {
    if (!open) return
    const params: Record<string, string> = {}
    let filter = '_type == "sanity.imageAsset"'
    if (tag) {
      filter += ' && $tag in opt.media.tags[]._ref'
      params.tag = tag
    }
    if (search.trim()) {
      filter += ' && originalFilename match $q'
      params.q = `*${search.trim()}*`
    }
    client
      .fetch(
        `*[${filter}] | order(_createdAt desc)[0...120]{_id, url, originalFilename}`,
        params,
      )
      .then(setAssets)
      .catch(() => setAssets([]))
  }, [open, tag, search, client])

  const toggle = useCallback((id: string) => {
    setSelected((current) => ({...current, [id]: !current[id]}))
  }, [])

  const selectedCount = Object.values(selected).filter(Boolean).length

  const addSelected = useCallback(() => {
    const items = assets
      .filter((asset) => selected[asset._id])
      .map((asset) => ({
        _type: 'image',
        _key: key(),
        asset: {_type: 'reference', _ref: asset._id},
      }))
    if (items.length > 0) props.onChange(insert(items, 'after', [-1]))
    setSelected({})
    setOpen(false)
  }, [assets, selected, props])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        mode="ghost"
        tone="primary"
        text="Add many from library…"
        onClick={() => setOpen(true)}
      />
      {open && (
        <Dialog
          id="photos-multi-picker"
          header="Add photos from the library"
          width={2}
          onClose={() => setOpen(false)}
          footer={
            <Flex padding={3} gap={2} justify="flex-end">
              <Button mode="ghost" text="Cancel" onClick={() => setOpen(false)} />
              <Button
                tone="primary"
                disabled={selectedCount === 0}
                text={`Add ${selectedCount} photo${selectedCount === 1 ? '' : 's'}`}
                onClick={addSelected}
              />
            </Flex>
          }
        >
          <Box padding={3}>
            <Stack space={3}>
              <Flex gap={2}>
                <Box flex={2}>
                  <TextInput
                    placeholder="Search by filename…"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                  />
                </Box>
                <Box flex={1}>
                  <Select value={tag} onChange={(event) => setTag(event.currentTarget.value)}>
                    <option value="">All tags</option>
                    {tags.map((tagDoc) => (
                      <option key={tagDoc._id} value={tagDoc._id}>
                        {tagDoc.name?.current ?? 'untitled tag'}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
              {assets.length === 0 ? (
                <Text muted size={1}>
                  No photos found.
                </Text>
              ) : (
                <Grid columns={[3, 4, 5]} gap={2}>
                  {assets.map((asset) => (
                    <Card
                      key={asset._id}
                      tone={selected[asset._id] ? 'primary' : 'default'}
                      border
                      padding={1}
                      style={{cursor: 'pointer'}}
                      onClick={() => toggle(asset._id)}
                    >
                      <img
                        src={`${asset.url}?w=200&h=200&fit=crop&auto=format`}
                        alt={asset.originalFilename ?? ''}
                        style={{
                          display: 'block',
                          width: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          opacity: selected[asset._id] ? 1 : 0.85,
                        }}
                      />
                    </Card>
                  ))}
                </Grid>
              )}
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}
