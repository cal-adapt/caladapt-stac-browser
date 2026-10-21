import { createVNode, render } from 'vue';
import AssetActionPlugin from '../../actions/AssetActionPlugin';
import BIconTable from '~icons/bi/table';
import CSVPreviewModal from '../CSVPreviewModal.vue';
import { s3ToHttps } from '../s3';

export default class CSVPreview extends AssetActionPlugin {

  get show() {
    // Some CSV assets point at a folder of files, which can't be previewed
    return this.asset?.type === 'text/csv' && !this.asset.href?.endsWith('/');
  }

  get text() {
    return 'Preview';
  }

  get icon() {
    return BIconTable;
  }

  get onClick() {
    return () => {
      const url = s3ToHttps(this.component.href);
      if (!url) {return;}
      // Render the modal outside the page, with the app's context so Bootstrap and i18n work
      const container = document.createElement('div');
      document.body.appendChild(container);
      const vnode = createVNode(CSVPreviewModal, {
        url,
        title: this.asset?.title || 'CSV Preview',
        onClosed: () => {
          render(null, container);
          container.remove();
        }
      });
      vnode.appContext = this.component.$.appContext;
      render(vnode, container);
    };
  }

}
