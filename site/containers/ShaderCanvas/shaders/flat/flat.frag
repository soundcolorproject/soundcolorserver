
precision highp float;

const vec4 noiseSegments = vec4(541.0, 1223.0, 2741.0, 6133.0);
const vec4 multSegments = vec4(9733.0, 4409.0, 1987.0, 863.0);

float noise21t ( in vec2 p, in float t ) {
    return fract(sin(dot(p, noiseSegments.xy)) * (multSegments.x + t));
}

uniform float u_noise;
uniform float u_time;
uniform vec2 u_dimensions;
uniform vec4 u_color1;

vec4 multNoise( in vec2 uv ) {
    float noise = 1.0 - u_noise * noise21t(uv, u_time * 3.0);
    return vec4(1, 1, 1, noise);
}

void render( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / u_dimensions.xy;
    fragColor = u_color1 * multNoise(uv);
}

void main() {
    render(gl_FragColor, gl_FragCoord.xy);
}
