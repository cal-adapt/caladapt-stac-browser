import AssetActionPlugin from "../AssetActionPlugin";
import Vue from 'vue';
import CSVPreviewModal from '../../components/CSVPreviewModal.vue';

export default class CSVPreview extends AssetActionPlugin {

  get show() {
    return this.asset?.type === 'text/csv';
  }

  get fetchUrl() {
    const href = this.component.href;
    if (!href) return null;
    if (href.startsWith('s3://')) {
      const withoutScheme = href.replace(/^s3:\/\//, '');
      const slashIndex = withoutScheme.indexOf('/');
      const bucket = withoutScheme.slice(0, slashIndex);
      const key = withoutScheme.slice(slashIndex);
      return `https://${bucket}.s3.amazonaws.com${key}`;
    }
    return href;
  }

  get text() {
    return 'Preview';
  }

  get onClick() {
    return () => {
      const url = this.fetchUrl;
      if (!url) return;
      const title = this.asset?.title || 'CSV Preview';
      const ModalClass = Vue.extend(CSVPreviewModal);
      const instance = new ModalClass({
        parent: this.component,
        propsData: { url, title },
      });
      instance.$mount();
      document.body.appendChild(instance.$el);
    };
  }

}
