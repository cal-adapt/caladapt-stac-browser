<template>
  <div v-if="snippet" class="python-snippet mt-3">
    <div class="snippet-header">
      <p class="snippet-label">{{ label }}</p>
      <div class="snippet-actions">
        <a v-if="climakitaeSnippet" href="https://github.com/cal-adapt/climakitae" target="_blank" rel="noopener noreferrer" class="snippet-btn">climakitae on GitHub</a>
        <button class="snippet-btn" @click="copy">{{ copied ? '✓ Copied' : 'Copy code' }}</button>
      </div>
    </div>
    <pre class="snippet-code"><code>{{ snippet }}</code></pre>
  </div>
</template>

<script>
// climakitae query methods, in order, and the item property each one takes.
// The model name goes through modelName() because climakitae's catalog uses
// official casing ("TaiESM1") while STAC IDs are lowercase ("taiesm1").
const WRF_QUERY = [
  ['activity_id', 'cmip6:activity_id'],
  ['institution_id', 'cmip6:institution_id'],
  ['source_id', 'cmip6:source_id'],
  ['experiment_id', 'cmip6:experiment_id'],
  ['table_id', 'cmip6:table_id'],
  ['grid_label', 'cmip6:grid_label'],
  ['variable_id', 'variable_id'],
];

const CLIMAKITAE_QUERIES = {
  'wrf-ucla': { catalog: 'cadcat', query: WRF_QUERY },
  'wrf-derived-vars': { catalog: 'cadcat', query: WRF_QUERY },
  loca2: { catalog: 'cadcat', query: WRF_QUERY.filter(([method]) => method !== 'institution_id') },
  'pv-generation': { catalog: 'renewable energy generation', query: [['installation', 'installation'], ...WRF_QUERY.slice(2)] },
  'wind-generation': { catalog: 'renewable energy generation', query: [['installation', 'installation'], ...WRF_QUERY.slice(2)] },
};

// Official names of the models in climakitae's catalogs
const MODEL_NAMES = Object.fromEntries([
  'ACCESS-CM2', 'CESM2', 'CESM2-LENS', 'CNRM-ESM2-1', 'EC-Earth3', 'EC-Earth3-Veg', 'ERA5', 'FGOALS-g3', 'GFDL-ESM4',
  'HadGEM3-GC31-LL', 'INM-CM5-0', 'IPSL-CM6A-LR', 'KACE-1-0-G', 'MIROC6', 'MPI-ESM1-2-HR', 'MRI-ESM2-0', 'TaiESM1',
].map(name => [name.toLowerCase(), name]));

const modelName = id => MODEL_NAMES[String(id).toLowerCase()] || id;

export default {
  name: 'PythonSnippet',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      copied: false
    };
  },
  computed: {
    href() {
      return this.asset?.href || '';
    },
    mediaType() {
      return (this.asset?.type || '').toLowerCase();
    },
    itemContext() {
      return this.asset?.getContext?.() || null;
    },
    collectionId() {
      return this.itemContext?.collection || '';
    },
    itemProps() {
      return this.itemContext?.properties || {};
    },
    climakitaeSnippet() {
      const config = CLIMAKITAE_QUERIES[this.collectionId];
      if (!config) {
        return null;
      }
      const p = this.itemProps;
      const value = (method, prop) => method === 'source_id' ? modelName(p[prop]) : p[prop];
      return [
        '# pip install climakitae  (version 1.5.10 or later)',
        'import climakitae as ck',
        '',
        'cd = ck.ClimateData(verbosity=-1)',
        'data = (cd',
        `    .catalog("${config.catalog}")`,
        ...config.query.map(([method, prop]) => `    .${method}("${value(method, prop)}")`),
        '    .get()',
        ')',
        'data',
      ].join('\n');
    },
    genericSnippet() {
      const href = this.href;
      if (!href.startsWith('s3://')) {return null;}

      if (this.mediaType.includes('zarr') || href.endsWith('.zarr')) {
        return `import xarray as xr\n\nds = xr.open_zarr("${href}", storage_options={"anon": True})\nds`;
      }
      if (this.mediaType.includes('netcdf') || href.endsWith('.nc')) {
        return `import xarray as xr\n\nds = xr.open_dataset("${href}", storage_options={"anon": True})\nds`;
      }
      if (this.mediaType === 'text/csv' || href.endsWith('.csv')) {
        return `import pandas as pd\n\ndf = pd.read_csv("${href}", storage_options={"anon": True})\ndf.head()`;
      }
      return null;
    },
    snippet() {
      return this.climakitaeSnippet || this.genericSnippet;
    },
    label() {
      return this.climakitaeSnippet ? 'Open with climakitae' : 'Open with Python';
    }
  },
  methods: {
    async copy() {
      try {
        await navigator.clipboard.writeText(this.snippet);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      } catch (e) {
        console.error('Failed to copy snippet', e);
      }
    }
  }
};
</script>

<style scoped>
/* The code box itself uses STAC Browser's standard pre styling (see theme/custom.scss) */
.snippet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.snippet-label {
  font-size: 0.78rem;
  color: var(--bs-secondary-color);
  font-weight: 600;
  margin: 0;
}
.snippet-actions {
  display: flex;
  gap: 0.3rem;
}
.snippet-btn {
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  border: 1px solid var(--bs-border-color);
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  cursor: pointer;
  text-decoration: none;
}
.snippet-btn:hover {
  background: var(--bs-secondary-bg);
}
</style>
