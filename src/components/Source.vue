<template>
  <div>
    <b-popover
      v-if="stacUrl" id="popover-link" custom-class="popover-large" target="popover-link-btn"
      triggers="click" placement="bottom" container="stac-browser" :title="$t('source.title')"
    >
      <template v-if="stac">
        <b-row v-if="stacId" class="stac-id">
          <b-col cols="4">{{ $t('source.id') }}</b-col>
          <b-col>
            <code>{{ stacId }}</code>
            <CopyButton :copyText="stacId" :button-props="{size: 'sm'}" variant="primary" class="ml-2" />
          </b-col>
        </b-row>
        <b-row v-if="stacVersion" class="stac-version">
          <b-col cols="4">{{ $t('source.stacVersion') }}</b-col>
          <b-col>{{ stacVersion }}</b-col>
        </b-row>
        <b-row class="stac-valid">
          <b-col cols="4">{{ $t('source.valid') }}</b-col>
          <b-col>
            <Validation :data="stac" />
          </b-col>
        </b-row>
        <hr>
      </template>
      <Url id="stacUrl" :url="stacUrl" :label="$t('source.locatedAt')" />
    </b-popover>

  </div>
</template>

<script>
import { BPopover } from 'bootstrap-vue';
import { mapState } from 'vuex';

import Url from './Url.vue';

import CopyButton from './CopyButton.vue';

export default {
  name: "Source",
  components: {
    BPopover,
    Url,
    CopyButton,
    Validation: () => import('./Validation.vue')
  },
  props: {
    title: {
      type: String,
      required: true
    },
    stacUrl: {
      type: String,
      default: null
    },
    stac: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(['valid']),
    stacVersion() {
      return this.stac?.stac_version;
    },
    stacId() {
      return this.stac?.id;
    }
  }
};
</script>

<style lang="scss">
#popover-link .stac-id .btn-sm,
#popover-link .stac-valid .btn-sm {
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    font-size: 0.7rem;
}
</style>
