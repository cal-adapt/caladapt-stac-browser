<template>
  <div class="pagination-wrapper">
    <b-button-group>
      <b-button @click="go(pagination.first, 1, 'first')" :disabled="!pagination.first || isLoading" variant="primary">
        <b-spinner v-if="isLoading && activeDirection === 'first'" small variant="light" />
        <span v-else>{{ $t('pagination.first') }}</span>
      </b-button>
      <b-button @click="go(pagination.prev, page - 1, 'prev')" :disabled="!pagination.prev || isLoading" variant="primary">
        <b-spinner v-if="isLoading && activeDirection === 'prev'" small variant="light" />
        <span v-else>{{ $t('pagination.previous') }}</span>
      </b-button>
      <b-button @click="go(pagination.next, page + 1, 'next')" :disabled="!pagination.next || isLoading" variant="primary">
        <b-spinner v-if="isLoading && activeDirection === 'next'" small variant="light" />
        <span v-else>{{ $t('pagination.next') }}</span>
      </b-button>
      <b-button v-if="pagination.last" @click="go(pagination.last, totalPages, 'last')" :disabled="isLoading" variant="primary">
        <b-spinner v-if="isLoading && activeDirection === 'last'" small variant="light" />
        <span v-else>{{ $t('pagination.last') }}</span>
      </b-button>
    </b-button-group>
    <span class="pagination-info">{{ totalPages ? `Page ${page} of ${totalPages}` : `Page ${page}` }}</span>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pagination: {
      type: Object,
      default: () => ({})
    },
    placement: {
      type: String,
      default: "bottom"
    },
    itemCount: {
      type: Number,
      default: null
    },
    pageSize: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      page: 1,
      isLoading: false,
      activeDirection: null,
      maxPageSize: null
    };
  },
  computed: {
    totalPages() {
      if (this.itemCount && this.maxPageSize) {
        return Math.ceil(this.itemCount / this.maxPageSize);
      }
      return null;
    }
  },
  watch: {
    pagination() {
      this.isLoading = false;
      this.activeDirection = null;
    },
    pageSize(val) {
      if (val && (this.maxPageSize === null || val > this.maxPageSize)) {
        this.maxPageSize = val;
      }
    }
  },
  created() {
    if (this.pageSize) this.maxPageSize = this.pageSize;
  },
  methods: {
    go(link, newPage, direction) {
      this.page = newPage;
      this.isLoading = true;
      this.activeDirection = direction;
      this.$emit('paginate', link, this.placement);
    }
  }
};
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pagination-info {
  font-size: 0.85rem;
  color: #6c757d;
}
</style>
