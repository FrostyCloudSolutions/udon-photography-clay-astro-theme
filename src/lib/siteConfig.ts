// Site identity seam adopted from the Still template (Aug 6
// adoption round). Udon is a GRANDFATHERED deployment: pure Still
// deployments keep neutral demo defaults here and override them from
// the CMS, but this site's Site settings document has no identity
// fields — so the defaults ARE the client's real identity, on
// purpose. If identity fields are ever added to the Studio schema,
// they win automatically (same contract as the template).
export const SITE_DEFAULTS = {
  siteName: 'Udon Studio',
  tagline: 'Professional Photography',
  copyrightName: 'Udon Studio',
  siteUrl: 'https://udonphoto.com',
  contactEmail: 'frame@udonphoto.com',
  instagramUrl: '',
  xiaohongshuUrl: '',
};

export type SiteIdentity = typeof SITE_DEFAULTS;

export function resolveSiteIdentity(
  settings: Partial<Record<keyof SiteIdentity, string>> | null,
): SiteIdentity {
  return {
    siteName: settings?.siteName || SITE_DEFAULTS.siteName,
    tagline: settings?.tagline || SITE_DEFAULTS.tagline,
    copyrightName:
      settings?.copyrightName || settings?.siteName || SITE_DEFAULTS.copyrightName,
    siteUrl: (settings?.siteUrl || SITE_DEFAULTS.siteUrl).replace(/\/$/, ''),
    contactEmail: settings?.contactEmail || SITE_DEFAULTS.contactEmail,
    instagramUrl: settings?.instagramUrl || SITE_DEFAULTS.instagramUrl,
    xiaohongshuUrl: settings?.xiaohongshuUrl || SITE_DEFAULTS.xiaohongshuUrl,
  };
}
