import AssetActionPlugin from '../../actions/AssetActionPlugin';
import BIconDownload from '~icons/bi/download';
import { s3ToHttps } from '../s3';

// Download link for public s3:// files, which browsers can't open directly.
// The bucket serves them over HTTPS with types browsers download (CSV, NetCDF).
export default class S3Download extends AssetActionPlugin {

  get show() {
    if (this.component.protocol !== 's3') {
      return false;
    }
    const href = this.asset?.href || '';
    const mediaType = this.asset?.type || '';
    // Zarr stores and folder prefixes aren't single files
    return !(href.endsWith('/') || href.endsWith('.zarr') || mediaType.includes('zarr'));
  }

  get uri() {
    return s3ToHttps(this.component.href);
  }

  get text() {
    return 'Download';
  }

  get icon() {
    return BIconDownload;
  }

}
