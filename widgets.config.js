import { defineAsyncComponent } from 'vue';

// Cal-Adapt components live in src/caladapt/ and are placed on pages here,
// so upstream STAC Browser files stay unchanged where possible.
export default {
  // Replaces the fork's old collectionOrder option: these appear first on the landing page
  'view-catalog-catalogs-start': [
    {
      id: 'Featured',
      props: {
        entities: ['wrf-ucla', 'loca2', 'loca2-county', 'eh-metrics-mm-boundary-csv', 'pv-generation', 'wind-generation', 'typical-met-year', 'standard-year']
      }
    }
  ],
  'view-catalog-meta-end': [
    {
      id: 'CollectionOverview',
      component: defineAsyncComponent(() => import('./src/caladapt/CollectionOverview.vue')),
      condition: ({ data }) => Boolean(data?.isCollection)
    }
  ]
};
