<template>
  <b-button :type="type" variant="danger" class="ml-3" v-on="$listeners">{{ $t('reset') }}</b-button>
</template>

<script>
export default {
  name: 'ResetButton',
  props: {
    type: {
      type: String,
      default: 'button'
    }
  }
};
</script>
