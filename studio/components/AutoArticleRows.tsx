import {useEffect, useRef} from 'react'
import {useDocumentOperation, type ObjectInputProps} from 'sanity'

/**
 * Keeps the Article body fed from the Photos list, without ever
 * fighting the editor:
 *
 * 1. Article layout + photos + EMPTY body → the whole Photos list is
 *    written into the body as Image rows (2 per row).
 * 2. Article layout + photos added later → only the new photos are
 *    appended to the end of the body as rows.
 * 3. A hidden ledger (articleSyncedKeys) records which photos have
 *    already been placed once — so rows the editor deliberately
 *    deleted are never re-inserted, and nothing ever loops or
 *    duplicates. Photos still uploading (no asset yet) wait until
 *    their upload finishes.
 */
const key = () => Math.random().toString(36).slice(2, 12)

interface Photo {
  _key?: string
  asset?: {_ref?: string}
  [k: string]: unknown
}

interface BodyBlock {
  _type?: string
  images?: Photo[]
}

const chunkIntoRows = (photos: Photo[]) => {
  const rows = []
  for (let i = 0; i < photos.length; i += 2) {
    rows.push({
      _type: 'imageRow',
      _key: key(),
      images: photos.slice(i, i + 2).map((photo) => ({...photo, _key: key()})),
    })
  }
  return rows
}

export function PostFormInput(props: ObjectInputProps) {
  const value = props.value as
    | {
        _id?: string
        layout?: string
        body?: BodyBlock[]
        photos?: Photo[]
        articleSyncedKeys?: string[]
      }
    | undefined
  const documentId = (value?._id ?? '').replace(/^drafts\./, '')
  const {patch} = useDocumentOperation(documentId || 'unknown', 'portfolioPost')
  const valueRef = useRef(value)
  valueRef.current = value

  const layout = value?.layout
  // Only photos whose upload has completed participate.
  const readyPhotos = (value?.photos ?? []).filter((photo) => photo.asset?._ref)
  const photoSignature = readyPhotos.map((photo) => photo._key).join(',')

  useEffect(() => {
    // Debounced so a batch of finishing uploads lands as one append.
    const timer = setTimeout(() => {
      const current = valueRef.current
      if (!documentId || current?.layout !== 'article') return
      const photos = (current?.photos ?? []).filter((photo) => photo.asset?._ref)
      if (photos.length === 0) return

      const body = Array.isArray(current?.body) ? current.body : []
      const synced = new Set(current?.articleSyncedKeys ?? [])
      const refsInBody = new Set(
        body
          .filter((block) => block._type === 'imageRow')
          .flatMap((block) => block.images ?? [])
          .map((image) => image.asset?._ref)
          .filter(Boolean),
      )

      // New = never placed before AND not already sitting in the body.
      const pending = photos.filter(
        (photo) => !synced.has(photo._key ?? '') && !refsInBody.has(photo.asset?._ref),
      )
      // Ledger always absorbs every current photo (placed or pending),
      // so deliberate deletions from the body stay deleted.
      const ledger = [
        ...new Set([...synced, ...photos.map((photo) => photo._key ?? '')]),
      ].filter(Boolean)

      if (pending.length === 0) {
        return
      }

      const rows = chunkIntoRows(pending)
      if (body.length === 0) {
        patch.execute([{set: {body: rows, articleSyncedKeys: ledger}}])
      } else {
        patch.execute([
          {insert: {after: 'body[-1]', items: rows}},
          {set: {articleSyncedKeys: ledger}},
        ])
      }
    }, 1500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, photoSignature, documentId])

  return props.renderDefault(props)
}
