import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '3g68vjze',
    dataset: 'production'
  },
  // Hosted Studio address: https://udon-studio.sanity.studio
  studioHost: 'udon-studio',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    // Reported by `sanity deploy` — pinning it skips the interactive
    // application-id prompt on future deploys.
    appId: 'fwna9jslvpj5hbn4w9ivfh19',
  },
})
