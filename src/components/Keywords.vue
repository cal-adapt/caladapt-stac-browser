<template>
  <div class="keywords">
    <b-badge
      v-for="keyword in sortedKeywords"
      :key="keyword"
      :variant="isActive(keyword) ? 'primary' : variant"
      :class="['keyword', { clickable: clickable, active: isActive(keyword) }]"
      @click="clickable ? $emit('keyword-click', keyword) : null"
    >{{ keyword }}</b-badge>
  </div>
</template>

<script>
export default {
  name: 'Keywords',
  props: {
    keywords: {
      type: Array,
      required: true
    },
    variant: {
      type: String,
      default: 'secondary'
    },
    clickable: {
      type: Boolean,
      default: false
    },
    activeKeywords: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sortedKeywords() {
      return [...this.keywords].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }
  },
  methods: {
    isActive(keyword) {
      return this.activeKeywords.includes(keyword);
    }
  }
};
</script>

<style lang="scss" scoped>
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: flex-start;
  align-content: flex-start;
  position: relative;
  z-index: 2;

  .keyword {
    padding: 0.3em 0.4em;

    &.clickable {
      cursor: pointer;
      transition: opacity 0.15s ease, transform 0.1s ease;

      &:hover {
        opacity: 0.8;
        transform: translateY(-1px);
      }

      &.active {
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
