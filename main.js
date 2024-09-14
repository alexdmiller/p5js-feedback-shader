let vertSource = `
precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;

void main() {
    // Apply the camera transform
    vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

    // Tell WebGL where the vertex goes
    gl_Position = uProjectionMatrix * viewModelPosition;  

    // Pass along data to the fragment shader
    vTexCoord = aTexCoord;
}
`;

let fragSource = `
precision highp float;

varying vec2 vTexCoord;

uniform sampler2D img;

void main() {
  gl_FragColor = texture2D(img, vTexCoord + vec2(sin(vTexCoord.y * 10.0) * 0.01, 0.0));
}
`;

let prev, next;
let feedbackShader;

function setup() {
    createCanvas(200, 200, WEBGL)
    prev = createFramebuffer();
    next = createFramebuffer();
    imageMode(CENTER);

    feedbackShader = createShader(vertSource, fragSource);
}

function draw() {
    // Swap prev and next
    [prev, next] = [next, prev];

    next.begin();

    clear();
    shader(feedbackShader);
    feedbackShader.setUniform('img', prev.color);

    noStroke();
    rect(-width / 2, -height / 2, width, height);

    translate(sin(frameCount * 0.1) * 50, sin(frameCount * 0.11) * 50);
    noStroke();
    normalMaterial();
    sphere(25);

    next.end();

    background(255);
    image(next, 0, 0);
}