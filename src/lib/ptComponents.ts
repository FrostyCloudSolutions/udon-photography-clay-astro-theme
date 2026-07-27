// Shared portable-text component mapping for every body renderer
// (posts, pages, inquire copy): photo grids plus the typography
// marks from the editor's Font/Color menus.
import ArticleImageRow from '../components/ArticleImageRow.astro';
import FontMark from '../components/FontMark.astro';
import ColorMark from '../components/ColorMark.astro';

export const ptComponents = {
  type: { imageRow: ArticleImageRow },
  mark: { font: FontMark, textColor: ColorMark },
};
