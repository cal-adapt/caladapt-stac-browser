<template>
  <section class="catalogs mb-4">
    <header>
      <h2 class="title mr-2">{{ title }}</h2>
      <b-badge v-if="catalogCount !== null" pill variant="secondary" class="mr-4">{{ catalogCount }}</b-badge>
    </header>
    <div v-if="!hideControls" class="catalog-view-controls mb-2">
      <ViewButtons class="mr-2" v-model="view" />
      <SortButtons v-if="catalogs.length > 1" v-model="sort" />
    </div>
    <section v-if="!hideControls && catalogs.length > 1" class="catalog-filter mb-2">
      <SearchBox v-model="searchTerm" :placeholder="filterPlaceholder" />
      <multiselect
        v-if="allKeywords.length > 0" v-model="selectedKeywords" multiple :options="allKeywords"
        :placeholder="$t('multiselect.keywordsPlaceholder')"
        :selectLabel="$t('multiselect.selectLabel')"
        :selectedLabel="$t('multiselect.selectedLabel')"
        :deselectLabel="$t('multiselect.deselectLabel')"
        :limitText="limitText"
      />
      <ResetButton @click="selectedKeywords = []" />
    </section>
    <Pagination v-if="showPagination" ref="topPagination" class="mb-3" :pagination="pagination" placement="top" @paginate="paginate" />
    <b-alert v-if="hasSearchCritera && catalogView.length === 0" variant="warning" class="mt-2" show>{{ $t('catalogs.noMatches') }}</b-alert>
    <section class="list">
      <Loading v-if="loading" fill top />
      <div v-if="catalogView.length > 0" :class="cardsContainerClass">
        <Catalog v-for="catalog in catalogView" :catalog="catalog" :key="catalog.href" :selectedKeywords="selectedKeywords" @keyword-click="toggleKeyword">
          <template #footer="{data}">
            <slot name="catalogFooter" :data="data" />
          </template>
        </Catalog>
      </div>
    </section>
    <Pagination v-if="showPagination" class="mb-3" :pagination="pagination" @paginate="paginate" />
    <b-button v-else-if="hasMore" @click="loadMore" variant="primary" v-b-visible.300="loadMore">{{ $t('catalogs.loadMore') }}</b-button>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Catalog from './Catalog.vue';
import Loading from './Loading.vue';
import { getDisplayTitle } from '../models/stac';
import { STAC } from 'stac-js';
import ViewButtons from './ViewButtons.vue';
import Utils from '../utils';

export default {
  name: "Catalogs",
  components: {
    Catalog,
    Loading,
    Pagination: () => import('./Pagination.vue'),
    ResetButton: () => import('./ResetButton.vue'),
    SearchBox: () => import('./SearchBox.vue'),
    SortButtons: () => import('./SortButtons.vue'),
    Multiselect: () => import('vue-multiselect'),
    ViewButtons
  },
  props: {
    catalogs: {
      type: Array,
      required: true
    },
    collectionsOnly: {
      type: Boolean,
      required: false
    },
    enforceCards: {
      type: Boolean,
      default: false
    },
    hideControls: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    apiFilters: {
      type: Object,
      default: () => ({})
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    count: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      searchTerm: '',
      sort: 0,
      selectedKeywords: []
    };
  },
  computed: {
    ...mapState(['cardViewSort', 'collectionOrder', 'uiLanguage']),
    ...mapGetters(['getStac']),
    catalogCount() {
      if (this.catalogs.length !== this.catalogView.length) {
        return this.catalogView.length + '/' + this.catalogs.length;
      }
      else if (this.count !== null) {
        return this.count;
      }
      return this.catalogs.length || null;
    },
    title() {
      if (this.collectionsOnly) {
        return this.$tc('stacCollection', this.catalogs.length );
      }
      else {
        return this.$tc('stacCatalog', this.catalogs.length );
      }
    },
    isComplete() {
      return !this.hasMore && !this.showPagination;
    },
    filterPlaceholder() {
      return this.$t('catalogs.filterByTitleAndMore');
    },
    showPagination() {
      // Check whether any pagination links are available
      return Object.values(this.pagination).some(link => !!link);
    },
    allCatalogs() {
      return this.catalogs.map(catalog => {
          let stac = this.getStac(catalog);
          return stac ? stac : catalog;
      });
    },
    hasSearchCritera() {
      return this.searchTerm || this.selectedKeywords.length > 0;
    },
    catalogView() {
      let catalogs = this.allCatalogs;
      // Keyword filtering applies even when more catalogs are loading
      if (this.selectedKeywords.length > 0) {
        catalogs = catalogs.filter(catalog => {
          if (catalog instanceof STAC && Array.isArray(catalog.keywords)) {
            return this.selectedKeywords.every(keyword => catalog.keywords.includes(keyword));
          }
          return false;
        });
      }
      if (!this.apiFilters.sortby && this.sort !== 0) {
        const collator = new Intl.Collator(this.uiLanguage);
        catalogs = catalogs.slice(0).sort((a,b) => collator.compare(getDisplayTitle(a), getDisplayTitle(b)));
        if (this.sort === -1) {
          catalogs = catalogs.reverse();
        }
      } else if (!this.apiFilters.sortby && Array.isArray(this.collectionOrder) && this.collectionOrder.length > 0) {
        const collator = new Intl.Collator(this.uiLanguage);
        const getId = (c) => {
          if (c.id) return c.id;
          // fall back to last path segment of href for unloaded link objects
          const href = c.href || c.getAbsoluteUrl?.() || '';
          const parts = href.split('/').filter(Boolean);
          return parts[parts.length - 1] || href;
        };
        catalogs = catalogs.slice(0).sort((a, b) => {
          const ai = this.collectionOrder.indexOf(getId(a));
          const bi = this.collectionOrder.indexOf(getId(b));
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return collator.compare(getDisplayTitle(a), getDisplayTitle(b));
        });
      }
      if (this.hasMore) {
        return catalogs;
      }
      // Text search only applies when all catalogs are loaded
      if (this.searchTerm) {
        catalogs = catalogs.filter(catalog => {
          let haystack = [ catalog.title ];
          if (catalog instanceof STAC && this.isComplete) {
            haystack.push(catalog.id);
            if (catalog.description) {
              haystack.push(catalog.description);
            }
            if (Array.isArray(catalog.keywords)) {
              haystack = haystack.concat(catalog.keywords);
            }
          }
          return Utils.search(this.searchTerm, haystack);
        });
      }
      return catalogs;
    },
    allKeywords() {
      let keywords = [];
      for(let catalog of this.allCatalogs) {
        if (catalog instanceof STAC && Array.isArray(catalog.keywords)) {
          for(let keyword of catalog.keywords) {
            if (!keywords.includes(keyword)) {
              keywords.push(keyword);
            }
          }
        }
      }
      return keywords.sort();
    },
    cardsContainerClass() {
      return this.view === 'list' ? 'card-list' : 'card-grid';
    },
    view: {
      get() {
        if (this.enforceCards) {
          return 'cards';
        }
        return this.$store.state.cardViewMode;
      },
      async set(cardViewMode) {
        if (this.enforceCards) {
          return;
        }
        await this.$store.dispatch('config', { cardViewMode });
      }
    }
  },
  created() {
    this.sort = Utils.convertHumanizedSortOrder(this.cardViewSort);
  },
  methods: {
    loadMore(visible = true) {
      if (visible) {
        this.$emit('loadMore');
      }
    },
    paginate(link, placement) {
      if (placement === 'bottom' && this.$refs.topPagination) {
        Utils.scrollTo(this.$refs.topPagination.$el);
      }
      this.$emit('paginate', link);
    },
    limitText(count) {
      return this.$t("multiselect.andMore", {count});
    },
    toggleKeyword(keyword) {
      const idx = this.selectedKeywords.indexOf(keyword);
      if (idx === -1) {
        this.selectedKeywords.push(keyword);
      } else {
        this.selectedKeywords.splice(idx, 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.catalog-filter {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  gap: 1rem;
  align-items: stretch;

  > * {
    flex-grow: 1;
    flex-basis: 300px;
    min-width: 300px;
  }

  > .btn {
    flex: none;
    min-width: auto;
    align-self: center;
  }
}
</style>
