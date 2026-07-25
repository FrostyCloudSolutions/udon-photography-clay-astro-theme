import {useEffect, useRef} from 'react'
import {useDocumentOperation, type ObjectInputProps} from 'sanity'

/**
 * Automatic article-body bootstrap: whenever a post is in Article
 * layout with photos but NO article body, the Photos list is written
 * into the body as Image row blocks (2 photos per row, captions
 * carried over). Once the body has content it is never overwritten,
 * so edits are safe and there is no loop. Runs when a document is
 * opened and when the Layout toggle is switched to Article.
 */
const key = () => Math.random().toString(36).slice(2, 12)

type Photo = {_key?: string} & Record<string, unknown>

export function PostFormInput(props: ObjectInputProps) {
  const value = props.value as
    | {_id?: string; layout?: string; body?: unknown[]; photos?: Photo[]}
    | undefined
  const layout = value?.layout
  const documentId = (value?._id ?? '').replace(/^drafts\./, '')
  const {patch} = useDocumentOperation(documentId || 'unknown', 'portfolioPost')
  const previousLayout = useRef<string | 'unset'>('unset')

  useEffect(() => {
    const bodyEmpty = !Array.isArray(value?.body) || value.body.length === 0
    const photos = Array.isArray(value?.photos) ? value.photos : []
    const openedInArticle = previousLayout.current === 'unset' && layout === 'article'
    const switchedToArticle =
      previousLayout.current !== 'unset' &&
      previousLayout.current !== 'article' &&
      layout === 'article'
    previousLayout.current = layout ?? 'none'

    if (!documentId || !bodyEmpty || photos.length === 0) return
    if (!openedInArticle && !switchedToArticle) return

    const rows = []
    for (let i = 0; i < photos.length; i += 2) {
      rows.push({
        _type: 'imageRow',
        _key: key(),
        images: photos.slice(i, i + 2).map((photo) => ({...photo, _key: key()})),
      })
    }
    patch.execute([{set: {body: rows}}])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  return props.renderDefault(props)
}
