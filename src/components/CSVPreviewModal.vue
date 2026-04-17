<template>
  <b-modal
    v-model="visible"
    :title="title"
    size="xl"
    ok-only
    ok-title="Close"
    scrollable
    @hidden="onHidden"
  >
    <div v-if="loading" class="text-center py-4">
      <b-spinner label="Loading..." />
    </div>
    <div v-else-if="error" class="text-danger p-3">
      Failed to load CSV: {{ error }}
    </div>
    <template v-else>
      <p v-if="truncated" class="text-muted small mb-2">
        Showing first {{ maxRows }} of {{ totalRows }} rows.
      </p>
      <div class="table-responsive">
        <table class="table table-sm table-striped table-bordered mb-0">
          <thead class="thead-light">
            <tr>
              <th v-for="h in headers" :key="h" class="text-nowrap">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in displayRows" :key="i">
              <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { BModal, BSpinner } from 'bootstrap-vue';

const MAX_ROWS = 500;

function parseCSV(text) {
  return text.trim().split('\n').map(line => {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += line[i];
      }
    }
    cells.push(current.trim());
    return cells;
  });
}

export default {
  name: 'CSVPreviewModal',
  components: { BModal, BSpinner },
  props: {
    url: { type: String, required: true },
    title: { type: String, default: 'CSV Preview' },
  },
  data() {
    return {
      visible: true,
      loading: true,
      error: null,
      headers: [],
      rows: [],
      maxRows: MAX_ROWS,
    };
  },
  computed: {
    totalRows() {
      return this.rows.length;
    },
    truncated() {
      return this.rows.length > MAX_ROWS;
    },
    displayRows() {
      return this.rows.slice(0, MAX_ROWS);
    },
  },
  async created() {
    try {
      const resp = await fetch(this.url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const parsed = parseCSV(text);
      this.headers = parsed[0] || [];
      this.rows = parsed.slice(1);
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onHidden() {
      this.$destroy();
      this.$el.parentNode?.removeChild(this.$el);
    },
  },
};
</script>
