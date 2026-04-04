import AssetActionPlugin from "../AssetActionPlugin";
import { BIconDownload } from 'bootstrap-vue';

export default class S3Download extends AssetActionPlugin {

  get show() {
    if (this.component.protocol !== 's3') return false;
    const href = this.asset?.href || '';
    const mediaType = this.asset?.type || '';
    if (href.endsWith('.zarr') || mediaType.includes('zarr')) return false;
    return true;
  }

  get httpsUrl() {
    const href = this.component.href;
    if (!href) return null;
    const withoutScheme = href.replace(/^s3:\/\//, '');
    const slashIndex = withoutScheme.indexOf('/');
    const bucket = withoutScheme.slice(0, slashIndex);
    const key = withoutScheme.slice(slashIndex);
    return `https://${bucket}.s3.amazonaws.com${key}`;
  }

  get filename() {
    const href = this.component.href;
    if (!href) return 'download';
    return href.split('/').pop();
  }

  get btnOptions() {
    return {};
  }

  get onClick() {
    return async (event) => {
      const btn = event?.currentTarget;
      const originalHTML = btn ? btn.innerHTML : null;
      const url = this.httpsUrl;
      if (!url) return;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> Downloading...';
      }
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = this.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-success');
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="mr-1"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> Downloaded';
          setTimeout(() => {
            btn.classList.remove('btn-success');
            btn.classList.add('btn-primary');
            btn.innerHTML = originalHTML;
          }, 5000);
        }
      } catch (e) {
        console.error('Download failed', e);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-danger');
          setTimeout(() => {
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-primary');
          }, 5000);
        }
      }
    };
  }

  get text() {
    return 'Download';
  }

  get icon() {
    return BIconDownload;
  }

}
