export function streamScreen(){return `<div class="product-screen stream-screen" aria-hidden="true"><div class="screen-toolbar"><span class="screen-mark">sh.</span><span>StreamHub</span><span class="screen-preview">INTERFACE CONCEPT</span></div><div class="stream-room-header"><div><small>PRIVATE SCREEN SHARING</small><h4>A room for your people.</h4></div><span>INVITE ONLY</span></div><div class="stream-video"><div class="stream-scene-grid"></div><div class="stream-shared-window"><div><i></i><i></i><i></i><span>Shared workspace</span></div><pre><span>const</span> room = <span>await</span> connect();

<span>await</span> room.share({
  source: <em>'screen'</em>,
  transport: <em>'WebRTC'</em>
});</pre></div><span class="stream-video-label">SCREEN PREVIEW / DEMO</span></div><div class="stream-connection"><span>HOST</span><i></i><b>WebRTC</b><i></i><span>VIEWERS</span></div><div class="stream-facts"><span>1 host</span><span>Up to 5 viewers</span><span>No recording</span></div><div class="screen-disclaimer">Illustrative interface · no active capture</div></div>`;}
