import{bU as R,bV as S}from"./util-Dr-LyMkp.js";import{D as E,W as v,a as m,b as P,S as O,e as I,U as l,A as p,n as C,g,u as N}from"./compileUtil-CL-7fZsy.js";import A from"./BaseTile-CUJICHMe.js";import"./utils-CzN9cXHb.js";import"./_commonjsHelpers-CE1G-McA.js";import"./GeoJSON-2WdO3oDl.js";import"./index-PZBvbXfz.js";import"./I18N-V5BLuC1D.js";import"./BFormRadioGroup.vue_vue_type_script_setup_true_lang-DaMHx4U3-B-Y57Hkv.js";import"./useStateClass-BGbSLWFN-BizT0HTC.js";import"./ConditionalWrapper.vue_vue_type_script_lang-IX_NpHH--CMV9zsgv.js";import"./mat4-CZmcDzWz.js";import"./DataTile-CSDndwBr.js";import"./Tile-CTe1tK2F.js";import"./Tile-Ba94wnsZ.js";import"./common-C273WnQO.js";import"./TileRange-2Tc-Ry00.js";import"./LRUCache-Czyi2QrU.js";import"./tilecoord-CZpavVoc.js";import"./TileProperty-BF4LcWSy.js";const e={TEXTURE:"u_texture",VELOCITY_TEXTURE:"u_velocityTexture",POSITION_TEXTURE:"u_positionTexture",PARTICLE_COUNT_SQRT:"u_particleCountSqrt",MAX_SPEED:"u_maxSpeed",RANDOM_SEED:"u_randomSeed",SPEED_FACTOR:"u_speedFactor",DROP_RATE:"u_dropRate",DROP_RATE_BUMP:"u_dropRateBump",OPACITY:"u_opacity",ROTATION:E.ROTATION,VIEWPORT_SIZE_PX:E.VIEWPORT_SIZE_PX},u={POSITION:"a_position",INDEX:"a_index"},c={POSITION:"v_position"};class $ extends v{constructor(r,t){super(r,{vertexShader:t.tileVertexShader,fragmentShader:t.tileFragmentShader,cacheSize:t.cacheSize,postProcesses:[{}],uniforms:{[e.MAX_SPEED]:t.maxSpeed}}),this.particleColorFragmentShader_=t.particleColorFragmentShader,this.velocityTexture_=null,this.particleCountSqrt_=t.particles?Math.ceil(Math.sqrt(t.particles)):256,this.particleIndexBuffer_,this.quadBuffer_,this.particlePositionProgram_,this.particlePositionVertexShader_=t.particlePositionVertexShader,this.particlePositionFragmentShader_=t.particlePositionFragmentShader,this.previousPositionTexture_,this.nextPositionTexture_,this.particleColorProgram_,this.particleColorVertexShader_=t.particleColorVertexShader,this.particleColorFragmentShader_=t.particleColorFragmentShader,this.textureProgram_,this.textureVertexShader_=t.textureVertexShader,this.textureFragmentShader_=t.textureFragmentShader,this.previousTrailsTexture_,this.nextTrailsTexture_,this.fadeOpacity_=.996,this.maxSpeed_=t.maxSpeed,this.speedFactor_=t.speedFactor||.001,this.dropRate_=.003,this.dropRateBump_=.01,this.tempVec2_=[0,0],this.renderedWidth_=0,this.renderedHeight_=0}afterHelperCreated(){super.afterHelperCreated();const r=this.helper,t=r.getGL();this.framebuffer_=t.createFramebuffer();const i=this.particleCountSqrt_*this.particleCountSqrt_,a=new Float32Array(i);for(let T=0;T<i;++T)a[T]=T;const s=new m(P,O);s.setArray(a),r.flushBufferData(s),this.particleIndexBuffer_=s;const n=new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),o=new m(P,O);o.setArray(n),r.flushBufferData(o),this.quadBuffer_=o;const _=new Uint8Array(i*4);for(let T=0;T<_.length;++T)_[T]=Math.floor(Math.random()*256);this.previousPositionTexture_=r.createTexture([this.particleCountSqrt_,this.particleCountSqrt_],_,void 0,!0),this.nextPositionTexture_=r.createTexture([this.particleCountSqrt_,this.particleCountSqrt_],_,void 0,!0),this.particlePositionProgram_=r.getProgram(this.particlePositionFragmentShader_,this.particlePositionVertexShader_),this.particleColorProgram_=r.getProgram(this.particleColorFragmentShader_,this.particleColorVertexShader_),this.textureProgram_=r.getProgram(this.textureFragmentShader_,this.textureVertexShader_)}createSizeDependentTextures_(){const r=this.helper,t=r.getGL(),i=r.getCanvas(),a=i.width,s=i.height,n=new Uint8Array(a*s*4);this.nextTrailsTexture_&&t.deleteTexture(this.nextTrailsTexture_),this.nextTrailsTexture_=r.createTexture([a,s],n,void 0,!0),this.previousTrailsTexture_&&t.deleteTexture(this.previousTrailsTexture_),this.previousTrailsTexture_=r.createTexture([a,s],n,void 0,!0)}beforeFinalize(r){const t=this.helper,i=t.getGL(),a=t.getCanvas(),s=a.width,n=a.height;(this.renderedWidth_!=s||this.renderedHeight_!=n)&&this.createSizeDependentTextures_();const o=[s,n];this.velocityTexture_=t.createTexture(o,null,this.velocityTexture_??void 0),i.copyTexImage2D(i.TEXTURE_2D,0,i.RGBA,0,0,s,n,0),this.drawParticleTrails_(r),this.updateParticlePositions_(r),r.animate=!0,this.renderedWidth_=s,this.renderedHeight_=n}drawParticleTrails_(r){const t=this.helper,i=t.getGL();t.bindFrameBuffer(this.framebuffer_??null,this.nextTrailsTexture_??null),this.drawTexture_(this.previousTrailsTexture_??void 0,this.fadeOpacity_),this.drawParticleColor_(r),t.bindInitialFrameBuffer(),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),this.drawTexture_(this.nextTrailsTexture_??void 0,1),i.disable(i.BLEND);const a=this.nextTrailsTexture_;this.nextTrailsTexture_=this.previousTrailsTexture_,this.previousTrailsTexture_=a}drawTexture_(r,t){if(!r)return;const i=this.helper,a=i.getGL();i.useProgram(this.textureProgram_),i.bindTexture(r,0,e.TEXTURE),i.bindAttribute(this.quadBuffer_,u.POSITION,2),this.helper.setUniformFloatValue(e.OPACITY,t),a.drawArrays(a.TRIANGLES,0,6)}drawParticleColor_(r){const t=this.helper,i=t.getGL();t.useProgram(this.particleColorProgram_);const a=this.particleCountSqrt_*this.particleCountSqrt_;t.bindAttribute(this.particleIndexBuffer_,u.INDEX,1);const s=this.previousPositionTexture_;s&&t.bindTexture(s,0,e.POSITION_TEXTURE);const n=this.velocityTexture_;n&&t.bindTexture(n,1,e.VELOCITY_TEXTURE),this.helper.setUniformFloatValue(e.PARTICLE_COUNT_SQRT,this.particleCountSqrt_);const o=this.tempVec2_;o[0]=Math.cos(-r.viewState.rotation),o[1]=Math.sin(-r.viewState.rotation),this.helper.setUniformFloatVec2(e.ROTATION,o),this.helper.setUniformFloatValue(e.MAX_SPEED,this.maxSpeed_),i.drawArrays(i.POINTS,0,a)}updateParticlePositions_(r){const t=this.helper,i=t.getGL();t.useProgram(this.particlePositionProgram_),i.viewport(0,0,this.particleCountSqrt_,this.particleCountSqrt_),t.bindFrameBuffer(this.framebuffer_??null,this.nextPositionTexture_??null);const a=this.previousPositionTexture_;a&&t.bindTexture(a,0,e.POSITION_TEXTURE);const s=this.velocityTexture_;s&&t.bindTexture(s,1,e.VELOCITY_TEXTURE),t.bindAttribute(this.quadBuffer_,u.POSITION,2),t.setUniformFloatValue(e.RANDOM_SEED,Math.random()),t.setUniformFloatValue(e.SPEED_FACTOR,this.speedFactor_),t.setUniformFloatValue(e.DROP_RATE,this.dropRate_),t.setUniformFloatValue(e.DROP_RATE_BUMP,this.dropRateBump_);const n=this.tempVec2_;n[0]=Math.cos(-r.viewState.rotation),n[1]=Math.sin(-r.viewState.rotation),this.helper.setUniformFloatVec2(e.ROTATION,n);const o=r.size;this.helper.setUniformFloatVec2(e.VIEWPORT_SIZE_PX,[o[0],o[1]]),i.drawArrays(i.TRIANGLES,0,6);const _=this.nextPositionTexture_;this.nextPositionTexture_=this.previousPositionTexture_,this.previousPositionTexture_=_}}const y=`
  attribute vec2 ${p.TEXTURE_COORD};
  uniform mat4 ${l.TILE_TRANSFORM};
  uniform float ${l.TEXTURE_PIXEL_WIDTH};
  uniform float ${l.TEXTURE_PIXEL_HEIGHT};
  uniform float ${l.TEXTURE_RESOLUTION};
  uniform float ${l.DEPTH};

  varying vec2 v_textureCoord;
  varying vec2 v_localMapCoord;

  void main() {
    v_textureCoord = ${p.TEXTURE_COORD};
    v_localMapCoord = vec2(
      ${l.TEXTURE_RESOLUTION} * ${l.TEXTURE_PIXEL_WIDTH} * v_textureCoord[0],
      -1. * ${l.TEXTURE_RESOLUTION} * ${l.TEXTURE_PIXEL_HEIGHT} * v_textureCoord[1]
    );
    gl_Position = ${l.TILE_TRANSFORM} * vec4(${p.TEXTURE_COORD}, ${l.DEPTH}, 1.0);
  }
`,D=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform vec4 ${l.RENDER_EXTENT};
  uniform float ${e.MAX_SPEED};
  uniform sampler2D ${l.TILE_TEXTURE_ARRAY}[1];

  varying vec2 v_textureCoord;
  varying vec2 v_localMapCoord;

  void main() {
    if (
      v_localMapCoord[0] < ${l.RENDER_EXTENT}[0] ||
      v_localMapCoord[1] < ${l.RENDER_EXTENT}[1] ||
      v_localMapCoord[0] > ${l.RENDER_EXTENT}[2] ||
      v_localMapCoord[1] > ${l.RENDER_EXTENT}[3]
    ) {
      discard;
    }

    vec4 velocity = texture2D(${l.TILE_TEXTURE_ARRAY}[0],  v_textureCoord);
    gl_FragColor = vec4((velocity.xy + ${e.MAX_SPEED}) / (2.0 * ${e.MAX_SPEED}), 0, 1);
  }
`,x=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  attribute vec2 ${u.POSITION};

  varying vec2 ${c.POSITION};

  void main() {
    ${c.POSITION} = ${u.POSITION};
    gl_Position = vec4(1.0 - 2.0 * ${u.POSITION}, 0, 1);
  }
`,U=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform sampler2D ${e.TEXTURE};
  uniform float ${e.OPACITY};

  varying vec2 ${c.POSITION};

  void main() {
    vec4 color = texture2D(${e.TEXTURE}, 1.0 - ${c.POSITION});
    gl_FragColor = vec4(floor(255.0 * color * ${e.OPACITY}) / 255.0);
  }
`,F=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform sampler2D ${e.POSITION_TEXTURE};
  uniform sampler2D ${e.VELOCITY_TEXTURE};
  uniform float ${e.RANDOM_SEED};
  uniform float ${e.SPEED_FACTOR};
  uniform float ${e.DROP_RATE};
  uniform float ${e.DROP_RATE_BUMP};
  uniform vec2 ${e.ROTATION};
  uniform vec2 ${e.VIEWPORT_SIZE_PX};

  varying vec2 ${c.POSITION};

  // pseudo-random generator
  const vec3 randConstants = vec3(12.9898, 78.233, 4375.85453);

  float rand(const vec2 co) {
    float t = dot(randConstants.xy, co);
    return fract(sin(t) * (randConstants.z + t));
  }

  void main() {
    vec4 positionColor = texture2D(${e.POSITION_TEXTURE}, ${c.POSITION});

    // decode particle position from pixel RGBA
    vec2 particlePosition = vec2(
      positionColor.r / 255.0 + positionColor.b,
      positionColor.g / 255.0 + positionColor.a
    );

    vec4 velocityColor = texture2D(${e.VELOCITY_TEXTURE}, particlePosition);
    if (velocityColor.a == 0.0) {
      discard;
    }

    float vx = 2.0 * velocityColor.r - 1.0;
    float vy = 2.0 * velocityColor.g - 1.0;

    // normalized veloicty (magnitude 0 - 1)
    vec2 velocity = vec2(
      vx * ${e.ROTATION}.x - vy * ${e.ROTATION}.y,
      vx * ${e.ROTATION}.y + vy * ${e.ROTATION}.x
    );

    // account for aspect ratio (square particle position texture, non-square map)
    float aspectRatio = ${e.VIEWPORT_SIZE_PX}.x / ${e.VIEWPORT_SIZE_PX}.y;
    vec2 offset = vec2(velocity.x / aspectRatio, velocity.y) * ${e.SPEED_FACTOR};

    // update particle position, wrapping around the edge
    particlePosition = fract(1.0 + particlePosition + offset);

    // a random seed to use for the particle drop
    vec2 seed = (particlePosition + ${c.POSITION}) * ${e.RANDOM_SEED};

    // drop rate is a chance a particle will restart at random position, to avoid degeneration
    float dropRate = ${e.DROP_RATE} + length(velocity) * ${e.DROP_RATE_BUMP};
    float drop = step(1.0 - dropRate, rand(seed));

    vec2 randomPosition = vec2(rand(seed + 1.3), rand(seed + 2.1));
    particlePosition = mix(particlePosition, randomPosition, drop);

    // encode the new particle position back into RGBA
    gl_FragColor = vec4(
      fract(particlePosition * 255.0),
      floor(particlePosition * 255.0) / 255.0
    );
  }
`,X=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  attribute float ${u.INDEX};

  uniform sampler2D ${e.POSITION_TEXTURE};
  uniform float ${e.PARTICLE_COUNT_SQRT};

  varying vec2 ${c.POSITION};

  void main() {
    vec4 color = texture2D(
      ${e.POSITION_TEXTURE},
      vec2(
        fract(${u.INDEX} / ${e.PARTICLE_COUNT_SQRT}),
        floor(${u.INDEX} / ${e.PARTICLE_COUNT_SQRT}) / ${e.PARTICLE_COUNT_SQRT}
      )
    );

    ${c.POSITION} = vec2(
      color.r / 255.0 + color.b,
      color.g / 255.0 + color.a
    );

    gl_PointSize = 1.0;
    gl_Position = vec4(
      2.0 * ${c.POSITION}.x - 1.0,
      2.0 * ${c.POSITION}.y - 1.0,
      0,
      1
    );
  }
`;function b(d){const r=C(),t=[];if(d.color!==void 0){const o=I(r,d.color,S);t.push(`color = ${o};`)}if(r.variables.size>1&&!d.variables)throw new Error(`Missing variables in style (expected ${Array.from(r.variables.keys())})`);const i={};for(const[o]of r.variables.entries()){const _=d.variables||{};if(!(o in _))throw new Error(`Missing '${o}' in style variables`);const T=N(o);i[T]=function(){let h=_[o];return typeof h=="string"&&(h=g(h)),h!==void 0?h:-9999999}}const a=Object.keys(i).map(function(o){return`uniform float ${o};`}),s=Object.keys(r.functions).map(function(o){return r.functions[o]}),n=`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform sampler2D ${e.VELOCITY_TEXTURE};
    uniform float ${e.MAX_SPEED};
    uniform vec2 ${e.ROTATION};

    ${a.join(`
`)}

    varying vec2 ${c.POSITION};
    
    ${s.join(`
`)}

    void main() {
      vec4 velocityColor = texture2D(${e.VELOCITY_TEXTURE}, ${c.POSITION});

      float vx = mix(-${e.MAX_SPEED}, ${e.MAX_SPEED}, velocityColor.r);
      float vy = mix(-${e.MAX_SPEED}, ${e.MAX_SPEED}, velocityColor.g);

      vec2 velocity = vec2(
        vx * ${e.ROTATION}.x - vy * ${e.ROTATION}.y,
        vx * ${e.ROTATION}.y + vy * ${e.ROTATION}.x
      );

      float a_prop_speed = length(velocity);

      vec4 color;

      ${t.join(`
`)}

      if (color.a == 0.0) {
        discard;
      }

      gl_FragColor = color;
    }
  `;return{tileVertexShader:y,tileFragmentShader:D,particleColorVertexShader:X,particleColorFragmentShader:n,particlePositionVertexShader:x,particlePositionFragmentShader:F,textureVertexShader:x,textureFragmentShader:U}}const f=[];class L extends A{constructor(r){const t=Object.assign({},r);if(delete t.maxSpeed,delete t.speedFactor,delete t.particles,super(t),this.style_=r.style||{},!(r.maxSpeed>0))throw new Error("maxSpeed is required");this.maxSpeed_=r.maxSpeed,this.speedFactor_=r.speedFactor??.001,this.particles_=r.particles??65536,this.styleVariables_=this.style_.variables||{},this.addChangeListener(R.SOURCE,this.handleSourceUpdate_)}handleSourceUpdate_(){const r=this.getRenderer();r&&r.clearCache()}updateStyleVariables(r){Object.assign(this.styleVariables_,r),this.changed()}getSources(r,t){const i=this.getSource();return f.length=0,i&&f.push(i),f}createRenderer(){const r=b(this.style_);return new $(this,{...r,cacheSize:this.getCacheSize(),maxSpeed:this.maxSpeed_,speedFactor:this.speedFactor_,particles:this.particles_})}}L.prototype.dispose;export{L as default};
//# sourceMappingURL=Flow-BS-yYQ7p.js.map
