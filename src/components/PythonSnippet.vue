<template>
  <div v-if="snippet" class="python-snippet mt-3">
    <p class="snippet-label">{{ label }}</p>
    <div class="snippet-block">
      <div class="snippet-actions">
        <a v-if="climakitaeSnippet" href="https://github.com/cal-adapt/climakitae" target="_blank" rel="noopener noreferrer" class="snippet-btn">climakitae on GitHub</a>
        <button class="snippet-btn" @click="copy">{{ copied ? '✓ Copied' : 'Copy code' }}</button>
      </div>
      <pre class="snippet-code"><code>{{ snippet }}</code></pre>
    </div>
  </div>
</template>

<script>
const CLIMAKITAE_WRF_COLLECTIONS = new Set([
  'wrf-ucla',
  'wrf-derived-vars',
]);

const CLIMAKITAE_LOCA2_COLLECTIONS = new Set([
  'loca2',
]);

const CLIMAKITAE_REN_COLLECTIONS = new Set([
  'pv-generation',
  'wind-generation',
]);

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
      const col = this.collectionId;
      const p = this.itemProps;

      if (CLIMAKITAE_WRF_COLLECTIONS.has(col)) {
        return [
          'import climakitae as ck',
          '',
          'cd = ck.ClimateData(verbosity=-1)',
          'data = (cd',
          '    .catalog("cadcat")',
          `    .activity_id("${p['cmip6:activity_id']}")`,
          `    .institution_id("${p['cmip6:institution_id']}")`,
          `    .variable("${p.variable_id}")`,
          `    .experiment_id("${p['cmip6:experiment_id']}")`,
          `    .source_id("${p['cmip6:source_id']}")`,
          `    .grid_label("${p['cmip6:grid_label']}")`,
          '    .get()',
          ')',
          'data',
        ].join('\n');
      }

      if (CLIMAKITAE_LOCA2_COLLECTIONS.has(col)) {
        return [
          'import climakitae as ck',
          '',
          'cd = ck.ClimateData(verbosity=-1)',
          'data = (cd',
          '    .catalog("cadcat")',
          `    .activity_id("${p['cmip6:activity_id']}")`,
          `    .variable("${p.variable_id}")`,
          `    .experiment_id("${p['cmip6:experiment_id']}")`,
          `    .source_id("${p['cmip6:source_id']}")`,
          `    .grid_label("${p['cmip6:grid_label']}")`,
          '    .get()',
          ')',
          'data',
        ].join('\n');
      }

      if (CLIMAKITAE_REN_COLLECTIONS.has(col)) {
        return [
          'import climakitae as ck',
          '',
          'cd = ck.ClimateData(verbosity=-1)',
          'data = (cd',
          '    .catalog("renewable energy generation")',
          `    .installation("${p.installation}")`,
          `    .variable("${p.variable_id}")`,
          `    .experiment_id("${p['cmip6:experiment_id']}")`,
          `    .source_id("${p['cmip6:source_id']}")`,
          `    .table_id("${p['cmip6:table_id']}")`,
          `    .grid_label("${p['cmip6:grid_label']}")`,
          '    .get()',
          ')',
          'data',
        ].join('\n');
      }

      return null;
    },
    genericSnippet() {
      const href = this.href;
      if (!href.startsWith('s3://')) return null;

      if (this.mediaType.includes('zarr') || href.endsWith('.zarr')) {
        return `import xarray as xr\n\nds = xr.open_zarr("${href}")\nds`;
      }
      if (this.mediaType.includes('netcdf') || href.endsWith('.nc')) {
        return `import xarray as xr\n\nds = xr.open_dataset("${href}")\nds`;
      }
      if (this.mediaType === 'text/csv' || href.endsWith('.csv')) {
        return `import pandas as pd\n\ndf = pd.read_csv("${href}")\ndf.head()`;
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
.snippet-label {
  font-size: 0.78rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.4rem;
  font-weight: 600;
}
.snippet-block {
  position: relative;
  background: #1e1e1e;
  border-radius: 6px;
  padding: 1rem 1rem 1rem 1rem;
}
.snippet-code {
  margin: 0;
  color: #d4d4d4;
  font-size: 0.82rem;
  line-height: 1.6;
  background: transparent;
  border: none;
  padding: 0;
  white-space: pre;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
.snippet-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.3rem;
}
.snippet-btn {
  background: #3c3c3c;
  color: #aaa;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-decoration: none;
}
.snippet-btn:hover {
  background: #505050;
  color: #fff;
  text-decoration: none;
}
</style>
