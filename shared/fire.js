/* ============================================================
   Commune Hearth — Fire Component
   Injects the hand-drawn animated fire SVG into any container.
   Theme colours are driven by CSS vars set by theme.js.
   ============================================================ */

const FIRE_SVG = `
<svg width="100%" viewBox="0 0 260 300" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Commune Hearth fire</title>
  <desc>Hand-drawn animated flame — the heart of your hearth</desc>
  <defs>
    <filter id="ch-ruf">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="5" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <style>
      .ch-fo { fill: var(--fire-core);   opacity: 0.92; }
      .ch-fm { fill: var(--fire-mid);    opacity: 0.88; }
      .ch-fi { fill: var(--fire-bright); opacity: 0.85; }
      .ch-ft { fill: var(--fire-top);    opacity: 0.72; }
      .ch-eg { fill: var(--fire-bright); }
      .ch-eb { fill: var(--fire-mid);    }
      .ch-sk { stroke: var(--fire-core); stroke-width: 1; fill: none; opacity: 0.28; stroke-linecap: round; stroke-dasharray: 4,3; }
      .ch-lg { fill: var(--bg3); stroke: var(--bg2); stroke-width: 1.5; }
      .ch-lgv{ stroke: var(--fire-core); stroke-width: 0.8; fill: none; opacity: 0.35; }
      .ch-gl { fill: var(--fire-core); }

      @keyframes ch-sway {
        0%   { transform: rotate(-3.5deg); }
        25%  { transform: rotate(2.5deg);  }
        50%  { transform: rotate(-2deg);   }
        75%  { transform: rotate(3.5deg);  }
        100% { transform: rotate(-3.5deg); }
      }
      @keyframes ch-m5 {
        0%,100% { d: path("M130,222 C98,214 64,192 70,162 C76,132 106,116 130,92 C154,116 184,132 190,162 C196,192 162,214 130,222Z"); }
        50%     { d: path("M130,220 C100,212 68,190 74,160 C80,130 108,114 130,90 C152,114 182,130 186,160 C190,190 160,212 130,220Z"); }
      }
      @keyframes ch-m4 {
        0%,100% { d: path("M130,178 C106,168 80,150 86,124 C92,98 114,84 130,64 C146,84 168,98 174,124 C180,150 154,168 130,178Z"); }
        50%     { d: path("M130,176 C108,166 82,148 88,122 C94,96 115,82 130,62 C145,82 166,96 172,122 C178,148 152,166 130,176Z"); }
      }
      @keyframes ch-m3 {
        0%,100% { d: path("M130,140 C112,130 92,116 96,96 C100,76 118,64 130,48 C142,64 160,76 164,96 C168,116 148,130 130,140Z"); }
        50%     { d: path("M130,138 C114,128 94,114 98,94 C102,74 119,62 130,46 C141,62 158,74 162,94 C166,114 146,128 130,138Z"); }
      }
      @keyframes ch-m2 {
        0%,100% { d: path("M130,102 C118,92 104,80 108,64 C112,48 124,38 130,24 C136,38 148,48 152,64 C156,80 142,92 130,102Z"); }
        50%     { d: path("M130,100 C120,90 106,78 110,62 C114,46 125,36 130,22 C135,36 146,46 150,62 C154,78 140,90 130,100Z"); }
      }
      @keyframes ch-m1 {
        0%,100% { d: path("M130,72 C122,62 114,52 118,40 C122,28 128,20 130,10 C132,20 138,28 142,40 C146,52 138,62 130,72Z"); }
        50%     { d: path("M130,70 C123,60 115,50 119,38 C123,26 128,18 130,8 C132,18 137,28 141,38 C145,50 137,60 130,70Z"); }
      }
      @keyframes ch-e1 { 0%{cx:112;cy:210;opacity:0;r:2.5} 15%{opacity:.9} 100%{cx:92; cy:115;opacity:0;r:1} }
      @keyframes ch-e2 { 0%{cx:148;cy:208;opacity:0;r:2}   12%{opacity:.8} 100%{cx:165;cy:105;opacity:0;r:1} }
      @keyframes ch-e3 { 0%{cx:126;cy:212;opacity:0;r:1.8} 18%{opacity:.7} 100%{cx:108;cy:120;opacity:0;r:.8} }
      @keyframes ch-e4 { 0%{cx:152;cy:206;opacity:0;r:2.5} 10%{opacity:.85}100%{cx:170;cy:108;opacity:0;r:1} }
      @keyframes ch-e5 { 0%{cx:130;cy:210;opacity:0;r:2}   14%{opacity:.75}100%{cx:114;cy:100;opacity:0;r:.8} }
      @keyframes ch-gs { 0%{transform:translateX(-8px);opacity:.15} 25%{transform:translateX(6px);opacity:.20} 50%{transform:translateX(-5px);opacity:.16} 75%{transform:translateX(8px);opacity:.21} 100%{transform:translateX(-8px);opacity:.15} }

      .ch-af5 { transform-origin:130px 230px; animation: ch-sway 2.6s ease-in-out infinite,       ch-m5 3.4s ease-in-out infinite; }
      .ch-af4 { transform-origin:130px 230px; animation: ch-sway 2.6s ease-in-out infinite 0.05s, ch-m4 3.0s ease-in-out infinite; }
      .ch-af3 { transform-origin:130px 230px; animation: ch-sway 2.6s ease-in-out infinite 0.10s, ch-m3 2.6s ease-in-out infinite; }
      .ch-af2 { transform-origin:130px 230px; animation: ch-sway 2.6s ease-in-out infinite 0.15s, ch-m2 2.2s ease-in-out infinite; }
      .ch-af1 { transform-origin:130px 230px; animation: ch-sway 2.6s ease-in-out infinite 0.20s, ch-m1 1.8s ease-in-out infinite; }
      .ch-ae1 { animation: ch-e1 2.8s ease-out infinite 0.4s; }
      .ch-ae2 { animation: ch-e2 3.2s ease-out infinite 1.1s; }
      .ch-ae3 { animation: ch-e3 2.5s ease-out infinite 1.9s; }
      .ch-ae4 { animation: ch-e4 3.5s ease-out infinite 0.7s; }
      .ch-ae5 { animation: ch-e5 2.9s ease-out infinite 2.3s; }
      .ch-ags  { animation: ch-gs 2.6s ease-in-out infinite; }
      .ch-ags2 { animation: ch-gs 2.6s ease-in-out infinite 0.5s; }
    </style>
  </defs>

  <ellipse class="ch-gl ch-ags"  cx="130" cy="255" rx="90" ry="14" opacity="0.15"/>
  <ellipse class="ch-gl ch-ags2" cx="130" cy="255" rx="55" ry="8"  opacity="0.13"/>

  <path class="ch-fo ch-af5" d="M130,222 C98,214 64,192 70,162 C76,132 106,116 130,92 C154,116 184,132 190,162 C196,192 162,214 130,222Z" filter="url(#ch-ruf)"/>
  <path class="ch-fm ch-af4" d="M130,178 C106,168 80,150 86,124 C92,98 114,84 130,64 C146,84 168,98 174,124 C180,150 154,168 130,178Z" filter="url(#ch-ruf)"/>
  <path class="ch-fi ch-af3" d="M130,140 C112,130 92,116 96,96 C100,76 118,64 130,48 C142,64 160,76 164,96 C168,116 148,130 130,140Z" filter="url(#ch-ruf)"/>
  <path class="ch-fm ch-af2" d="M130,102 C118,92 104,80 108,64 C112,48 124,38 130,24 C136,38 148,48 152,64 C156,80 142,92 130,102Z" filter="url(#ch-ruf)"/>
  <path class="ch-ft ch-af1" d="M130,72  C122,62 114,52 118,40 C122,28 128,20 130,10 C132,20 138,28 142,40 C146,52 138,62 130,72Z"  filter="url(#ch-ruf)"/>

  <path class="ch-sk" d="M118,40 C122,28 128,22 130,12 C132,22 136,28 138,38"/>
  <path class="ch-sk" d="M96,96  C100,78 112,66 120,56"/>
  <path class="ch-sk" d="M164,96 C160,80 150,68 142,58"/>
  <path class="ch-sk" d="M70,162 C74,140 90,124 102,110"/>
  <path class="ch-sk" d="M190,162 C186,142 172,126 160,112"/>

  <circle class="ch-eg ch-ae1" r="2.5"/>
  <circle class="ch-eb ch-ae2" r="2"/>
  <circle class="ch-eg ch-ae3" r="1.8"/>
  <circle class="ch-eb ch-ae4" r="2.5"/>
  <circle class="ch-eg ch-ae5" r="2"/>

  <rect class="ch-lg" x="52"  y="232" width="140" height="22" rx="11" transform="rotate(-7,122,243)" filter="url(#ch-ruf)"/>
  <path class="ch-lgv" d="M68,236 C82,232 100,238 116,234 C132,230 148,236 160,232" transform="rotate(-7,122,243)"/>
  <rect class="ch-lg" x="68"  y="235" width="140" height="22" rx="11" transform="rotate(6,138,246)"  filter="url(#ch-ruf)"/>
  <path class="ch-lgv" d="M82,240 C98,236 118,242 134,238 C150,234 164,240 176,236" transform="rotate(6,138,246)"/>

  <ellipse class="ch-eb" cx="116" cy="230" rx="7"  ry="4"  opacity="0.55"/>
  <ellipse class="ch-eg" cx="144" cy="228" rx="5"  ry="3"  opacity="0.5"/>
  <ellipse class="ch-eb" cx="130" cy="226" rx="4"  ry="2.5"opacity="0.5"/>
</svg>`;

function mountFire(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = FIRE_SVG;
}

window.FIRE_SVG  = FIRE_SVG;
window.mountFire = mountFire;
