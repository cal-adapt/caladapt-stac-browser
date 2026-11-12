import{bU as b,bt as $,bV as x,bW as _}from"./util-Dr-LyMkp.js";import{W as C,e as g,U as r,P as y,A as R,n as I,u as N,g as L}from"./compileUtil-BJVmhNBA.js";import X from"./BaseTile-CUJICHMe.js";import"./utils-CzN9cXHb.js";import"./_commonjsHelpers-CE1G-McA.js";import"./GeoJSON-hq6llHEF.js";import"./index-mXMToEzd.js";import"./I18N-V5BLuC1D.js";import"./BFormRadioGroup.vue_vue_type_script_setup_true_lang-DaMHx4U3-DZXBF_QT.js";import"./useStateClass-BGbSLWFN-W4O5e4sv.js";import"./ConditionalWrapper.vue_vue_type_script_lang-IX_NpHH--CuTDBZMN.js";import"./mat4-CZmcDzWz.js";import"./DataTile-qccG_R-b.js";import"./Tile-5rAeC7gD.js";import"./Tile-0QH-LIQk.js";import"./common-C273WnQO.js";import"./TileRange-2Tc-Ry00.js";import"./LRUCache-Czyi2QrU.js";import"./tilecoord-CZpavVoc.js";import"./TileProperty-BF4LcWSy.js";function O(a,e,t){const s=`
    attribute vec2 ${R.TEXTURE_COORD};
    uniform mat4 ${r.TILE_TRANSFORM};
    uniform float ${r.TEXTURE_PIXEL_WIDTH};
    uniform float ${r.TEXTURE_PIXEL_HEIGHT};
    uniform float ${r.TEXTURE_RESOLUTION};
    uniform float ${r.DEPTH};

    varying vec2 v_textureCoord;
    varying vec2 v_localMapCoord;

    void main() {
      v_textureCoord = ${R.TEXTURE_COORD};
      v_localMapCoord = vec2(
        ${r.TEXTURE_PIXEL_WIDTH} * ${r.TEXTURE_RESOLUTION} * v_textureCoord[0],
        -1. * ${r.TEXTURE_PIXEL_HEIGHT} * ${r.TEXTURE_RESOLUTION} * v_textureCoord[1]
      );
      gl_Position = ${r.TILE_TRANSFORM} * vec4(${R.TEXTURE_COORD}, ${r.DEPTH}, 1.0);
    }
  `,n={...I(),bandCount:e},i=[];if(a.color!==void 0){const o=g(n,a.color,x);i.push(`color = ${o};`)}if(a.contrast!==void 0){const o=g(n,a.contrast,_);i.push(`color.rgb = clamp((${o} + 1.0) * color.rgb - (${o} / 2.0), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));`)}if(a.exposure!==void 0){const o=g(n,a.exposure,_);i.push(`color.rgb = clamp((${o} + 1.0) * color.rgb, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));`)}if(a.saturation!==void 0){const o=g(n,a.saturation,_);i.push(`
      float saturation = ${o} + 1.0;
      float sr = (1.0 - saturation) * 0.2126;
      float sg = (1.0 - saturation) * 0.7152;
      float sb = (1.0 - saturation) * 0.0722;
      mat3 saturationMatrix = mat3(
        sr + saturation, sr, sr,
        sg, sg + saturation, sg,
        sb, sb, sb + saturation
      );
      color.rgb = clamp(saturationMatrix * color.rgb, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
    `)}if(a.gamma!==void 0){const o=g(n,a.gamma,_);i.push(`color.rgb = pow(color.rgb, vec3(1.0 / ${o}));`)}if(a.brightness!==void 0){const o=g(n,a.brightness,_);i.push(`color.rgb = clamp(color.rgb + ${o}, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));`)}const c={};if(n.variables.size>1&&!a.variables)throw new Error(`Missing variables in style (expected ${Array.from(n.variables.keys())})`);const T=a.variables||{};for(const[o]of n.variables.entries()){if(!(o in T))throw new Error(`Missing '${o}' in style variables`);const l=N(o);c[l]=function(){let f=T[o];return typeof f=="string"&&(f=L(f)),f!==void 0?f:-9999999}}const u=Object.keys(c).map(function(o){return`uniform float ${o};`}),d=e!==void 0?e:4,h=Math.ceil(d/4);if(u.push(`uniform sampler2D ${r.TILE_TEXTURE_ARRAY}[${h}];`),n.paletteTextures&&u.push(`uniform sampler2D ${y}[${n.paletteTextures.length}];`),t&&t>0&&!("getBandValue"in n.functions)){let o="";for(let l=0;l<d;l++){const f=Math.floor(l/4);let v=l%4;l===d-1&&v===1&&(v=3);const S=`${r.TILE_TEXTURE_ARRAY}[${f}]`;o+=`  if (band == ${l+1}.0) {
    return texture2D(${S}, v_textureCoord + vec2(dx, dy))[${v}];
  }
`}n.functions.getBandValue=`float getBandValue(float band, float xOffset, float yOffset) {
  float dx = xOffset / ${r.TEXTURE_PIXEL_WIDTH};
  float dy = yOffset / ${r.TEXTURE_PIXEL_HEIGHT};
${o}
}`}const E=Object.keys(n.functions).map(function(o){return n.functions[o]}),m=`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    varying vec2 v_textureCoord;
    varying vec2 v_localMapCoord;
    uniform vec4 ${r.RENDER_EXTENT};
    uniform float ${r.TRANSITION_ALPHA};
    uniform float ${r.TEXTURE_PIXEL_WIDTH};
    uniform float ${r.TEXTURE_PIXEL_HEIGHT};
    uniform float ${r.RESOLUTION};
    uniform float ${r.ZOOM};

    ${u.join(`
`)}

    ${E.join(`
`)}

    void main() {
      if (
        v_localMapCoord[0] < ${r.RENDER_EXTENT}[0] ||
        v_localMapCoord[1] < ${r.RENDER_EXTENT}[1] ||
        v_localMapCoord[0] > ${r.RENDER_EXTENT}[2] ||
        v_localMapCoord[1] > ${r.RENDER_EXTENT}[3]
      ) {
        discard;
      }

      vec4 color = texture2D(${r.TILE_TEXTURE_ARRAY}[0],  v_textureCoord);

      ${t&&a.color===void 0?`color.a = getBandValue(${t}.0, 0.0, 0.0);`:""}

      ${t?`if (getBandValue(${t}.0, 0.0, 0.0) == 0.0) { discard; }`:""}

      ${i.join(`
`)}

      gl_FragColor = color;
      gl_FragColor.rgb *= gl_FragColor.a;
      gl_FragColor *= ${r.TRANSITION_ALPHA};
    }`;return{vertexShader:s,fragmentShader:m,uniforms:c,paletteTextures:n.paletteTextures||[]}}class U extends X{constructor(e){e=e?Object.assign({},e):{};const t=e.style||{};delete e.style,super(e),this.sources_=e.sources,this.renderedSource_=null,this.renderedResolution_=NaN,this.style_=t,this.styleVariables_=this.style_.variables||{},this.styleBandCount_=NaN,this.styleNodataBandIndex_=void 0,this.handleSourceUpdate_(),this.addChangeListener(b.SOURCE,this.handleSourceUpdate_)}getSources(e,t){const s=this.getSource();return this.sources_?typeof this.sources_=="function"?this.sources_(e,t)||[]:this.sources_:s?[s]:[]}getRenderSource(){return this.renderedSource_||this.getSource()}getSourceState(){const e=this.getRenderSource();return e?e.getState():"undefined"}handleSourceUpdate_(){this.hasRenderer()&&this.getRenderer()?.clearCache();const e=this.getSource();if(e)if(e.getState()==="loading"){const t=()=>{e.getState()==="ready"&&(e.removeEventListener("change",t),this.setStyle(this.style_))};e.addEventListener("change",t)}else this.setStyle(this.style_)}getFirstSource_(){const e=Number.MAX_SAFE_INTEGER,t=this.getSources([-e,-e,e,e],e);return t&&t.length?t[0]:null}usesCoverageBand_(e,t){if(!e||!t||e.hasAlpha!==!1)return!1;const s=e.getProjection();return!!s&&!$(s,t)}getSourceBandCount_(e){const t=this.getFirstSource_(),s=t&&"bandCount"in t?t.bandCount:4;return this.usesCoverageBand_(t,e)?s+1:s}getSourceNodataBandIndex_(e){const t=this.getFirstSource_();if(t)return this.usesCoverageBand_(t,e)?t.bandCount+1:"nodataBandIndex"in t?t.nodataBandIndex:void 0}parseStyleForRender_(e){const t=this.getSourceBandCount_(e),s=this.getSourceNodataBandIndex_(e);return this.styleBandCount_=t,this.styleNodataBandIndex_=s,O(this.style_,t,s)}applyShaders_(e){const t=this.parseStyleForRender_(e);this.getRenderer()?.reset({vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,uniforms:t.uniforms,paletteTextures:t.paletteTextures})}createRenderer(){const e=this.getMapInternal()?.getView()?.getProjection(),t=this.parseStyleForRender_(e);return new C(this,{vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,uniforms:t.uniforms,cacheSize:this.getCacheSize(),paletteTextures:t.paletteTextures})}renderSources(e,t){const s=this.getRenderer();if(!s)return document.createElement("div");let n;for(let i=0,c=t.length;i<c;++i)this.renderedSource_=t[i],s.prepareFrame(e)&&(n=s.renderFrame(e));return n||document.createElement("div")}render(e,t){if(this.rendered=!0,!e)return document.createElement("div");const s=e.viewState,n=e.extent;if(!n)return document.createElement("div");if(this.hasRenderer()){const u=s.projection;(this.getSourceBandCount_(u)!==this.styleBandCount_||this.getSourceNodataBandIndex_(u)!==this.styleNodataBandIndex_)&&this.applyShaders_(u)}const i=this.getSources(n,s.resolution);let c=!0;for(let u=0,d=i.length;u<d;++u){const h=i[u],E=h.getState();if(E=="loading"){const m=()=>{h.getState()=="ready"&&(h.removeEventListener("change",m),this.changed())};h.addEventListener("change",m)}c=c&&E=="ready"}const p=this.renderSources(e,i);if(this.getRenderer()?.renderComplete&&c)return this.renderedResolution_=s.resolution,p;if(this.renderedResolution_>.5*s.resolution){const u=this.getSources(n,this.renderedResolution_).filter(d=>!i.includes(d));if(u.length>0)return this.renderSources(e,u)}return p}setStyle(e){if(this.styleVariables_=e.variables||{},this.style_=e,this.hasRenderer()){const t=this.getMapInternal()?.getView()?.getProjection();this.applyShaders_(t),this.changed()}}updateStyleVariables(e){Object.assign(this.styleVariables_,e),this.changed()}}U.prototype.dispose;export{U as default};
//# sourceMappingURL=WebGLTile-BxZCxOMj.js.map
