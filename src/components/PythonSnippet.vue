<template>
  <div v-if="snippet" class="python-snippet mt-3">
    <p class="snippet-label">Open with Python</p>
    <div class="snippet-block">
      <button class="copy-btn" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
      <pre class="snippet-code"><code>{{ snippet }}</code></pre>
    </div>
  </div>
</template>

<script>
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
    snippet() {
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
.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #3c3c3c;
  color: #aaa;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.copy-btn:hover {
  background: #505050;
  color: #fff;
}
</style>
