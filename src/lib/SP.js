/* shader-particle-engine 1.0.0
 *
 * (c) 2015 Luke Moody (http://www.github.com/squarefeet)
 *     Originally based on Lee Stemkoski's original work (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
 *
 * shader-particle-engine may be freely distributed under the MIT license (See LICENSE at root of this repository.)
 */
var SPE = {
    distributions: {
        BOX: 1,
        SPHERE: 2,
        DISC: 3
    },
    valueOverLifetimeLength: 4
};
"function" == typeof define && define.amd ? define("spe", SPE) : "undefined" != typeof exports && "undefined" != typeof module && (module.exports = SPE), SPE.TypedArrayHelper = function(a, b, c, d) {
    "use strict";
    this.componentSize = c || 1, this.size = b || 1, this.TypedArrayConstructor = a || Float32Array, this.array = new a(b * this.componentSize), this.indexOffset = d || 0
}, SPE.TypedArrayHelper.constructor = SPE.TypedArrayHelper, SPE.TypedArrayHelper.prototype.setSize = function(a, b) {
    "use strict";
    var c = this.array.length;
    return b || (a *= this.componentSize), c > a ? this.shrink(a) : a > c ? this.grow(a) : void console.info("TypedArray is already of size:", a + ".", "Will not resize.")
}, SPE.TypedArrayHelper.prototype.shrink = function(a) {
    "use strict";
    return this.array = this.array.subarray(0, a), this.size = a, this
}, SPE.TypedArrayHelper.prototype.grow = function(a) {
    "use strict";
    var b = this.array,
        c = new this.TypedArrayConstructor(a);
    return c.set(b), this.array = c, this.size = a, this
}, SPE.TypedArrayHelper.prototype.splice = function(a, b) {
    "use strict";
    a *= this.componentSize, b *= this.componentSize;
    for (var c = [], d = this.array, e = d.length, f = 0; e > f; ++f)(a > f || f >= b) && c.push(d[f]);
    return this.setFromArray(0, c), this
}, SPE.TypedArrayHelper.prototype.setFromArray = function(a, b) {
    "use strict";
    var c = b.length,
        d = a + c;
    return d > this.array.length ? this.grow(d) : d < this.array.length && this.shrink(d), this.array.set(b, this.indexOffset + a), this
}, SPE.TypedArrayHelper.prototype.setVec2 = function(a, b) {
    "use strict";
    return this.setVec2Components(a, b.x, b.y)
}, SPE.TypedArrayHelper.prototype.setVec2Components = function(a, b, c) {
    "use strict";
    var d = this.array,
        e = this.indexOffset + a * this.componentSize;
    return d[e] = b, d[e + 1] = c, this
}, SPE.TypedArrayHelper.prototype.setVec3 = function(a, b) {
    "use strict";
    return this.setVec3Components(a, b.x, b.y, b.z)
}, SPE.TypedArrayHelper.prototype.setVec3Components = function(a, b, c, d) {
    "use strict";
    var e = this.array,
        f = this.indexOffset + a * this.componentSize;
    return e[f] = b, e[f + 1] = c, e[f + 2] = d, this
}, SPE.TypedArrayHelper.prototype.setVec4 = function(a, b) {
    "use strict";
    return this.setVec4Components(a, b.x, b.y, b.z, b.w)
}, SPE.TypedArrayHelper.prototype.setVec4Components = function(a, b, c, d, e) {
    "use strict";
    var f = this.array,
        g = this.indexOffset + a * this.componentSize;
    return f[g] = b, f[g + 1] = c, f[g + 2] = d, f[g + 3] = e, this
}, SPE.TypedArrayHelper.prototype.setMat3 = function(a, b) {
    "use strict";
    return this.setFromArray(this.indexOffset + a * this.componentSize, b.elements)
}, SPE.TypedArrayHelper.prototype.setMat4 = function(a, b) {
    "use strict";
    return this.setFromArray(this.indexOffset + a * this.componentSize, b.elements)
}, SPE.TypedArrayHelper.prototype.setColor = function(a, b) {
    "use strict";
    return this.setVec3Components(a, b.r, b.g, b.b)
}, SPE.TypedArrayHelper.prototype.setNumber = function(a, b) {
    "use strict";
    return this.array[this.indexOffset + a * this.componentSize] = b, this
}, SPE.TypedArrayHelper.prototype.getValueAtIndex = function(a) {
    "use strict";
    return this.array[this.indexOffset + a]
}, SPE.TypedArrayHelper.prototype.getComponentValueAtIndex = function(a) {
    "use strict";
    return this.array.subarray(this.indexOffset + a * this.componentSize);
}, SPE.ShaderAttribute = function(a, b, c) {
    "use strict";
    var d = SPE.ShaderAttribute.typeSizeMap;
    this.type = "string" == typeof a && d.hasOwnProperty(a) ? a : "f", this.componentSize = d[this.type], this.arrayType = c || Float32Array, this.typedArray = null, this.bufferAttribute = null, this.dynamicBuffer = !!b, this.updateMin = 0, this.updateMax = 0
}, SPE.ShaderAttribute.constructor = SPE.ShaderAttribute, SPE.ShaderAttribute.typeSizeMap = {
    f: 1,
    v2: 2,
    v3: 3,
    v4: 4,
    c: 3,
    m3: 9,
    m4: 16
}, SPE.ShaderAttribute.prototype.setUpdateRange = function(a, b) {
    "use strict";
    this.updateMin = Math.min(a * this.componentSize, this.updateMin * this.componentSize), this.updateMax = Math.max(b * this.componentSize, this.updateMax * this.componentSize)
}, SPE.ShaderAttribute.prototype.flagUpdate = function() {
    "use strict";
    var a = this.bufferAttribute,
        b = a.updateRange;
    b.offset = this.updateMin, b.count = Math.min(this.updateMax - this.updateMin + this.componentSize, this.typedArray.array.length), a.needsUpdate = !0
}, SPE.ShaderAttribute.prototype.resetUpdateRange = function() {
    "use strict";
    this.updateMin = 0, this.updateMax = 0;
}, SPE.ShaderAttribute.prototype.resetDynamic = function() {
    "use strict";
    this.bufferAttribute.dynamic = this.dynamicBuffer
}, SPE.ShaderAttribute.prototype.splice = function(a, b) {
    "use strict";
    this.typedArray.splice(a, b), this.forceUpdateAll()
}, SPE.ShaderAttribute.prototype.forceUpdateAll = function() {
    "use strict";
    this.bufferAttribute.array = this.typedArray.array, this.bufferAttribute.updateRange.offset = 0, this.bufferAttribute.updateRange.count = -1, this.bufferAttribute.dynamic = !1, this.bufferAttribute.needsUpdate = !0
}, SPE.ShaderAttribute.prototype._ensureTypedArray = function(a) {
    "use strict";
    (null === this.typedArray || this.typedArray.size !== a * this.componentSize) && (null !== this.typedArray && this.typedArray.size !== a ? this.typedArray.setSize(a) : null === this.typedArray && (this.typedArray = new SPE.TypedArrayHelper(this.arrayType, a, this.componentSize)))
}, SPE.ShaderAttribute.prototype._createBufferAttribute = function(a) {
    "use strict";
    return this._ensureTypedArray(a), null !== this.bufferAttribute ? (this.bufferAttribute.array = this.typedArray.array,
        void(this.bufferAttribute.needsUpdate = !0)) : (this.bufferAttribute = new THREE.BufferAttribute(this.typedArray.array, this.componentSize), void(this.bufferAttribute.dynamic = this.dynamicBuffer))
}, SPE.ShaderAttribute.prototype.getLength = function() {
    "use strict";
    return null === this.typedArray ? 0 : this.typedArray.array.length
}, SPE.shaderChunks = {
    defines: ["#define PACKED_COLOR_SIZE 256.0", "#define PACKED_COLOR_DIVISOR 255.0"].join("\n"),
    uniforms: ["uniform float deltaTime;", "uniform float runTime;", "uniform sampler2D texture;", "uniform vec4 textureAnimation;", "uniform float scale;"].join("\n"),
    attributes: ["attribute vec4 acceleration;", "attribute vec3 velocity;", "attribute vec4 rotation;", "attribute vec3 rotationCenter;", "attribute vec4 params;", "attribute vec4 size;", "attribute vec4 angle;", "attribute vec4 color;", "attribute vec4 opacity;"].join("\n"),
    varyings: ["varying vec4 vColor;", "#ifdef SHOULD_ROTATE_TEXTURE", "    varying float vAngle;", "#endif", "#ifdef SHOULD_CALCULATE_SPRITE", "    varying vec4 vSpriteSheet;", "#endif"].join("\n"),
    branchAvoidanceFunctions: ["float when_gt(float x, float y) {", "    return max(sign(x - y), 0.0);", "}", "float when_lt(float x, float y) {", "    return min( max(1.0 - sign(x - y), 0.0), 1.0 );", "}", "float when_eq( float x, float y ) {", "    return 1.0 - abs( sign( x - y ) );", "}", "float when_ge(float x, float y) {", "  return 1.0 - when_lt(x, y);", "}", "float when_le(float x, float y) {", "  return 1.0 - when_gt(x, y);", "}", "float and(float a, float b) {", "    return a * b;", "}", "float or(float a, float b) {", "    return min(a + b, 1.0);", "}"].join("\n"),
    unpackColor: ["vec3 unpackColor( in float hex ) {", "   vec3 c = vec3( 0.0 );", "   float r = mod( (hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );", "   float g = mod( (hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );", "   float b = mod( hex, PACKED_COLOR_SIZE );", "   c.r = r / PACKED_COLOR_DIVISOR;", "   c.g = g / PACKED_COLOR_DIVISOR;", "   c.b = b / PACKED_COLOR_DIVISOR;", "   return c;", "}"].join("\n"),
    floatOverLifetime: ["float getFloatOverLifetime( in float positionInTime, in vec4 attr ) {", "    highp float value = 0.0;", "    float deltaAge = positionInTime * float( VALUE_OVER_LIFETIME_LENGTH - 1 );", "    float fIndex = 0.0;", "    float shouldApplyValue = 0.0;", "    value += attr[ 0 ] * when_eq( deltaAge, 0.0 );", "", "    for( int i = 0; i < VALUE_OVER_LIFETIME_LENGTH - 1; ++i ) {", "       fIndex = float( i );", "       shouldApplyValue = and( when_gt( deltaAge, fIndex ), when_le( deltaAge, fIndex + 1.0 ) );", "       value += shouldApplyValue * mix( attr[ i ], attr[ i + 1 ], deltaAge - fIndex );", "    }", "", "    return value;", "}"].join("\n"),
    colorOverLifetime: ["vec3 getColorOverLifetime( in float positionInTime, in vec3 color1, in vec3 color2, in vec3 color3, in vec3 color4 ) {", "    vec3 value = vec3( 0.0 );", "    value.x = getFloatOverLifetime( positionInTime, vec4( color1.x, color2.x, color3.x, color4.x ) );", "    value.y = getFloatOverLifetime( positionInTime, vec4( color1.y, color2.y, color3.y, color4.y ) );", "    value.z = getFloatOverLifetime( positionInTime, vec4( color1.z, color2.z, color3.z, color4.z ) );", "    return value;", "}"].join("\n"),
    paramFetchingFunctions: ["float getAlive() {", "   return params.x;", "}", "float getAge() {", "   return params.y;", "}", "float getMaxAge() {", "   return params.z;", "}", "float getWiggle() {", "   return params.w;", "}"].join("\n"),
    forceFetchingFunctions: ["vec4 getPosition( in float age ) {", "   return modelViewMatrix * vec4( position, 1.0 );", "}", "vec3 getVelocity( in float age ) {", "   return velocity * age;", "}", "vec3 getAcceleration( in float age ) {", "   return acceleration.xyz * age;", "}"].join("\n"),
    rotationFunctions: ["#ifdef SHOULD_ROTATE_PARTICLES", "   mat4 getRotationMatrix( in vec3 axis, in float angle) {", "       axis = normalize(axis);", "       float s = sin(angle);", "       float c = cos(angle);", "       float oc = 1.0 - c;", "       return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,", "                   oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,", "                   oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,", "                   0.0,                                0.0,                                0.0,                                1.0);", "   }", "   vec3 getRotation( in vec3 pos, in float positionInTime ) {", "      vec3 axis = unpackColor( rotation.x );", "      vec3 center = rotationCenter;", "      vec3 translated;", "      mat4 rotationMatrix;", "      float angle = 0.0;", "      angle += when_eq( rotation.z, 0.0 ) * rotation.y;", "      angle += when_gt( rotation.z, 0.0 ) * mix( 0.0, rotation.y, positionInTime );", "      translated = pos - rotationCenter;", "      rotationMatrix = getRotationMatrix( axis, angle );", "      return vec3( rotationMatrix * vec4( translated, 0.0 ) ) - center;", "   }", "#endif"].join("\n"),
    rotateTexture: ["    vec2 vUv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );", "", "    #ifdef SHOULD_ROTATE_TEXTURE", "       float x = gl_PointCoord.x - 0.5;", "       float y = 1.0 - gl_PointCoord.y - 0.5;", "       float c = cos( -vAngle );", "       float s = sin( -vAngle );", "       vUv = vec2( c * x + s * y + 0.5, c * y - s * x + 0.5 );", "    #endif", "", "    #ifdef SHOULD_CALCULATE_SPRITE", "        float framesX = vSpriteSheet.x;", "        float framesY = vSpriteSheet.y;", "        float columnNorm = vSpriteSheet.z;", "        float rowNorm = vSpriteSheet.w;", "        vUv.x = gl_PointCoord.x * framesX + columnNorm;", "        vUv.y = 1.0 - (gl_PointCoord.y * framesY + rowNorm);", "    #endif", "", "    vec4 rotatedTexture = texture2D( texture, vUv );"].join("\n")
}, SPE.shaders = {
    vertex: [SPE.shaderChunks.defines, SPE.shaderChunks.uniforms, SPE.shaderChunks.attributes, SPE.shaderChunks.varyings, THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_vertex, SPE.shaderChunks.branchAvoidanceFunctions, SPE.shaderChunks.unpackColor, SPE.shaderChunks.floatOverLifetime, SPE.shaderChunks.colorOverLifetime, SPE.shaderChunks.paramFetchingFunctions, SPE.shaderChunks.forceFetchingFunctions, SPE.shaderChunks.rotationFunctions, "void main() {", "    highp float age = getAge();", "    highp float alive = getAlive();", "    highp float maxAge = getMaxAge();", "    highp float positionInTime = (age / maxAge);", "    highp float isAlive = when_gt( alive, 0.0 );", "    #ifdef SHOULD_WIGGLE_PARTICLES", "        float wiggleAmount = positionInTime * getWiggle();", "        float wiggleSin = isAlive * sin( wiggleAmount );", "        float wiggleCos = isAlive * cos( wiggleAmount );", "    #endif", "    vec3 vel = getVelocity( age );", "    vec3 accel = getAcceleration( age );", "    vec3 force = vec3( 0.0 );", "    vec3 pos = vec3( position );", "    float drag = 1.0 - (positionInTime * 0.5) * acceleration.w;", "    force += vel;", "    force *= drag;", "    force += accel * age;", "    pos += force;", "    #ifdef SHOULD_WIGGLE_PARTICLES", "        pos.x += wiggleSin;", "        pos.y += wiggleCos;", "        pos.z += wiggleSin;", "    #endif", "    #ifdef SHOULD_ROTATE_PARTICLES", "        pos = getRotation( pos, positionInTime );", "    #endif", "    vec4 mvPos = modelViewMatrix * vec4( pos, 1.0 );", "    highp float pointSize = getFloatOverLifetime( positionInTime, size ) * isAlive;", "    #ifdef HAS_PERSPECTIVE", "        float perspective = scale / length( mvPos.xyz );", "    #else", "        float perspective = 1.0;", "    #endif", "    float pointSizePerspective = pointSize * perspective;", "    #ifdef COLORIZE", "       vec3 c = isAlive * getColorOverLifetime(", "           positionInTime,", "           unpackColor( color.x ),", "           unpackColor( color.y ),", "           unpackColor( color.z ),", "           unpackColor( color.w )", "       );", "    #else", "       vec3 c = vec3(1.0);", "    #endif", "    float o = isAlive * getFloatOverLifetime( positionInTime, opacity );", "    vColor = vec4( c, o );", "    #ifdef SHOULD_ROTATE_TEXTURE", "        vAngle = isAlive * getFloatOverLifetime( positionInTime, angle );", "    #endif", "    #ifdef SHOULD_CALCULATE_SPRITE", "        float framesX = textureAnimation.x;", "        float framesY = textureAnimation.y;", "        float loopCount = textureAnimation.w;", "        float totalFrames = textureAnimation.z;", "        float frameNumber = mod( (positionInTime * loopCount) * totalFrames, totalFrames );", "        float column = floor(mod( frameNumber, framesX ));", "        float row = floor( (frameNumber - column) / framesX );", "        float columnNorm = column / framesX;", "        float rowNorm = row / framesY;", "        vSpriteSheet.x = 1.0 / framesX;", "        vSpriteSheet.y = 1.0 / framesY;", "        vSpriteSheet.z = columnNorm;", "        vSpriteSheet.w = rowNorm;", "    #endif", "    gl_PointSize = pointSizePerspective;", "    gl_Position = projectionMatrix * mvPos;", THREE.ShaderChunk.logdepthbuf_vertex, "}"].join("\n"),
    fragment: [SPE.shaderChunks.uniforms, THREE.ShaderChunk.common, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, SPE.shaderChunks.varyings, SPE.shaderChunks.branchAvoidanceFunctions, "void main() {", "    vec3 outgoingLight = vColor.xyz;", "    ", "    #ifdef ALPHATEST", "       if ( vColor.w < float(ALPHATEST) ) discard;", "    #endif", SPE.shaderChunks.rotateTexture, THREE.ShaderChunk.logdepthbuf_fragment, "    outgoingLight = vColor.xyz * rotatedTexture.xyz;", THREE.ShaderChunk.fog_fragment, "    gl_FragColor = vec4( outgoingLight.xyz, rotatedTexture.w * vColor.w );", "}"].join("\n")
}, SPE.utils = {
    types: {
        BOOLEAN: "boolean",
        STRING: "string",
        NUMBER: "number",
        OBJECT: "object"
    },
    ensureTypedArg: function(a, b, c) {
        "use strict";
        return typeof a === b ? a : c
    },
    ensureArrayTypedArg: function(a, b, c) {
        "use strict";
        if (Array.isArray(a)) {
            for (var d = a.length - 1; d >= 0; --d)
                if (typeof a[d] !== b) return c;
            return a
        }
        return this.ensureTypedArg(a, b, c)
    },
    ensureInstanceOf: function(a, b, c) {
        "use strict";
        return void 0 !== b && a instanceof b ? a : c;
    },
    ensureArrayInstanceOf: function(a, b, c) {
        "use strict";
        if (Array.isArray(a)) {
            for (var d = a.length - 1; d >= 0; --d)
                if (void 0 !== b && a[d] instanceof b == !1) return c;
            return a
        }
        return this.ensureInstanceOf(a, b, c)
    },
    ensureValueOverLifetimeCompliance: function(a, b, c) {
        "use strict";
        b = b || 3, c = c || 3, Array.isArray(a._value) === !1 && (a._value = [a._value]), Array.isArray(a._spread) === !1 && (a._spread = [a._spread]);
        var d = this.clamp(a._value.length, b, c),
            e = this.clamp(a._spread.length, b, c),
            f = Math.max(d, e);
        a._value.length !== f && (a._value = this.interpolateArray(a._value, f)), a._spread.length !== f && (a._spread = this.interpolateArray(a._spread, f))
    },
    interpolateArray: function(a, b) {
        "use strict";
        for (var c = a.length, d = ["function" == typeof a[0].clone ? a[0].clone() : a[0]], e = (c - 1) / (b - 1), f = 1; b - 1 > f; ++f) {
            var g = f * e,
                h = Math.floor(g),
                i = Math.ceil(g),
                j = g - h;
            d[f] = this.lerpTypeAgnostic(a[h], a[i], j)
        }
        return d.push("function" == typeof a[c - 1].clone ? a[c - 1].clone() : a[c - 1]), d
    },
    clamp: function(a, b, c) {
        "use strict";
        return Math.max(b, Math.min(a, c))
    },
    zeroToEpsilon: function(a, b) {
        "use strict";
        var c = 1e-5,
            d = a;
        return d = b ? Math.random() * c * 10 : c, 0 > a && a > -c && (d = -d), d
    },
    lerpTypeAgnostic: function(a, b, c) {
        "use strict";
        var d, e = this.types;
        return typeof a === e.NUMBER && typeof b === e.NUMBER ? a + (b - a) * c : a instanceof THREE.Vector2 && b instanceof THREE.Vector2 ? (d = a.clone(), d.x = this.lerp(a.x, b.x, c), d.y = this.lerp(a.y, b.y, c), d) : a instanceof THREE.Vector3 && b instanceof THREE.Vector3 ? (d = a.clone(), d.x = this.lerp(a.x, b.x, c), d.y = this.lerp(a.y, b.y, c), d.z = this.lerp(a.z, b.z, c), d) : a instanceof THREE.Vector4 && b instanceof THREE.Vector4 ? (d = a.clone(), d.x = this.lerp(a.x, b.x, c), d.y = this.lerp(a.y, b.y, c), d.z = this.lerp(a.z, b.z, c), d.w = this.lerp(a.w, b.w, c), d) : a instanceof THREE.Color && b instanceof THREE.Color ? (d = a.clone(), d.r = this.lerp(a.r, b.r, c), d.g = this.lerp(a.g, b.g, c), d.b = this.lerp(a.b, b.b, c), d) : void console.warn("Invalid argument types, or argument types do not match:", a, b)
    },
    lerp: function(a, b, c) {
        "use strict";
        return a + (b - a) * c
    },
    roundToNearestMultiple: function(a, b) {
        "use strict";
        var c = 0;
        return 0 === b ? a : (c = Math.abs(a) % b,
            0 === c ? a : 0 > a ? -(Math.abs(a) - c) : a + b - c)
    },
    arrayValuesAreEqual: function(a) {
        "use strict";
        for (var b = 0; b < a.length - 1; ++b)
            if (a[b] !== a[b + 1]) return !1;
        return !0
    },
    randomFloat: function(a, b) {
        "use strict";
        return a + b * (Math.random() - .5)
    },
    randomVector3: function(a, b, c, d, e) {
        "use strict";
        var f = c.x + (Math.random() * d.x - .5 * d.x),
            g = c.y + (Math.random() * d.y - .5 * d.y),
            h = c.z + (Math.random() * d.z - .5 * d.z);
        e && (f = .5 * -e.x + this.roundToNearestMultiple(f, e.x), g = .5 * -e.y + this.roundToNearestMultiple(g, e.y), h = .5 * -e.z + this.roundToNearestMultiple(h, e.z)), a.typedArray.setVec3Components(b, f, g, h)
    },
    randomColor: function(a, b, c, d) {
        "use strict";
        var e = c.r + Math.random() * d.x,
            f = c.g + Math.random() * d.y,
            g = c.b + Math.random() * d.z;
        e = this.clamp(e, 0, 1), f = this.clamp(f, 0, 1), g = this.clamp(g, 0, 1), a.typedArray.setVec3Components(b, e, f, g)
    },
    randomColorAsHex: function() {
        "use strict";
        var a = new THREE.Color;
        return function(b, c, d, e) {
            for (var f = d.length, g = [], h = 0; f > h; ++h) {
                var i = e[h];
                a.copy(d[h]), a.r += Math.random() * i.x - .5 * i.x, a.g += Math.random() * i.y - .5 * i.y, a.b += Math.random() * i.z - .5 * i.z,
                    a.r = this.clamp(a.r, 0, 1), a.g = this.clamp(a.g, 0, 1), a.b = this.clamp(a.b, 0, 1), g.push(a.getHex())
            }
            b.typedArray.setVec4Components(c, g[0], g[1], g[2], g[3])
        }
    }(),
    randomVector3OnSphere: function(a, b, c, d, e, f, g, h) {
        "use strict";
        var i = 2 * Math.random() - 1,
            j = 6.2832 * Math.random(),
            k = Math.sqrt(1 - i * i),
            l = this.randomFloat(d, e),
            m = 0,
            n = 0,
            o = 0;
        g && (l = Math.round(l / g) * g), m = k * Math.cos(j) * l, n = k * Math.sin(j) * l, o = i * l, m *= f.x, n *= f.y, o *= f.z, m += c.x, n += c.y, o += c.z, a.typedArray.setVec3Components(b, m, n, o)
    },
    seededRandom: function(a) {
        var b = 1e4 * Math.sin(a);
        return b - (0 | b)
    },
    randomVector3OnDisc: function(a, b, c, d, e, f, g) {
        "use strict";
        var h = 6.2832 * Math.random(),
            i = Math.abs(this.randomFloat(d, e)),
            j = 0,
            k = 0,
            l = 0;
        g && (i = Math.round(i / g) * g), j = Math.cos(h) * i, k = Math.sin(h) * i, j *= f.x, k *= f.y, j += c.x, k += c.y, l += c.z, a.typedArray.setVec3Components(b, j, k, l)
    },
    randomDirectionVector3OnSphere: function() {
        "use strict";
        var a = new THREE.Vector3;
        return function(b, c, d, e, f, g, h, i) {
            a.copy(g), a.x -= d, a.y -= e, a.z -= f, a.normalize().multiplyScalar(-this.randomFloat(h, i)), b.typedArray.setVec3Components(c, a.x, a.y, a.z);
        }
    }(),
    randomDirectionVector3OnDisc: function() {
        "use strict";
        var a = new THREE.Vector3;
        return function(b, c, d, e, f, g, h, i) {
            a.copy(g), a.x -= d, a.y -= e, a.z -= f, a.normalize().multiplyScalar(-this.randomFloat(h, i)), b.typedArray.setVec3Components(c, a.x, a.y, 0)
        }
    }(),
    getPackedRotationAxis: function() {
        "use strict";
        var a = new THREE.Vector3,
            b = new THREE.Vector3,
            c = new THREE.Color;
        return function(d, e) {
            return a.copy(d).normalize(), b.copy(e).normalize(), a.x += .5 * -e.x + Math.random() * e.x, a.y += .5 * -e.y + Math.random() * e.y, a.z += .5 * -e.z + Math.random() * e.z, a.x = Math.abs(a.x), a.y = Math.abs(a.y), a.z = Math.abs(a.z), a.normalize(), c.setRGB(a.x, a.y, a.z), c.getHex()
        }
    }()
}, SPE.Group = function(a) {
    "use strict";
    var b = SPE.utils,
        c = b.types;
    a = b.ensureTypedArg(a, c.OBJECT, {}), a.texture = b.ensureTypedArg(a.texture, c.OBJECT, {}), this.uuid = THREE.Math.generateUUID(), this.fixedTimeStep = b.ensureTypedArg(a.fixedTimeStep, c.NUMBER, .016), this.texture = b.ensureInstanceOf(a.texture.value, THREE.Texture, null), this.textureFrames = b.ensureInstanceOf(a.texture.frames, THREE.Vector2, new THREE.Vector2(1, 1)),
        this.textureFrameCount = b.ensureTypedArg(a.texture.frameCount, c.NUMBER, this.textureFrames.x * this.textureFrames.y), this.textureLoop = b.ensureTypedArg(a.texture.loop, c.NUMBER, 1), this.textureFrames.max(new THREE.Vector2(1, 1)), this.hasPerspective = b.ensureTypedArg(a.hasPerspective, c.BOOLEAN, !0), this.colorize = b.ensureTypedArg(a.colorize, c.BOOLEAN, !0), this.maxParticleCount = b.ensureTypedArg(a.maxParticleCount, c.NUMBER, null), this.blending = b.ensureTypedArg(a.blending, c.NUMBER, THREE.AdditiveBlending), this.transparent = b.ensureTypedArg(a.transparent, c.BOOLEAN, !0), this.alphaTest = parseFloat(b.ensureTypedArg(a.alphaTest, c.NUMBER, 0)), this.depthWrite = b.ensureTypedArg(a.depthWrite, c.BOOLEAN, !1), this.depthTest = b.ensureTypedArg(a.depthTest, c.BOOLEAN, !0), this.fog = b.ensureTypedArg(a.fog, c.BOOLEAN, !0), this.scale = b.ensureTypedArg(a.scale, c.NUMBER, 300), this.emitters = [], this.emitterIDs = [], this._pool = [], this._poolCreationSettings = null, this._createNewWhenPoolEmpty = 0, this._attributesNeedRefresh = !1, this._attributesNeedDynamicReset = !1,
        this.particleCount = 0, this.uniforms = {
            texture: {
                type: "t",
                value: this.texture
            },
            textureAnimation: {
                type: "v4",
                value: new THREE.Vector4(this.textureFrames.x, this.textureFrames.y, this.textureFrameCount, Math.max(Math.abs(this.textureLoop), 1))
            },
            fogColor: {
                type: "c",
                value: null
            },
            fogNear: {
                type: "f",
                value: 10
            },
            fogFar: {
                type: "f",
                value: 200
            },
            fogDensity: {
                type: "f",
                value: .5
            },
            deltaTime: {
                type: "f",
                value: 0
            },
            runTime: {
                type: "f",
                value: 0
            },
            scale: {
                type: "f",
                value: this.scale
            }
        }, this.defines = {
            HAS_PERSPECTIVE: this.hasPerspective,
            COLORIZE: this.colorize,
            VALUE_OVER_LIFETIME_LENGTH: SPE.valueOverLifetimeLength,
            SHOULD_ROTATE_TEXTURE: !1,
            SHOULD_ROTATE_PARTICLES: !1,
            SHOULD_WIGGLE_PARTICLES: !1,
            SHOULD_CALCULATE_SPRITE: this.textureFrames.x > 1 || this.textureFrames.y > 1
        }, this.attributes = {
            position: new SPE.ShaderAttribute("v3", !0),
            acceleration: new SPE.ShaderAttribute("v4", !0),
            velocity: new SPE.ShaderAttribute("v3", !0),
            rotation: new SPE.ShaderAttribute("v4", !0),
            rotationCenter: new SPE.ShaderAttribute("v3", !0),
            params: new SPE.ShaderAttribute("v4", !0),
            size: new SPE.ShaderAttribute("v4", !0),
            angle: new SPE.ShaderAttribute("v4", !0),
            color: new SPE.ShaderAttribute("v4", !0),
            opacity: new SPE.ShaderAttribute("v4", !0)
        }, this.attributeKeys = Object.keys(this.attributes), this.attributeCount = this.attributeKeys.length, this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: SPE.shaders.vertex,
            fragmentShader: SPE.shaders.fragment,
            blending: this.blending,
            transparent: this.transparent,
            alphaTest: this.alphaTest,
            depthWrite: this.depthWrite,
            depthTest: this.depthTest,
            defines: this.defines,
            fog: this.fog
        }), this.geometry = new THREE.BufferGeometry, this.mesh = new THREE.Points(this.geometry, this.material)
}, SPE.Group.constructor = SPE.Group, SPE.Group.prototype._updateDefines = function() {
    "use strict";
    var a, b = this.emitters,
        c = b.length - 1,
        d = this.defines;
    for (c; c >= 0; --c) a = b[c], d.SHOULD_CALCULATE_SPRITE || (d.SHOULD_ROTATE_TEXTURE = d.SHOULD_ROTATE_TEXTURE || !!Math.max(Math.max.apply(null, a.angle.value), Math.max.apply(null, a.angle.spread))),
        d.SHOULD_ROTATE_PARTICLES = d.SHOULD_ROTATE_PARTICLES || !!Math.max(a.rotation.angle, a.rotation.angleSpread), d.SHOULD_WIGGLE_PARTICLES = d.SHOULD_WIGGLE_PARTICLES || !!Math.max(a.wiggle.value, a.wiggle.spread);
    this.material.needsUpdate = !0
}, SPE.Group.prototype._applyAttributesToGeometry = function() {
    "use strict";
    var a, b, c = this.attributes,
        d = this.geometry,
        e = d.attributes;
    for (var f in c) c.hasOwnProperty(f) && (a = c[f], b = e[f], b ? b.array = a.typedArray.array : d.addAttribute(f, a.bufferAttribute), a.bufferAttribute.needsUpdate = !0);
    this.geometry.setDrawRange(0, this.particleCount)
}, SPE.Group.prototype.addEmitter = function(a) {
    "use strict";
    if (a instanceof SPE.Emitter == !1) return void console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:", a);
    if (this.emitterIDs.indexOf(a.uuid) > -1) return void console.error("Emitter already exists in this group. Will not add again.");
    if (null !== a.group) return void console.error("Emitter already belongs to another group. Will not add to requested group.");
    var b = this.attributes,
        c = this.particleCount,
        d = c + a.particleCount;
    this.particleCount = d, null !== this.maxParticleCount && this.particleCount > this.maxParticleCount && console.warn("SPE.Group: maxParticleCount exceeded. Requesting", this.particleCount, "particles, can support only", this.maxParticleCount), a._calculatePPSValue(a.maxAge._value + a.maxAge._spread), a._setBufferUpdateRanges(this.attributeKeys), a._setAttributeOffset(c), a.group = this, a.attributes = this.attributes;
    for (var e in b) b.hasOwnProperty(e) && b[e]._createBufferAttribute(null !== this.maxParticleCount ? this.maxParticleCount : this.particleCount);
    for (var f = c; d > f; ++f) a._assignPositionValue(f), a._assignForceValue(f, "velocity"), a._assignForceValue(f, "acceleration"), a._assignAbsLifetimeValue(f, "opacity"), a._assignAbsLifetimeValue(f, "size"), a._assignAngleValue(f), a._assignRotationValue(f), a._assignParamsValue(f), a._assignColorValue(f);
    return this._applyAttributesToGeometry(), this.emitters.push(a), this.emitterIDs.push(a.uuid), this._updateDefines(a), this.material.needsUpdate = !0, this.geometry.needsUpdate = !0, this._attributesNeedRefresh = !0,
        this
}, SPE.Group.prototype.removeEmitter = function(a) {
    "use strict";
    var b = this.emitterIDs.indexOf(a.uuid);
    if (a instanceof SPE.Emitter == !1) return void console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:", a);
    if (-1 === b) return void console.error("Emitter does not exist in this group. Will not remove.");
    for (var c = a.attributeOffset, d = c + a.particleCount, e = this.attributes.params.typedArray, f = c; d > f; ++f) e.array[4 * f] = 0, e.array[4 * f + 1] = 0;
    this.emitters.splice(b, 1), this.emitterIDs.splice(b, 1);
    for (var g in this.attributes) this.attributes.hasOwnProperty(g) && this.attributes[g].splice(c, d);
    this.particleCount -= a.particleCount, a._onRemove(), this._attributesNeedRefresh = !0
}, SPE.Group.prototype.getFromPool = function() {
    "use strict";
    var a = this._pool,
        b = this._createNewWhenPoolEmpty;
    return a.length ? a.pop() : b ? new SPE.Emitter(this._poolCreationSettings) : null
}, SPE.Group.prototype.releaseIntoPool = function(a) {
    "use strict";
    return a instanceof SPE.Emitter == !1 ? void console.error("Argument is not instanceof SPE.Emitter:", a) : (a.reset(),
        this._pool.unshift(a), this)
}, SPE.Group.prototype.getPool = function() {
    "use strict";
    return this._pool
}, SPE.Group.prototype.addPool = function(a, b, c) {
    "use strict";
    var d;
    this._poolCreationSettings = b, this._createNewWhenPoolEmpty = !!c;
    for (var e = 0; a > e; ++e) d = Array.isArray(b) ? new SPE.Emitter(b[e]) : new SPE.Emitter(b), this.addEmitter(d), this.releaseIntoPool(d);
    return this
}, SPE.Group.prototype._triggerSingleEmitter = function(a) {
    "use strict";
    var b = this.getFromPool(),
        c = this;
    return null === b ? void console.log("SPE.Group pool ran out.") : (a instanceof THREE.Vector3 && (b.position.value.copy(a), b.position.value = b.position.value), b.enable(), setTimeout(function() {
        b.disable(), c.releaseIntoPool(b)
    }, 1e3 * (b.maxAge.value + b.maxAge.spread)), this)
}, SPE.Group.prototype.triggerPoolEmitter = function(a, b) {
    "use strict";
    if ("number" == typeof a && a > 1)
        for (var c = 0; a > c; ++c) this._triggerSingleEmitter(b);
    else this._triggerSingleEmitter(b);
    return this
}, SPE.Group.prototype._updateUniforms = function(a) {
    "use strict";
    this.uniforms.runTime.value += a,
        this.uniforms.deltaTime.value = a
}, SPE.Group.prototype._resetBufferRanges = function() {
    "use strict";
    var a = this.attributeKeys,
        b = this.attributeCount - 1,
        c = this.attributes;
    for (b; b >= 0; --b) c[a[b]].resetUpdateRange()
}, SPE.Group.prototype._updateBuffers = function(a) {
    "use strict";
    var b, c, d, e = this.attributeKeys,
        f = this.attributeCount - 1,
        g = this.attributes,
        h = a.bufferUpdateRanges;
    for (f; f >= 0; --f) b = e[f], c = h[b], d = g[b], d.setUpdateRange(c.min, c.max), d.flagUpdate()
}, SPE.Group.prototype.tick = function(a) {
    "use strict";
    var b, c = this.emitters,
        d = c.length,
        e = a || this.fixedTimeStep,
        f = this.attributeKeys,
        g = this.attributes;
    if (this._updateUniforms(e), this._resetBufferRanges(), 0 !== d || this._attributesNeedRefresh !== !1 || this._attributesNeedDynamicReset !== !1) {
        for (var h, b = 0; d > b; ++b) h = c[b], h.tick(e), this._updateBuffers(h);
        if (this._attributesNeedDynamicReset === !0) {
            for (b = this.attributeCount - 1; b >= 0; --b) g[f[b]].resetDynamic();
            this._attributesNeedDynamicReset = !1
        }
        if (this._attributesNeedRefresh === !0) {
            for (b = this.attributeCount - 1; b >= 0; --b) g[f[b]].forceUpdateAll();
            this._attributesNeedRefresh = !1, this._attributesNeedDynamicReset = !0
        }
    }
}, SPE.Group.prototype.dispose = function() {
    "use strict";
    return this.geometry.dispose(), this.material.dispose(), this
}, SPE.Emitter = function(a) {
    "use strict";
    var b = SPE.utils,
        c = b.types,
        d = SPE.valueOverLifetimeLength;
    a = b.ensureTypedArg(a, c.OBJECT, {}), a.position = b.ensureTypedArg(a.position, c.OBJECT, {}), a.velocity = b.ensureTypedArg(a.velocity, c.OBJECT, {}), a.acceleration = b.ensureTypedArg(a.acceleration, c.OBJECT, {}), a.radius = b.ensureTypedArg(a.radius, c.OBJECT, {}), a.drag = b.ensureTypedArg(a.drag, c.OBJECT, {}), a.rotation = b.ensureTypedArg(a.rotation, c.OBJECT, {}), a.color = b.ensureTypedArg(a.color, c.OBJECT, {}), a.opacity = b.ensureTypedArg(a.opacity, c.OBJECT, {}), a.size = b.ensureTypedArg(a.size, c.OBJECT, {}), a.angle = b.ensureTypedArg(a.angle, c.OBJECT, {}), a.wiggle = b.ensureTypedArg(a.wiggle, c.OBJECT, {}), a.maxAge = b.ensureTypedArg(a.maxAge, c.OBJECT, {}), a.onParticleSpawn && console.warn("onParticleSpawn has been removed. Please set properties directly to alter values at runtime."),
        this.uuid = THREE.Math.generateUUID(), this.type = b.ensureTypedArg(a.type, c.NUMBER, SPE.distributions.BOX), this.position = {
            _value: b.ensureInstanceOf(a.position.value, THREE.Vector3, new THREE.Vector3),
            _spread: b.ensureInstanceOf(a.position.spread, THREE.Vector3, new THREE.Vector3),
            _spreadClamp: b.ensureInstanceOf(a.position.spreadClamp, THREE.Vector3, new THREE.Vector3),
            _distribution: b.ensureTypedArg(a.position.distribution, c.NUMBER, this.type),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1),
            _radius: b.ensureTypedArg(a.position.radius, c.NUMBER, 10),
            _radiusScale: b.ensureInstanceOf(a.position.scale, THREE.Vector3, new THREE.Vector3(1, 1, 1)),
            _distributionClamp: b.ensureTypedArg(a.position.distributionClamp, c.NUMBER, 0)
        }, this.velocity = {
            _value: b.ensureInstanceOf(a.velocity.value, THREE.Vector3, new THREE.Vector3),
            _spread: b.ensureInstanceOf(a.velocity.spread, THREE.Vector3, new THREE.Vector3),
            _distribution: b.ensureTypedArg(a.velocity.distribution, c.NUMBER, this.type),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.acceleration = {
            _value: b.ensureInstanceOf(a.acceleration.value, THREE.Vector3, new THREE.Vector3),
            _spread: b.ensureInstanceOf(a.acceleration.spread, THREE.Vector3, new THREE.Vector3),
            _distribution: b.ensureTypedArg(a.acceleration.distribution, c.NUMBER, this.type),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.drag = {
            _value: b.ensureTypedArg(a.drag.value, c.NUMBER, 0),
            _spread: b.ensureTypedArg(a.drag.spread, c.NUMBER, 0),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.wiggle = {
            _value: b.ensureTypedArg(a.wiggle.value, c.NUMBER, 0),
            _spread: b.ensureTypedArg(a.wiggle.spread, c.NUMBER, 0)
        }, this.rotation = {
            _axis: b.ensureInstanceOf(a.rotation.axis, THREE.Vector3, new THREE.Vector3(0, 1, 0)),
            _axisSpread: b.ensureInstanceOf(a.rotation.axisSpread, THREE.Vector3, new THREE.Vector3),
            _angle: b.ensureTypedArg(a.rotation.angle, c.NUMBER, 0),
            _angleSpread: b.ensureTypedArg(a.rotation.angleSpread, c.NUMBER, 0),
            _static: b.ensureTypedArg(a.rotation["static"], c.BOOLEAN, !1),
            _center: b.ensureInstanceOf(a.rotation.center, THREE.Vector3, this.position._value.clone()),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.maxAge = {
            _value: b.ensureTypedArg(a.maxAge.value, c.NUMBER, 2),
            _spread: b.ensureTypedArg(a.maxAge.spread, c.NUMBER, 0)
        }, this.color = {
            _value: b.ensureArrayInstanceOf(a.color.value, THREE.Color, new THREE.Color),
            _spread: b.ensureArrayInstanceOf(a.color.spread, THREE.Vector3, new THREE.Vector3),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.opacity = {
            _value: b.ensureArrayTypedArg(a.opacity.value, c.NUMBER, 1),
            _spread: b.ensureArrayTypedArg(a.opacity.spread, c.NUMBER, 0),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.size = {
            _value: b.ensureArrayTypedArg(a.size.value, c.NUMBER, 1),
            _spread: b.ensureArrayTypedArg(a.size.spread, c.NUMBER, 0),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.angle = {
            _value: b.ensureArrayTypedArg(a.angle.value, c.NUMBER, 0),
            _spread: b.ensureArrayTypedArg(a.angle.spread, c.NUMBER, 0),
            _randomise: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1)
        }, this.particleCount = b.ensureTypedArg(a.particleCount, c.NUMBER, 100),
        this.duration = b.ensureTypedArg(a.duration, c.NUMBER, null), this.isStatic = b.ensureTypedArg(a.isStatic, c.BOOLEAN, !1), this.activeMultiplier = b.ensureTypedArg(a.activeMultiplier, c.NUMBER, 1), this.direction = b.ensureTypedArg(a.direction, c.NUMBER, 1), this.alive = b.ensureTypedArg(a.alive, c.BOOLEAN, !0), this.particlesPerSecond = 0, this.activationIndex = 0, this.attributeOffset = 0, this.attributeEnd = 0, this.age = 0, this.activeParticleCount = 0, this.group = null, this.attributes = null, this.paramsArray = null, this.resetFlags = {
            position: b.ensureTypedArg(a.position.randomise, c.BOOLEAN, !1) || b.ensureTypedArg(a.radius.randomise, c.BOOLEAN, !1),
            velocity: b.ensureTypedArg(a.velocity.randomise, c.BOOLEAN, !1),
            acceleration: b.ensureTypedArg(a.acceleration.randomise, c.BOOLEAN, !1) || b.ensureTypedArg(a.drag.randomise, c.BOOLEAN, !1),
            rotation: b.ensureTypedArg(a.rotation.randomise, c.BOOLEAN, !1),
            rotationCenter: b.ensureTypedArg(a.rotation.randomise, c.BOOLEAN, !1),
            size: b.ensureTypedArg(a.size.randomise, c.BOOLEAN, !1),
            color: b.ensureTypedArg(a.color.randomise, c.BOOLEAN, !1),
            opacity: b.ensureTypedArg(a.opacity.randomise, c.BOOLEAN, !1),
            angle: b.ensureTypedArg(a.angle.randomise, c.BOOLEAN, !1)
        }, this.updateFlags = {}, this.updateCounts = {}, this.updateMap = {
            maxAge: "params",
            position: "position",
            velocity: "velocity",
            acceleration: "acceleration",
            drag: "acceleration",
            wiggle: "params",
            rotation: "rotation",
            size: "size",
            color: "color",
            opacity: "opacity",
            angle: "angle"
        };
    for (var e in this.updateMap) this.updateMap.hasOwnProperty(e) && (this.updateCounts[this.updateMap[e]] = 0, this.updateFlags[this.updateMap[e]] = !1, this._createGetterSetters(this[e], e));
    this.bufferUpdateRanges = {}, this.attributeKeys = null, this.attributeCount = 0, b.ensureValueOverLifetimeCompliance(this.color, d, d), b.ensureValueOverLifetimeCompliance(this.opacity, d, d), b.ensureValueOverLifetimeCompliance(this.size, d, d), b.ensureValueOverLifetimeCompliance(this.angle, d, d)
}, SPE.Emitter.constructor = SPE.Emitter, SPE.Emitter.prototype._createGetterSetters = function(a, b) {
    "use strict";
    var c = this;
    for (var d in a)
        if (a.hasOwnProperty(d)) {
            var e = d.replace("_", "");
            Object.defineProperty(a, e, {
                get: function(a) {
                    return function() {
                        return this[a]
                    }
                }(d),
                set: function(a) {
                    return function(d) {
                        var e = c.updateMap[b],
                            f = this[a],
                            g = SPE.valueOverLifetimeLength;
                        "_rotationCenter" === a ? (c.updateFlags.rotationCenter = !0, c.updateCounts.rotationCenter = 0) : "_randomise" === a ? c.resetFlags[e] = d : (c.updateFlags[e] = !0, c.updateCounts[e] = 0), c.group._updateDefines(), this[a] = d, Array.isArray(f) && SPE.utils.ensureValueOverLifetimeCompliance(c[b], g, g)
                    }
                }(d)
            })
        }
}, SPE.Emitter.prototype._setBufferUpdateRanges = function(a) {
    "use strict";
    this.attributeKeys = a, this.attributeCount = a.length;
    for (var b = this.attributeCount - 1; b >= 0; --b) this.bufferUpdateRanges[a[b]] = {
        min: Number.POSITIVE_INFINITY,
        max: Number.NEGATIVE_INFINITY
    }
}, SPE.Emitter.prototype._calculatePPSValue = function(a) {
    "use strict";
    var b = this.particleCount;
    this.duration ? this.particlesPerSecond = b / (a < this.duration ? a : this.duration) : this.particlesPerSecond = b / a
}, SPE.Emitter.prototype._setAttributeOffset = function(a) {
    this.attributeOffset = a, this.activationIndex = a,
        this.activationEnd = a + this.particleCount
}, SPE.Emitter.prototype._assignValue = function(a, b) {
    "use strict";
    switch (a) {
        case "position":
            this._assignPositionValue(b);
            break;
        case "velocity":
        case "acceleration":
            this._assignForceValue(b, a);
            break;
        case "size":
        case "opacity":
            this._assignAbsLifetimeValue(b, a);
            break;
        case "angle":
            this._assignAngleValue(b);
            break;
        case "params":
            this._assignParamsValue(b);
            break;
        case "rotation":
            this._assignRotationValue(b);
            break;
        case "color":
            this._assignColorValue(b)
    }
}, SPE.Emitter.prototype._assignPositionValue = function(a) {
    "use strict";
    var b = SPE.distributions,
        c = SPE.utils,
        d = this.position,
        e = this.attributes.position,
        f = d._value,
        g = d._spread,
        h = d._distribution;
    switch (h) {
        case b.BOX:
            c.randomVector3(e, a, f, g, d._spreadClamp);
            break;
        case b.SPHERE:
            c.randomVector3OnSphere(e, a, f, d._radius, d._spread.x, d._radiusScale, d._spreadClamp.x, d._distributionClamp || this.particleCount);
            break;
        case b.DISC:
            c.randomVector3OnDisc(e, a, f, d._radius, d._spread.x, d._radiusScale, d._spreadClamp.x)
    }
}, SPE.Emitter.prototype._assignForceValue = function(a, b) {
    "use strict";
    var c, d, e, f, g, h = SPE.distributions,
        i = SPE.utils,
        j = this[b],
        k = j._value,
        l = j._spread,
        m = j._distribution;
    switch (m) {
        case h.BOX:
            i.randomVector3(this.attributes[b], a, k, l);
            break;
        case h.SPHERE:
            c = this.attributes.position.typedArray.array, g = 3 * a, d = c[g], e = c[g + 1], f = c[g + 2], i.randomDirectionVector3OnSphere(this.attributes[b], a, d, e, f, this.position._value, j._value.x, j._spread.x);
            break;
        case h.DISC:
            c = this.attributes.position.typedArray.array, g = 3 * a, d = c[g], e = c[g + 1], f = c[g + 2], i.randomDirectionVector3OnDisc(this.attributes[b], a, d, e, f, this.position._value, j._value.x, j._spread.x)
    }
    if ("acceleration" === b) {
        var n = i.clamp(i.randomFloat(this.drag._value, this.drag._spread), 0, 1);
        this.attributes.acceleration.typedArray.array[4 * a + 3] = n
    }
}, SPE.Emitter.prototype._assignAbsLifetimeValue = function(a, b) {
    "use strict";
    var c, d = this.attributes[b].typedArray,
        e = this[b],
        f = SPE.utils;
    f.arrayValuesAreEqual(e._value) && f.arrayValuesAreEqual(e._spread) ? (c = Math.abs(f.randomFloat(e._value[0], e._spread[0])), d.setVec4Components(a, c, c, c, c)) : d.setVec4Components(a, Math.abs(f.randomFloat(e._value[0], e._spread[0])), Math.abs(f.randomFloat(e._value[1], e._spread[1])), Math.abs(f.randomFloat(e._value[2], e._spread[2])), Math.abs(f.randomFloat(e._value[3], e._spread[3])));
}, SPE.Emitter.prototype._assignAngleValue = function(a) {
    "use strict";
    var b, c = this.attributes.angle.typedArray,
        d = this.angle,
        e = SPE.utils;
    e.arrayValuesAreEqual(d._value) && e.arrayValuesAreEqual(d._spread) ? (b = e.randomFloat(d._value[0], d._spread[0]), c.setVec4Components(a, b, b, b, b)) : c.setVec4Components(a, e.randomFloat(d._value[0], d._spread[0]), e.randomFloat(d._value[1], d._spread[1]), e.randomFloat(d._value[2], d._spread[2]), e.randomFloat(d._value[3], d._spread[3]))
}, SPE.Emitter.prototype._assignParamsValue = function(a) {
    "use strict";
    this.attributes.params.typedArray.setVec4Components(a, this.isStatic ? 1 : 0, 0, Math.abs(SPE.utils.randomFloat(this.maxAge._value, this.maxAge._spread)), SPE.utils.randomFloat(this.wiggle._value, this.wiggle._spread))
}, SPE.Emitter.prototype._assignRotationValue = function(a) {
    "use strict";
    this.attributes.rotation.typedArray.setVec3Components(a, SPE.utils.getPackedRotationAxis(this.rotation._axis, this.rotation._axisSpread), SPE.utils.randomFloat(this.rotation._angle, this.rotation._angleSpread), this.rotation._static ? 0 : 1),
        this.attributes.rotationCenter.typedArray.setVec3(a, this.rotation._center)
}, SPE.Emitter.prototype._assignColorValue = function(a) {
    "use strict";
    SPE.utils.randomColorAsHex(this.attributes.color, a, this.color._value, this.color._spread)
}, SPE.Emitter.prototype._resetParticle = function(a) {
    "use strict";
    for (var b, c, d = this.resetFlags, e = this.updateFlags, f = this.updateCounts, g = this.attributeKeys, h = this.attributeCount - 1; h >= 0; --h) b = g[h], c = e[b], (d[b] === !0 || c === !0) && (this._assignValue(b, a), this._updateAttributeUpdateRange(b, a), c === !0 && f[b] === this.particleCount ? (e[b] = !1, f[b] = 0) : 1 == c && ++f[b])
}, SPE.Emitter.prototype._updateAttributeUpdateRange = function(a, b) {
    "use strict";
    var c = this.bufferUpdateRanges[a];
    c.min = Math.min(b, c.min), c.max = Math.max(b, c.max)
}, SPE.Emitter.prototype._resetBufferRanges = function() {
    "use strict";
    var a, b = this.bufferUpdateRanges,
        c = this.bufferUpdateKeys,
        d = this.bufferUpdateCount - 1;
    for (d; d >= 0; --d) a = c[d], b[a].min = Number.POSITIVE_INFINITY, b[a].max = Number.NEGATIVE_INFINITY
}, SPE.Emitter.prototype._onRemove = function() {
    "use strict";
    this.particlesPerSecond = 0, this.attributeOffset = 0, this.activationIndex = 0, this.activeParticleCount = 0, this.group = null, this.attributes = null, this.paramsArray = null, this.age = 0
}, SPE.Emitter.prototype._decrementParticleCount = function() {
    "use strict";
    --this.activeParticleCount
}, SPE.Emitter.prototype._incrementParticleCount = function() {
    "use strict";
    ++this.activeParticleCount
}, SPE.Emitter.prototype._checkParticleAges = function(a, b, c, d) {
    "use strict";
    for (var e, f, g, h, i = b - 1; i >= a; --i) e = 4 * i, h = c[e], 0 !== h && (g = c[e + 1], f = c[e + 2], 1 === this.direction ? (g += d, g >= f && (g = 0, h = 0, this._decrementParticleCount())) : (g -= d, 0 >= g && (g = f, h = 0, this._decrementParticleCount())), c[e] = h, c[e + 1] = g, this._updateAttributeUpdateRange("params", i))
}, SPE.Emitter.prototype._activateParticles = function(a, b, c, d) {
    "use strict";
    for (var e, f, g = this.direction, h = a; b > h; ++h) e = 4 * h, (0 == c[e] || 1 === this.particleCount) && (this._incrementParticleCount(), c[e] = 1, this._resetParticle(h), f = d * (h - a), c[e + 1] = -1 === g ? c[e + 2] - f : f, this._updateAttributeUpdateRange("params", h));
}, SPE.Emitter.prototype.tick = function(a) {
    "use strict";
    if (!this.isStatic) {
        null === this.paramsArray && (this.paramsArray = this.attributes.params.typedArray.array);
        var b = this.attributeOffset,
            c = b + this.particleCount,
            d = this.paramsArray,
            e = this.particlesPerSecond * this.activeMultiplier * a,
            f = this.activationIndex;
        if (this._resetBufferRanges(), this._checkParticleAges(b, c, d, a), this.alive === !1) return void(this.age = 0);
        if (null !== this.duration && this.age > this.duration) return this.alive = !1, void(this.age = 0);
        var g = 1 === this.particleCount ? f : 0 | f,
            h = Math.min(g + e, this.activationEnd),
            i = h - this.activationIndex | 0,
            j = i > 0 ? a / i : 0;
        this._activateParticles(g, h, d, j), this.activationIndex += e, this.activationIndex > c && (this.activationIndex = b), this.age += a
    }
}, SPE.Emitter.prototype.reset = function(a) {
    "use strict";
    if (this.age = 0, this.alive = !1, a === !0) {
        for (var b, c = this.attributeOffset, d = c + this.particleCount, e = this.paramsArray, f = this.attributes.params.bufferAttribute, g = d - 1; g >= c; --g) b = 4 * g, e[b] = 0, e[b + 1] = 0;
        f.updateRange.offset = 0, f.updateRange.count = -1,
            f.needsUpdate = !0
    }
    return this
}, SPE.Emitter.prototype.enable = function() {
    "use strict";
    return this.alive = !0, this
}, SPE.Emitter.prototype.disable = function() {
    "use strict";
    return this.alive = !1, this
}, SPE.Emitter.prototype.remove = function() {
    "use strict";
    return null !== this.group ? this.group.removeEmitter(this) : console.error("Emitter does not belong to a group, cannot remove."), this
};
