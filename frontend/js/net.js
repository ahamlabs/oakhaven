/* Oakhaven — client/server glue.
 *
 * The engine runs fine with no server at all: that's deliberate, so you can
 * iterate on rendering and level design without keeping uvicorn alive. When a
 * server *is* reachable, it takes over as the authority on story state and the
 * local copies become a display cache.
 *
 * Usage, after the engine has loaded:
 *
 *     const net = new OakNet('http://localhost:8000');
 *     await net.connect('dean');
 *     net.bind(S);            // S is the engine's state object
 */

"use strict";

class OakNet {
  constructor(base = "") {
    this.base = base.replace(/\/$/, "");
    this.session = null;
    this.online = false;
    this.ws = null;
    this.state = null;
    this.syncHz = 8;              // low rate on purpose — this is not netcode
    this._timer = null;
    this.onSync = () => {};
    this.onDrop = () => {};
  }

  async _json(path, opts = {}) {
    const res = await fetch(this.base + path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return res.json();
  }

  /* Returns true if the server answered, false if we're running standalone.
     Never throws — an unreachable backend is a supported mode, not an error. */
  async connect(protagonist = "dean") {
    try {
      const s = await this._json("/api/session", {
        method: "POST",
        body: JSON.stringify({ protagonist }),
      });
      this.session = s.session;
      this.online = true;
      this._openSocket();
      return true;
    } catch (err) {
      console.info("Oakhaven: no server, running standalone.", err.message);
      this.online = false;
      return false;
    }
  }

  _openSocket() {
    const url = (this.base || location.origin).replace(/^http/, "ws");
    this.ws = new WebSocket(`${url}/ws/${this.session}`);
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.t === "sync") { this.state = msg; this.onSync(msg); }
    };
    this.ws.onclose = () => {
      this.online = false;
      clearInterval(this._timer);
      this.onDrop();
    };
  }

  /* Push position and stress a few times a second; take glitch level, act,
     and the meters back. The server is the one that decides how corrupted
     the world looks, so a player can't dial it down locally. */
  bind(S) {
    clearInterval(this._timer);
    if (!this.online) return;
    this._timer = setInterval(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) return;
      this.ws.send(JSON.stringify({
        t: "pos",
        sector: S.sector?.id,
        x: +S.px.toFixed(3),
        y: +S.py.toFixed(3),
        angle: +S.angle.toFixed(4),
        stress: +S.stress.toFixed(2),
      }));
    }, 1000 / this.syncHz);

    this.onSync = (msg) => {
      S.glitch = msg.glitch;
      S.act = msg.act;
      S.sobriety = msg.sobriety;
      S.blood = msg.blood;
      S.frags = msg.fragments;
    };
  }

  /* Fetch a sector as the server sees it. Past Act II this differs from the
     local copy, because the server folds the geometry per act. */
  async sector(id, act = 1) {
    return this._json(`/api/sector/${id}?act=${act}`);
  }

  async openDialogue(tree) {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}/dialogue/${tree}`);
  }

  async choose(tree, node, index) {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}/dialogue`, {
      method: "POST",
      body: JSON.stringify({ tree, node, index }),
    });
  }

  async collectFragment(id) {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}/fragment`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  }

  async ending() {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}/ending`);
  }

  async save() {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}/save`, { method: "POST" });
  }

  /* The secret ending deletes the save for real. Call this only from the
     `del chuck_shurley.exe` branch — there is no undo. */
  async purge() {
    if (!this.online) return null;
    return this._json(`/api/session/${this.session}`, { method: "DELETE" });
  }
}

if (typeof window !== "undefined") window.OakNet = OakNet;
