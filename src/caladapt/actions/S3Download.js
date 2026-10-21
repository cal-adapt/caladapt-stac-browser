import AssetActionPlugin from '../../actions/AssetActionPlugin';
import BIconDownload from '~icons/bi/download';
import { s3ToHttps } from '../s3';

// Downloads public s3:// files over HTTPS
export default class S3Download extends AssetActionPlugin {

  get show() {
    if (this.component.protocol !== 's3') {return false;}
    const href = this.asset?.href || '';
    const mediaType = this.asset?.type || '';
    // Zarr stores and folder prefixes aren't single files
    return !(href.endsWith('/') || href.endsWith('.zarr') || mediaType.includes('zarr'));
  }

  get filename() {
    return this.component.href?.split('/').pop() || 'download';
  }

  get onClick() {
    return async (event) => {
      const btn = event?.currentTarget;
      const originalHTML = btn?.innerHTML;
      const flash = (variant, html) => {
        if (!btn) {return;}
        btn.disabled = false;
        btn.classList.replace('btn-primary', `btn-${variant}`);
        if (html) {btn.innerHTML = html;}
        setTimeout(() => {
          btn.classList.replace(`btn-${variant}`, 'btn-primary');
          btn.innerHTML = originalHTML;
        }, 5000);
      };
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Downloading...';
      }
      try {
        // Cross-origin links ignore the download attribute, so fetch the file and save it locally
        const resp = await fetch(s3ToHttps(this.component.href));
        if (!resp.ok) {throw new Error(`HTTP ${resp.status}`);}
        const blobUrl = URL.createObjectURL(await resp.blob());
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = this.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        flash('success', '✓ Downloaded');
      } catch (e) {
        console.error('Download failed', e);
        flash('danger');
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
