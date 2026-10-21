// s3://bucket/key → https://bucket.s3.amazonaws.com/key, so public files open in a browser
export function s3ToHttps(href) {
  const match = typeof href === 'string' && href.match(/^s3:\/\/([^/]+)(\/.*)$/);
  return match ? `https://${match[1]}.s3.amazonaws.com${match[2]}` : href;
}
