
precision highp float;

const vec4 noiseSegments = vec4(541.0, 1223.0, 2741.0, 6133.0);
const vec4 multSegments = vec4(9733.0, 4409.0, 1987.0, 863.0);

float noise11w ( in float p ) {
    return fract(sin(p * noiseSegments.w) * multSegments.w);
}

vec3 noise32 ( in vec2 p ) {
    vec3 f = vec3(p, p.x * (noise11w(p.y) * 2.0 - 1.0));
    // f = f * noiseSegments.xyz;
    return fract(sin(dot(f, noiseSegments.xyz)) * multSegments.xyz);
}

float noise21t ( in vec2 p, in float t ) {
    return fract(sin(dot(p, noiseSegments.xy)) * (multSegments.x + t));
}

const float PHI = 6.28318530718;
uniform float u_diffusion;
uniform float u_noise;
uniform float u_time;
uniform float u_lightRotation;
uniform vec2 u_dimensions;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform vec4 u_color4;
uniform vec4 u_color5;
uniform int u_lightCount;

vec2 circ( in float t ) {
    return vec2(cos(t), sin(t));
}

float basis () {
    return min(u_dimensions.x, u_dimensions.y);
}

vec2 lightPositionAt( in float diam, in float t ) {
    float pxRad = diam / 2.0 * basis();
    vec2 size = pxRad / u_dimensions.xy;
    // size = vec2(diam / 2.0);
    return circ(t) * size + 0.5;
}

vec2 lightPosition( in float num, in float t, in float total ) {
    // return vec2(0.9, 0.1);
    return lightPositionAt(0.9, t + num * PHI / total);
}

float brightness( in vec2 uv, in vec2 lightPosition, in vec2 diffusion ) {
    return max(0.0, 1.0 - length(lightPosition / diffusion - uv / diffusion));
}

vec4 addNoise( in vec2 uv ) {
    vec3 nc = noise32(uv);
    vec4 noiseColor = u_color1 * nc.x + u_color2 * nc.y + u_color3 * nc.z;
    return u_noise * noiseColor * (noise21t(uv, u_time * 3.0));
}

void render( out vec4 fragColor, in vec2 fragCoord ) {
    vec4 black = fragColor;
	vec2 diffusionXY = basis() * u_diffusion / u_dimensions.xy;
    vec2 uv = fragCoord.xy / u_dimensions.xy;

    vec4 vtot = vec4(0.0);
    vtot += u_color1 * brightness(uv, lightPosition(0.0, u_lightRotation, float(u_lightCount)), diffusionXY);
    vtot += u_color2 * brightness(uv, lightPosition(1.0, u_lightRotation, float(u_lightCount)), diffusionXY);
    if (u_lightCount >= 3) {
        vtot += u_color3 * brightness(uv, lightPosition(2.0, u_lightRotation, float(u_lightCount)), diffusionXY);
    }
    if (u_lightCount >= 4) {
        vtot += u_color4 * brightness(uv, lightPosition(3.0, u_lightRotation, float(u_lightCount)), diffusionXY);
    }
    if (u_lightCount >= 5) {
        vtot += u_color5 * brightness(uv, lightPosition(4.0, u_lightRotation, float(u_lightCount)), diffusionXY);
    }
    
    vec4 renderedColor = vtot + addNoise(uv);
    fragColor = black * (1.0 - renderedColor.w) + renderedColor * renderedColor.w;
    fragColor.w = 1.0;
}

void main() {
    render(gl_FragColor, gl_FragCoord.xy);
}
