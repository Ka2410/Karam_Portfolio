(() => {
  const installedApp = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (!installedApp || !screen.orientation?.lock) return;
  const keepPortrait = () => screen.orientation.lock("portrait-primary").catch(() => {});
  keepPortrait();
  window.addEventListener("pageshow", keepPortrait);
})();

(() => {
  document.documentElement.classList.add("js");
  const revealGroups = [
    [".hero-social-links, .hero-developer", "soft"],
    [".about-main-photo, .about-small-photo", "media"],
    [".about-columns > *", "copy"],
    [".services-list .service-item", "row"],
    [".services-visual", "media"],
    [".ego-hero-copy, .kova-hero-copy", "copy"],
    [".ego-preview-shell, .kova-preview-shell", "media"],
    [".ego-stats > *, .kova-stats > *", "row"],
    [".ego-section-heading, .kova-section-heading", "heading"],
    [".ego-feature-card, .kova-menu-card, .kova-booking-card, .kova-gallery-card", "card"],
    [".ego-lookbook, .kova-atmosphere, .kova-visit", "media"],
    [".ego-project-footer, .kova-project-footer", "soft"],
  ];
  revealGroups.forEach(([selector, variant]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (!element.hasAttribute("data-reveal")) element.setAttribute("data-reveal", variant);
      element.style.setProperty("--reveal-delay", `${Math.min(index * 85, 340)}ms`);
    });
  });
  const sections = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, current) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        current.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  sections.forEach((section) => observer.observe(section));
})();

(() => {
  const header = document.querySelector(".angled-notch-header");
  const frame = header?.querySelector(".angled-notch-frame");
  if (!(header instanceof HTMLElement) || !(frame instanceof SVGElement)) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const infection = document.createElementNS(svgNS, "svg");
  infection.setAttribute("class", "desktop-venom-frame");
  infection.setAttribute("viewBox", "0 0 1680 520");
  infection.setAttribute("preserveAspectRatio", "none");
  infection.setAttribute("aria-hidden", "true");
  const outline = "M1016 -12 V50 C1016 87 1041 112 1078 112 H1511 C1543 112 1568 138 1568 170 V429 C1568 461 1591 480 1622 480 H1686";
  ["venom-nav-shadow", "venom-nav-core", "venom-nav-shimmer"].forEach((className) => {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("class", className);
    path.setAttribute("d", outline);
    infection.append(path);
  });
  frame.after(infection);
  header.querySelectorAll(".angled-notch-link").forEach((link) => {
    link.addEventListener("pointerenter", () => header.classList.add("is-venom-awake"));
    link.addEventListener("pointerleave", () => header.classList.remove("is-venom-awake"));
    link.addEventListener("focus", () => header.classList.add("is-venom-awake"));
    link.addEventListener("blur", () => header.classList.remove("is-venom-awake"));
  });
})();

(() => {
  const desktopOnly = window.matchMedia("(max-width: 620px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mascot = document.createElement("div");
  mascot.className = "venom-mascot";
  mascot.innerHTML = `<button class="venom-mascot__button" type="button" aria-label="Meet the symbiote visitor"><span class="venom-mascot__speech" aria-live="polite">You found me.</span><span class="venom-mascot__impact" aria-hidden="true">POOF!</span><canvas class="venom-mascot__canvas" aria-hidden="true"></canvas></button>`;
  document.body.append(mascot);
  const canvas = mascot.querySelector(".venom-mascot__canvas");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) { mascot.hidden = true; return; }

  const vertexSource = `attribute vec2 a_position; varying vec2 v_uv; void main(){ v_uv=a_position*.5+.5; gl_Position=vec4(a_position,0.0,1.0); }`;
  const fragmentSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_look;
    uniform float u_time;
    uniform float u_walk;
    float ellipsoid(vec3 p,vec3 r){float k0=length(p/r);float k1=max(length(p/(r*r)),.00001);return k0*(k0-1.0)/k1;}
    float capsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),.00001),0.0,1.0);return length(pa-ba*h)-r;}
    float smoothMin(float a,float b,float k){float h=max(k-abs(a-b),0.0)/k;return min(a,b)-h*h*k*.25;}
    vec2 scene(vec3 p){
      float phase=u_time*7.0;float bob=.022*abs(sin(phase*2.0))*u_walk;p.y-=bob;
      float head=ellipsoid(p-vec3(0.0,.51,0.0),vec3(.34,.37,.29));
      head=smoothMin(head,ellipsoid(p-vec3(0.0,.31,.035),vec3(.285,.22,.265)),.12);
      float body=smoothMin(head,ellipsoid(p-vec3(0.0,-.01,0.0),vec3(.255,.37,.22)),.13);
      body=smoothMin(body,ellipsoid(p-vec3(0.0,-.33,.005),vec3(.27,.22,.23)),.14);
      float limbs=body;
      for(int i=0;i<2;i++){
        float side=i==0?-1.0:1.0;float gait=phase*u_walk+(i==0?0.0:3.14159);float swing=sin(gait)*u_walk;float lift=max(0.0,cos(gait))*.13*u_walk;
        vec3 hip=vec3(side*.145,-.37,.02);vec3 knee=vec3(side*(.17+swing*.055),-.60+lift*.28,.04);vec3 ankle=vec3(side*(.16+swing*.14),-.86+lift,.075);vec3 toe=ankle+vec3(side*.09,-.015,.025);
        limbs=smoothMin(limbs,capsule(p,hip,knee,.085),.07);limbs=smoothMin(limbs,capsule(p,knee,ankle,.058),.05);limbs=smoothMin(limbs,capsule(p,ankle,toe,.054),.035);
        float armSwing=sin(gait+2.2)*u_walk;vec3 shoulder=vec3(side*.23,.22,.01);vec3 elbow=vec3(side*(.35+armSwing*.04),.02+armSwing*.035,.055);vec3 wrist=vec3(side*(.38-armSwing*.065),-.14+armSwing*.04,.09);
        limbs=smoothMin(limbs,capsule(p,shoulder,elbow,.072),.055);limbs=smoothMin(limbs,capsule(p,elbow,wrist,.052),.04);limbs=smoothMin(limbs,ellipsoid(p-wrist,vec3(.075,.065,.07)),.035);
      }
      float wave=sin(u_time*3.0);float tendril=99.0;
      tendril=min(tendril,capsule(p,vec3(-.25,.37,-.04),vec3(-.43,.52+wave*.045,.08),.027));tendril=min(tendril,capsule(p,vec3(-.43,.52+wave*.045,.08),vec3(-.60,.42+wave*.08,.13),.018));
      tendril=min(tendril,capsule(p,vec3(.25,.37,-.04),vec3(.43,.57-wave*.04,.08),.027));tendril=min(tendril,capsule(p,vec3(.43,.57-wave*.04,.08),vec3(.58,.48-wave*.08,.13),.018));
      tendril=min(tendril,capsule(p,vec3(-.31,.17,-.02),vec3(-.49,.08+wave*.06,.08),.022));tendril=min(tendril,capsule(p,vec3(.31,.17,-.02),vec3(.49,.08-wave*.06,.08),.022));
      vec2 result=vec2(min(limbs,tendril),1.0);
      float eyeL=ellipsoid(p-vec3(-.145+u_look.x*.035,.54+u_look.y*.025,.279),vec3(.135,.047,.027));float eyeR=ellipsoid(p-vec3(.145+u_look.x*.035,.54+u_look.y*.025,.279),vec3(.135,.047,.027));
      if(eyeL<result.x)result=vec2(eyeL,2.0);if(eyeR<result.x)result=vec2(eyeR,2.0);
      float mouth=ellipsoid(p-vec3(0.0,.255,.286),vec3(.19,.078,.034));if(mouth<result.x)result=vec2(mouth,3.0);
      float tongue=ellipsoid(p-vec3(0.0,.205,.312),vec3(.055,.029,.018));if(tongue<result.x)result=vec2(tongue,4.0);
      for(int i=0;i<5;i++){float x=(float(i)-2.0)*.064;float tooth=ellipsoid(p-vec3(x,.291-abs(x)*.09,.312),vec3(.022,.031,.018));if(tooth<result.x)result=vec2(tooth,2.0);}
      return result;
    }
    vec3 normalAt(vec3 p){vec2 e=vec2(.0015,0.0);return normalize(vec3(scene(p+e.xyy).x-scene(p-e.xyy).x,scene(p+e.yxy).x-scene(p-e.yxy).x,scene(p+e.yyx).x-scene(p-e.yyx).x));}
    float hash3(vec3 p){p=fract(p*.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
    void main(){
      vec2 q=(v_uv-.5)*vec2(1.8,2.35);vec3 ro=vec3(q.x,q.y,3.8);vec3 rd=vec3(0.0,0.0,-1.0);float t=0.0;float material=1.0;bool hit=false;vec3 pos=ro;
      for(int i=0;i<68;i++){pos=ro+rd*t;vec2 h=scene(pos);if(h.x<.0018){material=h.y;hit=true;break;}t+=max(h.x*.82,.001);if(t>6.0)break;}
      if(!hit){gl_FragColor=vec4(0.0);return;}
      vec3 n=normalAt(pos);vec3 view=normalize(ro-pos);vec3 key=normalize(vec3(-.48,.78,.55));vec3 fill=normalize(vec3(.76,.18,.45));
      float diffuse=max(dot(n,key),0.0)*.24+max(dot(n,fill),0.0)*.08;float spec=pow(max(dot(reflect(-key,n),view),0.0),88.0)*.85;float broadSpec=pow(max(dot(reflect(-fill,n),view),0.0),24.0)*.15;float fresnel=pow(1.0-max(dot(n,view),0.0),2.5);float grain=hash3(floor(pos*170.0))-.5;
      vec3 color;if(material>1.5&&material<2.5){color=vec3(.88,.87,.84);color*=.75+max(dot(n,key),0.0)*.35;}else if(material>2.5&&material<3.5){color=vec3(.008,.004,.006);}else if(material>3.5){color=vec3(.42,.035,.045);}else{color=vec3(.012,.010,.012)+vec3(.13,.09,.075)*diffuse+vec3(.82,.71,.62)*spec+vec3(.34,.17,.12)*broadSpec+vec3(.39,.12,.055)*fresnel*.78;color+=grain*.006;}
      float alpha=material>1.5&&material<2.5?.98:1.0;color=pow(max(color,0.0),vec3(.78));gl_FragColor=vec4(color*alpha,alpha);
    }`;

  const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;};
  const vs=compile(gl.VERTEX_SHADER,vertexSource);const fs=compile(gl.FRAGMENT_SHADER,fragmentSource);if(!vs||!fs){mascot.hidden=true;return;}
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){mascot.hidden=true;return;}gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const time=gl.getUniformLocation(program,"u_time"),look=gl.getUniformLocation(program,"u_look"),walk=gl.getUniformLocation(program,"u_walk");canvas.width=176;canvas.height=192;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  let simTime = 0;
  let previous=0,eyeX=0,eyeY=0,walkAmount=0;
  const draw=(now)=>{if(!document.hidden&&now-previous>30){const dt=Math.min((now-previous)/1000,.05);previous=now;if(!reducedMotion&&mascot.classList.contains("is-playing"))simTime+=dt;gl.uniform1f(time,simTime);gl.uniform2f(look,eyeX,eyeY);gl.uniform1f(walk,walkAmount);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}requestAnimationFrame(draw);};requestAnimationFrame(draw);

  const button=mascot.querySelector(".venom-mascot__button");
  button.setAttribute("tabindex","-1");
  button.setAttribute("aria-hidden","true");
  button.style.pointerEvents="none";
  mascot.style.setProperty("--venom-x","0px");
  const path=window.location.pathname.toLowerCase();
  const pageName=document.body.classList.contains("home-page")?"HOME"
    :document.body.classList.contains("about-page")||/about(?:\.html)?$/.test(path)?"ABOUT"
    :document.body.classList.contains("services-page")||/services(?:\.html)?$/.test(path)?"SERVICES"
    :document.body.classList.contains("contact-page")||/contact(?:\.html)?$/.test(path)?"CONTACT"
    :document.body.classList.contains("ego-case-page")?"PROJECT 01 · EGO"
    :document.body.classList.contains("kova-case-page")?"PROJECT 02 · KOVA"
    :document.body.classList.contains("megawrat-case-page")?"PROJECT 03 · MEGAWRAT":"PORTFOLIO";
  mascot.querySelector(".venom-mascot__speech").textContent=pageName;
  mascot.classList.add("is-speaking");
  window.setTimeout(()=>mascot.classList.remove("is-speaking"),3200);
  const playMoves=["is-hopping","is-peeking","is-spinning","is-tentacle-dance"];
  let playTimer=0,lastTargetReaction=0,lastHop=0;
  const play=(move)=>{if(reducedMotion||document.hidden)return;mascot.classList.add("is-playing",move);window.setTimeout(()=>{mascot.classList.remove(move);if(!playMoves.some((name)=>mascot.classList.contains(name)))mascot.classList.remove("is-playing");},move==="is-spinning"?900:760);};
  const schedulePlay=()=>{playTimer=window.setTimeout(()=>{if(!document.hidden)play(playMoves[Math.floor(Math.random()*playMoves.length)]);schedulePlay();},4200+Math.random()*3300);};
  schedulePlay();
  document.addEventListener("pointermove",(event)=>{if(event.pointerType!=="mouse")return;const rect=button.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),distance=Math.hypot(dx,dy);if(distance<190){eyeX=Math.max(-1,Math.min(1,dx/120));eyeY=Math.max(-1,Math.min(1,-dy/110));mascot.classList.add("is-alert");if(distance<95&&Date.now()-lastHop>2600){lastHop=Date.now();play("is-hopping");}}else{eyeX=0;eyeY=0;mascot.classList.remove("is-alert");}});
  document.addEventListener("pointerover",(event)=>{if(!(event.target instanceof Element))return;const target=event.target.closest(".whatsapp-float, .hero-social-whatsapp, .hero-image-wrap img, .photo-frame img, .services-visual img, .contact-profile-photo, .contact-profile-card, .ego-preview-shell, .kova-preview-shell, .megawrat-mascot__media");if(!target||Date.now()-lastTargetReaction<1800)return;lastTargetReaction=Date.now();const r=target.getBoundingClientRect(),m=button.getBoundingClientRect();eyeX=Math.max(-1,Math.min(1,((r.left+r.width/2)-(m.left+m.width/2))/Math.max(innerWidth*.3,100)));eyeY=Math.max(-1,Math.min(1,-((r.top+r.height/2)-(m.top+m.height/2))/Math.max(innerHeight*.25,100)));mascot.classList.add("is-curious");play("is-hopping");window.setTimeout(()=>mascot.classList.remove("is-curious"),1200);});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){window.clearTimeout(playTimer);mascot.classList.remove("is-playing",...playMoves);}else schedulePlay();});
})();
(() => {
  const group = document.querySelector(".home-page .hero-title-group");
  if (!(group instanceof HTMLElement)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const glitch = () => {
    if (document.hidden || !group.isConnected) return;
    group.classList.remove("is-glitching");
    void group.offsetWidth;
    group.classList.add("is-glitching");
    window.setTimeout(() => group.classList.remove("is-glitching"), 520);
  };
  window.setTimeout(glitch, 1350);
  window.setInterval(glitch, 6500);
})();

(() => {
  const title = document.querySelector(".ego-original-title");
  if (!(title instanceof HTMLElement)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const revealMask = document.createElement("span");
  revealMask.className = "ego-title-reveal-mask";
  const revealText = document.createElement("span");
  revealText.innerHTML = title.innerHTML;
  revealMask.append(revealText);
  title.replaceChildren(revealMask);

  if (!("IntersectionObserver" in window)) {
    revealMask.classList.add("is-revealed");
  } else {
    const revealObserver = new IntersectionObserver(([entry]) => {
      revealMask.classList.toggle("is-revealed", entry.isIntersecting);
    }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
    revealObserver.observe(revealMask);
  }

  title.classList.add("glitch");
  const glitchOnce = () => {
    if (document.hidden || !title.isConnected) return;
    title.classList.add("is-glitching");
    window.setTimeout(() => title.classList.remove("is-glitching"), 520);
  };
  glitchOnce();
  window.setInterval(glitchOnce, 6500);
})();

(() => {
  const trigger = document.querySelector("[data-venom-trigger]");
  if (!(trigger instanceof HTMLElement)) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const mobileOrbit = document.createElement("span");
  mobileOrbit.className = "symbiote-mobile-orbit";
  mobileOrbit.setAttribute("aria-hidden", "true");
  mobileOrbit.innerHTML = '<svg viewBox="0 0 100 56" preserveAspectRatio="none"><rect x="2" y="2" width="96" height="52" rx="12" pathLength="1000"/></svg>';
  trigger.prepend(mobileOrbit);

  let restingFace = trigger.querySelector(".venom-idle, .symbiote-resting");
  if (!restingFace) {
    restingFace = document.createElement("span");
    restingFace.setAttribute("aria-hidden", "true");
    const arrow = trigger.querySelector("span:last-child");
    if (arrow) trigger.insertBefore(restingFace, arrow);
    else trigger.append(restingFace);
  }
  restingFace.classList.remove("venom-idle");
  restingFace.classList.add("symbiote-resting");
  {
    const faceSvg = document.createElementNS(svgNS, "svg");
    faceSvg.setAttribute("viewBox", "0 0 64 48");
    faceSvg.setAttribute("aria-hidden", "true");
    faceSvg.innerHTML = '<defs><linearGradient id="symbiote-skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#383535"/><stop offset=".38" stop-color="#111"/><stop offset="1" stop-color="#030303"/></linearGradient><linearGradient id="symbiote-shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".86"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path class="symbiote-face-body" d="M5 25C3 14 11 5 23 4c5-4 12-2 16 2 11-1 19 7 19 17 4 9-3 18-12 20-8 5-18 2-24 1C11 43 4 35 5 25Z" fill="url(#symbiote-skin)" stroke="#4a4544" stroke-width="1.2"/><path class="symbiote-face-gloss" d="M12 15C17 7 23 7 28 8" fill="none" stroke="url(#symbiote-shine)" stroke-width="2" stroke-linecap="round"/><g class="symbiote-eyes"><path d="M10 20c5-7 12-9 21-6-4 7-12 10-21 9Z" fill="#f5f4f1"/><path d="M36 14c8-3 14 0 18 6-7 4-15 3-20-1Z" fill="#f5f4f1"/></g><path d="M17 30c9-4 22-4 32 0l-5 8c-8-3-15-3-23 0Z" fill="#080707" stroke="#5b2420" stroke-width=".8"/><path d="m20 31 5-1 2 5-5-.5Zm8-1 5-.4 1 5h-5Zm8 .1 5 .4-1 4-4-.8Z" fill="#f5f4f1"/><path d="M3 26C0 19 4 16 1 12m58 10c5-6 3-10 5-13" fill="none" stroke="#171515" stroke-width="3" stroke-linecap="round"/>';
    restingFace.replaceChildren(faceSvg);
  }
  const faceEyes = restingFace?.querySelector(".symbiote-eyes");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const web = document.createElementNS(svgNS, "svg");
  web.classList.add("venom-cursor-web");
  web.setAttribute("aria-hidden", "true");
  web.setAttribute("preserveAspectRatio", "none");
  const syncWebViewport = () => web.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  syncWebViewport();
  window.addEventListener("resize", syncWebViewport);
  const strandCount = 28;
  const strands = Array.from({ length: strandCount }, () => {
    const shadow = document.createElementNS(svgNS, "path");
    const core = document.createElementNS(svgNS, "path");
    const gloss = document.createElementNS(svgNS, "path");
    shadow.classList.add("symbiote-tendril-shadow");
    core.classList.add("symbiote-tendril-core");
    gloss.classList.add("symbiote-tendril-gloss");
    web.append(shadow, core, gloss);
    return { shadow, core, gloss };
  });
  const branches = Array.from({ length: 12 }, () => {
    const branch = document.createElementNS(svgNS, "path");
    const gloss = document.createElementNS(svgNS, "path");
    branch.classList.add("symbiote-branch");
    gloss.classList.add("symbiote-branch-gloss");
    web.append(branch, gloss);
    return { branch, gloss };
  });
  const strandPoints = new Array(strandCount);
  const grab = document.createElementNS(svgNS, "path");
  grab.classList.add("symbiote-grab");
  const glint = document.createElementNS(svgNS, "path");
  glint.classList.add("symbiote-grab-glint");
  web.append(grab, glint);
  document.body.append(web);

  let pointerX = 0;
  let pointerY = 0;
  let animationFrame = 0;
  let retractState = null;
  let active = false;
  const reach = 230;
  const mobileViewport = window.matchMedia("(max-width: 620px)");

  const hideWeb = () => {
    active = false;
    retractState = null;
    web.classList.remove("is-active");
    web.style.removeProperty("opacity");
    trigger.classList.remove("is-symbiote-awake");
    if (faceEyes) faceEyes.style.transform = "";
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const draw = (time) => {
    animationFrame = 0;
    const rect = trigger.getBoundingClientRect();
    const nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
    const nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
    const dx = pointerX - nearestX;
    const dy = pointerY - nearestY;
    const distance = Math.hypot(dx, dy);
    if (!trigger.isConnected) {
      hideWeb();
      return;
    }

    if (distance > reach && !retractState) {
      if (!active) {
        hideWeb();
        return;
      }
      retractState = {
        started: time,
        fromX: pointerX,
        fromY: pointerY,
        toX: nearestX,
        toY: nearestY,
        opacity: Math.min(1, .2 + Math.max(0, 1 - distance / reach) * .9),
      };
    }

    let cursorX = pointerX;
    let cursorY = pointerY;
    let retractProgress = 0;
    if (retractState) {
      const linearProgress = Math.min(1, (time - retractState.started) / 300);
      retractProgress = 1 - Math.pow(1 - linearProgress, 3);
      cursorX = retractState.fromX + (retractState.toX - retractState.fromX) * retractProgress;
      cursorY = retractState.fromY + (retractState.toY - retractState.fromY) * retractProgress;
      if (linearProgress >= 1) {
        retractState = null;
        hideWeb();
        return;
      }
    }

    active = true;
    web.classList.add("is-active");
    trigger.classList.add("is-symbiote-awake");
    const proximityOpacity = Math.min(1, .2 + Math.max(0, 1 - distance / reach) * .9);
    web.style.opacity = String(retractState ? retractState.opacity * (1 - retractProgress) : proximityOpacity);
    const directionX = pointerX - (rect.left + rect.width / 2);
    const directionY = pointerY - (rect.top + rect.height / 2);
    if (faceEyes) {
      const directionLength = Math.max(1, Math.hypot(directionX, directionY));
      faceEyes.style.transform = `translate(${directionX / directionLength * 2}px, ${directionY / directionLength * 1.5}px)`;
    }
    const intensity = retractState
      ? Math.max(0, (retractState.opacity - .2) / .9 * (1 - retractProgress))
      : Math.max(0, Math.min(1, 1 - distance / reach));
    const anchors = strands.map((_, index) => {
      const side = index % 4;
      const position = (Math.floor(index / 4) + 1) / 8;
      const inset = 7;
      if (side === 0) return { x: rect.left + rect.width * position, y: rect.top + inset, side };
      if (side === 1) return { x: rect.right - inset, y: rect.top + rect.height * position, side };
      if (side === 2) return { x: rect.right - rect.width * position, y: rect.bottom - inset, side };
      return { x: rect.left + inset, y: rect.bottom - rect.height * position, side };
    });
    strands.forEach(({ shadow, core, gloss }, index) => {
      const anchor = anchors[index];
      const vx = cursorX - anchor.x;
      const vy = cursorY - anchor.y;
      const length = Math.max(1, Math.hypot(vx, vy));
      const nx = -vy / length;
      const ny = vx / length;
      const wrapAngle = (index / strandCount) * Math.PI * 2 + Math.sin(time / 260 + index * 1.7) * .12;
      const tipRadius = 4 + Math.sin(time / 180 + index) * 1.2;
      const endX = cursorX + Math.cos(wrapAngle) * tipRadius;
      const endY = cursorY + Math.sin(wrapAngle) * tipRadius;
      const bend = Math.sin(time / 150 + index * 1.3) * (3 + intensity * 3);
      const c1x = anchor.x + vx * .32 + nx * bend;
      const c1y = anchor.y + vy * .32 + ny * bend;
      const c2x = endX - vx * .12 - nx * bend * .45;
      const c2y = endY - vy * .12 - ny * bend * .45;
      const d = `M ${anchor.x} ${anchor.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
      strandPoints[index] = { anchorX: anchor.x, anchorY: anchor.y, endX, endY };
      shadow.setAttribute("d", d);
      core.setAttribute("d", d);
      gloss.setAttribute("d", `M ${anchor.x + nx * 1} ${anchor.y + ny * 1} C ${c1x + nx} ${c1y + ny}, ${c2x + nx} ${c2y + ny}, ${endX} ${endY}`);
    });

    branches.forEach(({ branch, gloss }, index) => {
      const points = strandPoints[index * 2 + 1];
      const startX = points.anchorX + (points.endX - points.anchorX) * .78;
      const startY = points.anchorY + (points.endY - points.anchorY) * .78;
      const branchAngle = (index / branches.length) * Math.PI * 2 + Math.sin(time / 220 + index) * .18;
      const branchRadius = 6 + (index % 3) * 1.2;
      const endX = cursorX + Math.cos(branchAngle) * branchRadius;
      const endY = cursorY + Math.sin(branchAngle) * branchRadius;
      const bend = Math.sin(time / 170 + index) * 2.5 + Math.cos(branchAngle) * 2;
      const d = `M ${startX} ${startY} Q ${startX + bend} ${startY - bend}, ${endX} ${endY}`;
      branch.setAttribute("d", d);
      gloss.setAttribute("d", `M ${startX} ${startY - .7} Q ${startX + bend} ${startY - bend - .7}, ${endX} ${endY}`);
    });

    grab.setAttribute("d", `M ${cursorX - 9} ${cursorY - 1} C ${cursorX - 13} ${cursorY - 7}, ${cursorX - 6} ${cursorY - 13}, ${cursorX - 1} ${cursorY - 9} C ${cursorX + 5} ${cursorY - 14}, ${cursorX + 13} ${cursorY - 7}, ${cursorX + 9} ${cursorY - 2} C ${cursorX + 14} ${cursorY + 4}, ${cursorX + 7} ${cursorY + 12}, ${cursorX + 2} ${cursorY + 8} C ${cursorX - 4} ${cursorY + 14}, ${cursorX - 12} ${cursorY + 7}, ${cursorX - 8} ${cursorY + 2} C ${cursorX - 11} ${cursorY + 1}, ${cursorX - 12} ${cursorY}, ${cursorX - 9} ${cursorY - 1} Z`);
    glint.setAttribute("d", `M ${cursorX - 6} ${cursorY - 5} Q ${cursorX - 3} ${cursorY - 10}, ${cursorX + 1} ${cursorY - 7}`);
    if (active) animationFrame = window.requestAnimationFrame(draw);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || mobileViewport.matches) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    const rect = trigger.getBoundingClientRect();
    const nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
    const nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
    if (Math.hypot(pointerX - nearestX, pointerY - nearestY) <= reach) retractState = null;
    if (!animationFrame) animationFrame = window.requestAnimationFrame(draw);
  });
  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget === null) hideWeb();
  });
  document.addEventListener("pointerleave", hideWeb);
  window.addEventListener("blur", hideWeb);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideWeb();
  });
})();

(() => {
  const warning = "Karam Rabie's personal portfolio — please respect the work. Developer tools are not permitted here.";
  console.info(`%c${warning}`, "color:#e72427;font-size:14px;font-weight:bold;padding:8px 0;");

  const isPortfolioImage = (target) => target instanceof Element && Boolean(target.closest("img, picture"));
  document.querySelectorAll("img").forEach((image) => image.setAttribute("draggable", "false"));
  document.addEventListener("contextmenu", (event) => {
    if (isPortfolioImage(event.target) || (event.target instanceof Element && event.target.closest("[data-contact-card]"))) {
      event.preventDefault();
    }
  });
  document.addEventListener("dragstart", (event) => {
    if (isPortfolioImage(event.target) || (event.target instanceof Element && event.target.closest("[data-contact-card]"))) {
      event.preventDefault();
    }
  });

  let notice;
  let hideTimer;
  const hideNotice = () => {
    if (!notice) return;
    window.clearTimeout(hideTimer);
    notice.classList.remove("is-visible");
    notice.hidden = true;
  };
  const showNotice = (keepOpen = false) => {
    notice.classList.add("is-visible");
    notice.hidden = false;
    notice.querySelector("button").focus({ preventScroll: true });
    window.clearTimeout(hideTimer);
    if (!keepOpen) hideTimer = window.setTimeout(hideNotice, 5000);
  };

  notice = document.createElement("aside");
  notice.id = "karam-rabie-portfolio-note";
  notice.className = "portfolio-devtools-notice";
  notice.hidden = true;
  notice.dataset.ownerNote = "Karam Rabie — personal portfolio, designed around the homepage identity.";
  notice.setAttribute("role", "alertdialog");
  notice.setAttribute("aria-modal", "true");
  notice.setAttribute("aria-label", "Karam Rabie's personal portfolio notice");
  notice.innerHTML = '<div class="portfolio-devtools-notice__card"><span class="portfolio-devtools-notice__eyebrow">PERSONAL PORTFOLIO · 2026</span><p class="portfolio-devtools-notice__intro">IT’S MY</p><strong class="portfolio-devtools-notice__title">PORTFOLIO</strong><p class="portfolio-devtools-notice__name">Karam Rabie</p><span class="portfolio-devtools-notice__rule" aria-hidden="true"></span><p class="portfolio-devtools-notice__message">Designed and built by Karam Rabie.<br>Developer tools are not permitted here.<br>Please respect the work.</p><button type="button">GOT IT <span aria-hidden="true">↗</span></button></div>';
  notice.querySelector("button").addEventListener("click", hideNotice);
  document.body.append(notice);

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const devtoolsShortcut = event.key === "F12" || (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key));
    if (!devtoolsShortcut) return;
    showNotice();
  }, true);

  // Browsers expose no DevTools-open event; viewport changes provide a best-effort signal for a docked panel.
  let devtoolsDetected = false;
  let detectionTimer;
  const detectDockedDevtools = () => {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    const isDocked = (window.outerWidth >= 900 && widthGap > 280)
      || (window.outerHeight >= 700 && heightGap > 260);

    if (isDocked && !devtoolsDetected) {
      devtoolsDetected = true;
      showNotice(true);
    } else if (!isDocked && devtoolsDetected) {
      devtoolsDetected = false;
      hideNotice();
    }
  };
  window.addEventListener("resize", () => {
    window.clearTimeout(detectionTimer);
    detectionTimer = window.setTimeout(detectDockedDevtools, 250);
  });
  window.setTimeout(detectDockedDevtools, 700);
})();

(() => {
  const serviceNumbers = document.querySelectorAll(".services-list .service-item > b");
  if (!serviceNumbers.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  serviceNumbers[activeIndex].classList.add("is-active");

  if (prefersReducedMotion) return;

  window.setInterval(() => {
    if (document.hidden) return;

    serviceNumbers[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % serviceNumbers.length;
    serviceNumbers[activeIndex].classList.add("is-active");
  }, 1000);
})();

(() => {
  const heroVisual = document.querySelector(".hero-visual");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!heroVisual || prefersReducedMotion) return;

  window.setInterval(() => {
    heroVisual.dataset.scribblesHidden = "true";
    window.setTimeout(() => {
      const nextPosition = heroVisual.dataset.scribblePosition === "alternate" ? "default" : "alternate";
      heroVisual.dataset.scribblePosition = nextPosition;
      delete heroVisual.dataset.scribblesHidden;
    }, 180);
  }, 1000);
})();

(() => {
  const card = document.querySelector("[data-contact-card]");
  const inner = card?.querySelector("[data-contact-card-inner]");
  if (!(card instanceof HTMLElement) || !(inner instanceof HTMLElement)) return;

  let pointerId = null;
  let lastX = 0;
  let lastY = 0;
  let rotationX = 0;
  let rotationY = 0;
  let rotationFrame = 0;

  const paintRotation = () => {
    rotationFrame = 0;
    inner.style.transform = `translateZ(0) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const resetCard = (event) => {
    if (pointerId === null || (event && event.pointerId !== pointerId)) return;
    try { if (card.hasPointerCapture(pointerId)) card.releasePointerCapture(pointerId); } catch {}
    if (rotationFrame) window.cancelAnimationFrame(rotationFrame);
    rotationFrame = 0;
    pointerId = null;
    card.classList.remove("is-dragging");
    card.classList.add("is-returning");
    card.setAttribute("aria-grabbed", "false");
    inner.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
    window.setTimeout(() => card.classList.remove("is-returning"), 800);
  };

  card.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("a, button, input, textarea, select")) return;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    rotationX = 0;
    rotationY = 0;
    card.classList.remove("is-returning");
    card.classList.add("is-dragging");
    card.setAttribute("aria-grabbed", "true");
    try { card.setPointerCapture(pointerId); } catch {}
  });

  card.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    rotationY = (rotationY + (event.clientX - lastX) * .85) % 360;
    rotationX = (rotationX - (event.clientY - lastY) * .65) % 360;
    lastX = event.clientX;
    lastY = event.clientY;
    if (!rotationFrame) rotationFrame = window.requestAnimationFrame(paintRotation);
  });

  card.addEventListener("pointerup", resetCard);
  card.addEventListener("pointercancel", resetCard);
  card.addEventListener("lostpointercapture", resetCard);
})();

(() => {
  const frame = document.querySelector("[data-megawrat-mascot]");
  if (!frame) return;

  const video = frame.querySelector(".megawrat-mascot__video");
  const image = frame.querySelector(".megawrat-mascot__image");
  if (!(video instanceof HTMLVideoElement) || !(image instanceof HTMLImageElement)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const safari = /Safari/i.test(navigator.userAgent) && !/(Chrome|Chromium|Edg|OPR|Android)/i.test(navigator.userAgent);
  const canPlayTransparentWebm = Boolean(video.canPlayType("video/webm; codecs=vp9")) && !safari;

  if (reducedMotion) return;

  if (!canPlayTransparentWebm) {
    image.src = "./assets/megawrat-mascot.webp";
    return;
  }

  video.src = video.dataset.src;
  video.style.display = "block";
  image.style.display = "none";
  video.play().catch(() => {
    video.style.display = "none";
    image.style.display = "block";
    image.src = "./assets/megawrat-mascot.webp";
  });
})();



(() => {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  // Cache pages and images silently so repeat visits are ready without a status banner.
  navigator.serviceWorker.register("./sw.js").catch(() => {});
})();
