/* ================================================
   CHATBOT + PANEL OCULTO
   Clínica Dental Dra. Elizabeth Visintin
   — Clic 4 veces en el logo → Panel de control —
   ================================================ */

(function () {

  // ── DATOS POR DEFECTO ──
  const DEFAULT_FAQS = [
    { id: 'h', q: '¿Cuáles son los horarios?',     a: 'Nuestro horario es de lunes a viernes de 9:00 a 20:00. ¿Te gustaría pedir cita?' },
    { id: 'c', q: '¿Cómo pedir cita?',             a: 'Puedes pedir cita por:\n📞 Llamando al +34 646 51 38 06\n💬 WhatsApp al mismo número\n\n¡Te atendemos encantados!' },
    { id: 'p', q: '¿Cuáles son los precios?',       a: 'Los precios dependen del tratamiento. Te hacemos presupuesto sin compromiso. ¿Te llamo?' },
    { id: 'u', q: '¿Dónde estáis ubicados?',        a: '📍 Estamos en Santiago el Mayor, Murcia. ¿Necesitas indicaciones?' },
    { id: 't', q: '¿Qué tratamientos ofrecéis?',    a: 'Ofrecemos blanqueamiento, implantes, estética dental, ortodoncia, endodoncia y revisiones. ¿Cuál te interesa?' },
    { id: 's', q: '¿Aceptáis seguros dentales?',    a: 'Trabajamos con los principales seguros. Consúltanos al +34 646 51 38 06.' },
    { id: 'e', q: '¿Atendéis urgencias?',           a: '🚨 Sí. Llámanos al +34 646 51 38 06 y te atendemos cuanto antes.' },
    { id: 'n', q: '¿Tratáis a niños?',              a: '¡Por supuesto! Atendemos todas las edades con mucho cariño 😊' },
  ];

  const DEFAULT_CFG = {
    nombre:  'Dra. Elizabeth Visintin',
    saludo:  '¡Hola! 👋 Soy el asistente de la Clínica Dental Dra. Elizabeth Visintin. ¿En qué puedo ayudarte?',
    wa:      '34646513806',
    tel:     '+34 646 51 38 06',
    color:   '#5b35c5',
    activo:  true,
  };

  // ── HELPERS ──
  function getFaqs() {
    try { return JSON.parse(localStorage.getItem('ev_faqs')) || DEFAULT_FAQS; } catch(e) { return DEFAULT_FAQS; }
  }
  function getCfg() {
    try { return Object.assign({}, DEFAULT_CFG, JSON.parse(localStorage.getItem('ev_config'))); } catch(e) { return {...DEFAULT_CFG}; }
  }
  function saveFaqs(f) { localStorage.setItem('ev_faqs', JSON.stringify(f)); }
  function saveCfg(c)  { localStorage.setItem('ev_config', JSON.stringify(c)); }
  function toast(msg, dur) {
    dur = dur || 3000;
    var t = document.getElementById('ev-toast');
    if (!t) { t = document.createElement('div'); t.id = 'ev-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('ev-show');
    clearTimeout(t._to); t._to = setTimeout(function(){ t.classList.remove('ev-show'); }, dur);
  }

  var cfg = getCfg();

  // ── ESTILOS ──
  var css = document.createElement('style');
  css.textContent = [
    /* CHATBOT */
    '#ev-wrap{position:fixed;bottom:22px;right:22px;z-index:9990;}',
    '#ev-fab{width:56px;height:56px;border-radius:50%;background:'+cfg.color+';color:#fff;border:none;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.28);transition:.2s;}',
    '#ev-fab:hover{transform:scale(1.08);}',
    '#ev-badge{position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:700;display:none;align-items:center;justify-content:center;}',
    '#ev-chat{position:fixed;bottom:90px;right:22px;width:320px;max-width:93vw;background:#fff;border-radius:18px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;z-index:9991;font-family:system-ui,sans-serif;border:1px solid #e5e7eb;}',
    '#ev-chat.open{display:flex;}',
    '.ev-hdr{background:'+cfg.color+';padding:14px 16px;display:flex;align-items:center;justify-content:space-between;}',
    '.ev-hdr-l{display:flex;align-items:center;gap:10px;}',
    '.ev-ava{width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}',
    '.ev-hdr-name{color:#fff;font-weight:700;font-size:14px;}',
    '.ev-hdr-sub{color:rgba(255,255,255,.6);font-size:11px;}',
    '.ev-close{background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;line-height:1;padding:0;}',
    '.ev-msgs{height:260px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f8f9fa;}',
    '.ev-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55;}',
    '.ev-msg.bot{background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.07);align-self:flex-start;border-radius:14px 14px 14px 2px;}',
    '.ev-msg.usr{background:'+cfg.color+';color:#fff;align-self:flex-end;border-radius:14px 14px 2px 14px;}',
    '.ev-qbs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}',
    '.ev-qb{padding:6px 11px;background:#f0ecff;border:1.5px solid #c4b5fd;border-radius:20px;font-size:12px;font-weight:500;color:'+cfg.color+';cursor:pointer;font-family:inherit;}',
    '.ev-inp{display:flex;border-top:1px solid #f0f0f0;}',
    '.ev-inp input{flex:1;border:none;padding:12px 14px;font-size:14px;font-family:inherit;outline:none;}',
    '.ev-inp button{background:'+cfg.color+';color:#fff;border:none;padding:0 16px;cursor:pointer;font-size:16px;}',
    '.ev-typing{display:flex;align-items:center;gap:4px;padding:10px 13px;background:#fff;border-radius:14px 14px 14px 2px;align-self:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.07);}',
    '.ev-typing span{width:7px;height:7px;background:#ccc;border-radius:50%;animation:evbounce 1.2s infinite;}',
    '.ev-typing span:nth-child(2){animation-delay:.2s;}',
    '.ev-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes evbounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}',
    /* TOAST */
    '#ev-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(80px);background:#1e1e2e;color:#fff;padding:12px 22px;border-radius:50px;font-weight:600;font-size:13px;box-shadow:0 8px 28px rgba(0,0,0,.25);opacity:0;transition:.3s;z-index:99999;white-space:nowrap;font-family:system-ui,sans-serif;}',
    '#ev-toast.ev-show{transform:translateX(-50%) translateY(0);opacity:1;}',
    /* PANEL OVERLAY */
    '#ev-panel-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99990;display:none;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto;font-family:system-ui,sans-serif;}',
    '#ev-panel-ov.open{display:flex;}',
    '#ev-panel-box{background:#f7f5ff;border-radius:20px;width:100%;max-width:540px;margin:auto;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);}',
    /* Panel login */
    '#ev-pl{background:linear-gradient(145deg,#2d1b69,#5b35c5);padding:36px 28px;display:flex;flex-direction:column;align-items:center;}',
    '#ev-pl .ep-ico{width:52px;height:52px;background:rgba(255,255,255,.15);border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:12px;}',
    '#ev-pl h2{color:#fff;font-size:18px;font-weight:700;margin-bottom:4px;}',
    '#ev-pl .ep-sub{color:rgba(255,255,255,.4);font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:24px;}',
    '#ev-pl .ep-lbl{display:block;color:rgba(255,255,255,.55);font-size:11px;font-weight:700;letter-spacing:.5px;margin-bottom:5px;align-self:flex-start;width:100%;max-width:300px;}',
    '#ev-pl input{width:100%;max-width:300px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:9px;padding:12px 14px;color:#fff;font-size:15px;outline:none;margin-bottom:10px;font-family:inherit;}',
    '#ev-pl input::placeholder{color:rgba(255,255,255,.25);}',
    '#ev-pl .ep-lbtn{width:100%;max-width:300px;padding:13px;background:#fff;color:#2d1b69;border:none;border-radius:9px;font-size:15px;font-weight:700;cursor:pointer;margin-top:4px;font-family:inherit;}',
    '#ev-pl .ep-err{background:rgba(239,68,68,.2);border:1px solid rgba(239,68,68,.35);color:#fca5a5;border-radius:8px;padding:9px 14px;font-size:13px;text-align:center;margin-top:10px;width:100%;max-width:300px;display:none;}',
    /* Panel app */
    '#ev-pa{display:none;}',
    '.ep-hdr{background:linear-gradient(135deg,#2d1b69,#5b35c5);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}',
    '.ep-hdr-title{color:#fff;font-weight:700;font-size:15px;}',
    '.ep-hdr-sub{color:rgba(255,255,255,.4);font-size:11px;}',
    '.ep-hdr-right{display:flex;gap:8px;}',
    '.ep-bsm{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}',
    '.ep-tabs{display:flex;overflow-x:auto;padding:0 12px;gap:2px;background:linear-gradient(135deg,#2d1b69,#5b35c5);border-top:1px solid rgba(255,255,255,.1);scrollbar-width:none;}',
    '.ep-tabs::-webkit-scrollbar{display:none;}',
    '.ep-tab{padding:10px 14px;color:rgba(255,255,255,.45);font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;font-family:inherit;border-bottom:2px solid transparent;white-space:nowrap;}',
    '.ep-tab.active{color:#fff;border-bottom-color:#fff;}',
    '.ep-body{padding:18px;}',
    '.ep-sec{display:none;}.ep-sec.active{display:block;}',
    '.ep-card{background:#fff;border-radius:13px;padding:18px;box-shadow:0 2px 16px rgba(91,53,197,.09);margin-bottom:14px;}',
    '.ep-title{font-size:15px;font-weight:700;color:#2d1b69;margin-bottom:14px;}',
    '.ep-fi{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}',
    '.ep-fi label{font-size:11px;font-weight:700;color:#5b35c5;letter-spacing:.5px;text-transform:uppercase;}',
    '.ep-fi input,.ep-fi textarea{font-family:inherit;font-size:14px;padding:11px 12px;border:1.5px solid #e5e7eb;border-radius:9px;background:#f7f5ff;color:#1e1e2e;outline:none;width:100%;}',
    '.ep-fi input:focus,.ep-fi textarea:focus{border-color:#5b35c5;background:#fff;}',
    '.ep-fi textarea{resize:vertical;min-height:70px;}',
    '.ep-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:11px 18px;border-radius:9px;border:none;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:.15s;}',
    '.ep-btn-p{background:#5b35c5;color:#fff;}.ep-btn-p:hover{background:#7c57e0;}',
    '.ep-btn-r{background:transparent;border:1.5px solid #ef4444;color:#ef4444;}',
    '.ep-btn-full{width:100%;justify-content:center;}',
    /* Toggle */
    '.ep-tw{display:flex;align-items:center;gap:10px;margin-bottom:12px;}',
    '.ep-tg{position:relative;width:46px;height:25px;flex-shrink:0;}',
    '.ep-tg input{opacity:0;width:0;height:0;}',
    '.ep-sl{position:absolute;inset:0;background:#d1d5db;border-radius:25px;cursor:pointer;transition:.3s;}',
    '.ep-sl:before{content:"";position:absolute;width:19px;height:19px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.3s;}',
    '.ep-tg input:checked+.ep-sl{background:#22c77a;}',
    '.ep-tg input:checked+.ep-sl:before{transform:translateX(21px);}',
    '.ep-tg-lbl{font-size:14px;font-weight:600;color:#1e1e2e;}',
    /* FAQ */
    '.ep-faq{border:1.5px solid #e5e7eb;border-radius:11px;margin-bottom:10px;overflow:hidden;}',
    '.ep-faq-hd{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;cursor:pointer;background:#f7f5ff;}',
    '.ep-faq-q{font-size:13px;font-weight:600;color:#2d1b69;flex:1;}',
    '.ep-faq-ar{font-size:11px;color:#6b7280;transition:.2s;margin-left:8px;}',
    '.ep-faq.open .ep-faq-ar{transform:rotate(180deg);}',
    '.ep-faq-bd{display:none;padding:14px;background:#fff;border-top:1px solid #e5e7eb;}',
    '.ep-faq.open .ep-faq-bd{display:block;}',
    /* Colors */
    '.ep-cols{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}',
    '.ep-col{width:34px;height:34px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:.15s;}',
    '.ep-col.sel{border-color:#1e1e2e;transform:scale(1.12);}',
  ].join('');
  document.head.appendChild(css);

  // ── CHATBOT HTML ──
  document.body.insertAdjacentHTML('beforeend',
    '<div id="ev-wrap" style="position:fixed;bottom:22px;right:22px;z-index:9990;">' +
      '<button id="ev-fab" title="Chatea con nosotros">🦷</button>' +
      '<div id="ev-badge" style="position:absolute;">1</div>' +
    '</div>' +
    '<div id="ev-chat" role="dialog">' +
      '<div class="ev-hdr">' +
        '<div class="ev-hdr-l"><div class="ev-ava">🦷</div>' +
        '<div><div class="ev-hdr-name" id="ev-hdr-name">' + cfg.nombre + '</div>' +
        '<div class="ev-hdr-sub">● En línea ahora</div></div></div>' +
        '<button class="ev-close" id="ev-close">✕</button>' +
      '</div>' +
      '<div class="ev-msgs" id="ev-msgs"></div>' +
      '<div class="ev-inp">' +
        '<input id="ev-input" placeholder="Escribe tu pregunta..." maxlength="300" autocomplete="off">' +
        '<button id="ev-send">➤</button>' +
      '</div>' +
    '</div>'
  );

  // ── PANEL HTML ──
  document.body.insertAdjacentHTML('beforeend',
    '<div id="ev-panel-ov">' +
      '<div id="ev-panel-box">' +
        '<div id="ev-pl">' +
          '<div class="ep-ico">⚙️</div>' +
          '<h2>Panel de Control</h2>' +
          '<div class="ep-sub">Chatbot · Dra. Elizabeth Visintin</div>' +
          '<div class="ep-lbl">Usuario</div>' +
          '<input type="text" id="ep-user" placeholder="dra.visintin" autocomplete="off">' +
          '<div class="ep-lbl">Contraseña</div>' +
          '<input type="password" id="ep-pass" placeholder="••••••••" onkeypress="if(event.key===\'Enter\')window._epLogin()">' +
          '<button class="ep-lbtn" onclick="window._epLogin()">Entrar →</button>' +
          '<div class="ep-err" id="ep-err">⚠️ Usuario o contraseña incorrectos</div>' +
        '</div>' +
        '<div id="ev-pa">' +
          '<div class="ep-hdr">' +
            '<div><div class="ep-hdr-title">⚙️ Panel del Chatbot</div>' +
            '<div class="ep-hdr-sub">Dra. Elizabeth Visintin</div></div>' +
            '<div class="ep-hdr-right">' +
              '<button class="ep-bsm" onclick="window._epLogout()">Salir</button>' +
              '<button class="ep-bsm" onclick="window._closePanel()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="ep-tabs">' +
            '<button class="ep-tab active" onclick="window._epTab(\'respuestas\',this)">💬 Respuestas</button>' +
            '<button class="ep-tab" onclick="window._epTab(\'apariencia\',this)">🎨 Apariencia</button>' +
            '<button class="ep-tab" onclick="window._epTab(\'saludo\',this)">👋 Saludo</button>' +
          '</div>' +
          '<div class="ep-body">' +
            '<div id="ep-respuestas" class="ep-sec active">' +
              '<div class="ep-card">' +
                '<div class="ep-tw">' +
                  '<label class="ep-tg"><input type="checkbox" id="ep-activo" onchange="window._epToggleActivo()"><span class="ep-sl"></span></label>' +
                  '<span class="ep-tg-lbl" id="ep-activo-lbl">Chatbot activo</span>' +
                '</div>' +
                '<p style="font-size:13px;color:#6b7280;">Desactívalo para ocultarlo sin borrar nada.</p>' +
              '</div>' +
              '<div class="ep-card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
                  '<div class="ep-title" style="margin:0;">Respuestas automáticas</div>' +
                  '<button class="ep-btn ep-btn-p" style="padding:8px 12px;font-size:12px;" onclick="window._epNuevaFaq()">➕ Nueva</button>' +
                '</div>' +
                '<div id="ep-faq-list"></div>' +
                '<button class="ep-btn ep-btn-p ep-btn-full" onclick="window._epGuardarFaqs()">💾 Guardar todo</button>' +
              '</div>' +
            '</div>' +
            '<div id="ep-apariencia" class="ep-sec">' +
              '<div class="ep-card">' +
                '<div class="ep-title">Personalización</div>' +
                '<div class="ep-fi"><label>Nombre en el chat</label><input type="text" id="ep-nombre"></div>' +
                '<div class="ep-fi"><label>Teléfono</label><input type="text" id="ep-tel"></div>' +
                '<div class="ep-fi"><label>WhatsApp (dígitos con prefijo)</label><input type="text" id="ep-wa"></div>' +
                '<div class="ep-fi"><label>Color del chat</label>' +
                  '<div class="ep-cols" id="ep-cols">' +
                    '<div class="ep-col" style="background:#5b35c5" data-c="#5b35c5" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#1a3a5c" data-c="#1a3a5c" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#059669" data-c="#059669" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#dc2626" data-c="#dc2626" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#d97706" data-c="#d97706" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#0891b2" data-c="#0891b2" onclick="window._epSelCol(this)"></div>' +
                    '<div class="ep-col" style="background:#be185d" data-c="#be185d" onclick="window._epSelCol(this)"></div>' +
                    '<input type="color" id="ep-col-custom" style="width:34px;height:34px;padding:2px;border-radius:50%;cursor:pointer;border:3px solid transparent;" onchange="window._epSelColVal(this.value)">' +
                  '</div>' +
                '</div>' +
                '<button class="ep-btn ep-btn-p ep-btn-full" onclick="window._epGuardarCfg()">💾 Guardar apariencia</button>' +
                '<p style="font-size:12px;color:#6b7280;margin-top:10px;text-align:center;">El color se aplica al recargar la página.</p>' +
              '</div>' +
            '</div>' +
            '<div id="ep-saludo" class="ep-sec">' +
              '<div class="ep-card">' +
                '<div class="ep-title">Mensaje de bienvenida</div>' +
                '<p style="font-size:13px;color:#6b7280;margin-bottom:14px;">Primer mensaje que ven los visitantes al abrir el chat.</p>' +
                '<div class="ep-fi"><label>Texto de bienvenida</label><textarea id="ep-saludo-txt" rows="4"></textarea></div>' +
                '<button class="ep-btn ep-btn-p ep-btn-full" onclick="window._epGuardarSaludo()">💾 Guardar saludo</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // ══════════════════════════════════
  //   CHATBOT LÓGICA
  // ══════════════════════════════════
  var chatOpen = false;

  function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('ev-chat').classList.toggle('open', chatOpen);
    document.getElementById('ev-badge').style.display = 'none';
    if (chatOpen && !document.getElementById('ev-msgs').children.length) initGreeting();
    if (chatOpen) setTimeout(function(){ document.getElementById('ev-input').focus(); }, 100);
  }

  function initGreeting() {
    var faqs = getFaqs();
    var c = getCfg();
    var msgs = document.getElementById('ev-msgs');
    var d = document.createElement('div');
    d.className = 'ev-msg bot';
    d.innerHTML = c.saludo.replace(/\n/g,'<br>') +
      '<div class="ev-qbs">' +
      faqs.slice(0,5).map(function(f){
        return '<button class="ev-qb" onclick="window._evQb(this,\'' + f.q.replace(/'/g,"\\'") + '\')">' + f.q + '</button>';
      }).join('') + '</div>';
    msgs.appendChild(d);
  }

  window._evQb = function(btn, txt) {
    addMsg(txt, 'usr');
    btn.closest('.ev-qbs').remove();
    showTyping(function(){ addMsg(getResp(txt), 'bot'); });
  };

  function addMsg(txt, type) {
    var msgs = document.getElementById('ev-msgs');
    var d = document.createElement('div');
    d.className = 'ev-msg ' + type;
    d.innerHTML = txt.replace(/\n/g,'<br>');
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(cb) {
    var msgs = document.getElementById('ev-msgs');
    var t = document.createElement('div');
    t.className = 'ev-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function(){ t.remove(); cb(); }, 700);
  }

  function getResp(txt) {
    var faqs = getFaqs();
    var c = getCfg();
    var l = txt.toLowerCase();
    var match = null;
    for (var i=0; i<faqs.length; i++) {
      var kw = faqs[i].q.toLowerCase().split(/\s+/).filter(function(w){ return w.length > 3; });
      if (kw.some(function(w){ return l.includes(w); })) { match = faqs[i]; break; }
    }
    if (match) return match.a;
    if (l.includes('hola') || l.includes('buenas')) return '¡Hola! 😊 ¿En qué puedo ayudarte?';
    if (l.includes('gracias')) return '¡De nada! Estamos para lo que necesites 😊';
    if (l.includes('dolor') || l.includes('urgencia')) return '🚨 Para urgencias llama ahora al ' + c.tel;
    return '¡Gracias por tu mensaje! Para más info llámanos al 📞 ' + c.tel + ' o escríbenos por <a href="https://wa.me/' + c.wa + '" target="_blank" style="color:' + c.color + '">WhatsApp</a>.';
  }

  function sendChat() {
    var input = document.getElementById('ev-input');
    var txt = input.value.trim();
    if (!txt) return;
    addMsg(txt, 'usr');
    input.value = '';
    showTyping(function(){ addMsg(getResp(txt), 'bot'); });
  }

  // ══════════════════════════════════
  //   4 CLICS EN EL LOGO
  // ══════════════════════════════════
  var clickCount = 0;
  var clickTimer = null;

  function setupLogoClick() {
    var logo =
      document.querySelector('a[href="#inicio"] img') ||
      document.querySelector('img[src*="logo"]') ||
      document.querySelector('nav img') ||
      document.querySelector('header img') ||
      document.querySelector('header a');
    if (!logo) return;
    logo.addEventListener('click', function(e) {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 4) {
        clickCount = 0;
        e.preventDefault();
        openPanel();
      } else {
        clickTimer = setTimeout(function(){ clickCount = 0; }, 1000);
      }
    });
  }

  // ══════════════════════════════════
  //   PANEL LÓGICA
  // ══════════════════════════════════
  var panelAuth = false;
  var epColor = getCfg().color || '#5b35c5';
  var epFaqs  = getFaqs();

  function openPanel() {
    document.getElementById('ev-panel-ov').classList.add('open');
    if (panelAuth) showPanelApp();
  }

  window._closePanel = function() {
    document.getElementById('ev-panel-ov').classList.remove('open');
  };

  document.getElementById('ev-panel-ov').addEventListener('click', function(e) {
    if (e.target === this) window._closePanel();
  });

  window._epLogin = function() {
    var u = document.getElementById('ep-user').value.trim();
    var p = document.getElementById('ep-pass').value.trim();
    if (u === 'dra.visintin' && p === 'clinica2024') {
      panelAuth = true;
      document.getElementById('ep-err').style.display = 'none';
      showPanelApp();
    } else {
      document.getElementById('ep-err').style.display = 'block';
      document.getElementById('ep-pass').value = '';
    }
  };

  window._epLogout = function() {
    panelAuth = false;
    document.getElementById('ev-pa').style.display = 'none';
    document.getElementById('ev-pl').style.display = 'flex';
    document.getElementById('ep-pass').value = '';
    document.getElementById('ep-err').style.display = 'none';
  };

  function showPanelApp() {
    document.getElementById('ev-pl').style.display = 'none';
    document.getElementById('ev-pa').style.display = 'block';
    epFaqs = getFaqs();
    epColor = getCfg().color || '#5b35c5';
    epInit();
  }

  window._epTab = function(id, btn) {
    document.querySelectorAll('.ep-sec').forEach(function(s){ s.classList.remove('active'); });
    document.querySelectorAll('.ep-tab').forEach(function(b){ b.classList.remove('active'); });
    document.getElementById('ep-' + id).classList.add('active');
    btn.classList.add('active');
  };

  function epInit() {
    var c = getCfg();
    document.getElementById('ep-activo').checked = c.activo !== false;
    document.getElementById('ep-activo-lbl').textContent = c.activo !== false ? 'Chatbot activo' : 'Chatbot desactivado';
    document.getElementById('ep-nombre').value = c.nombre || '';
    document.getElementById('ep-tel').value    = c.tel    || '';
    document.getElementById('ep-wa').value     = c.wa     || '';
    document.getElementById('ep-saludo-txt').value = c.saludo || '';
    document.querySelectorAll('.ep-col').forEach(function(el){
      el.classList.toggle('sel', el.dataset.c === epColor);
    });
    document.getElementById('ep-col-custom').value = epColor;
    epRenderFaqs();
  }

  window._epToggleActivo = function() {
    var c = getCfg();
    c.activo = document.getElementById('ep-activo').checked;
    saveCfg(c);
    document.getElementById('ep-activo-lbl').textContent = c.activo ? 'Chatbot activo' : 'Chatbot desactivado';
    toast(c.activo ? '✅ Chatbot activado' : '⏸ Chatbot desactivado');
  };

  function epRenderFaqs() {
    var el = document.getElementById('ep-faq-list');
    if (!epFaqs.length) {
      el.innerHTML = '<p style="color:#6b7280;font-size:13px;text-align:center;padding:16px 0;">Sin respuestas. Añade con ➕</p>';
      return;
    }
    el.innerHTML = epFaqs.map(function(f, i){
      return '<div class="ep-faq" id="epf'+i+'">' +
        '<div class="ep-faq-hd" onclick="window._epTogFaq('+i+')">' +
          '<span class="ep-faq-q">💬 '+f.q+'</span>' +
          '<span class="ep-faq-ar">▼</span>' +
        '</div>' +
        '<div class="ep-faq-bd">' +
          '<div class="ep-fi"><label>Pregunta</label>' +
            '<input type="text" id="epfq'+i+'" value="'+f.q.replace(/"/g,'&quot;')+'">' +
          '</div>' +
          '<div class="ep-fi"><label>Respuesta</label>' +
            '<textarea id="epfa'+i+'" rows="3">'+f.a+'</textarea>' +
          '</div>' +
          '<div style="display:flex;gap:8px;margin-top:8px;">' +
            '<button class="ep-btn ep-btn-p" style="padding:8px 12px;font-size:12px;" onclick="window._epSave1('+i+')">💾 Guardar</button>' +
            '<button class="ep-btn ep-btn-r" style="padding:8px 12px;font-size:12px;" onclick="window._epDel('+i+')">🗑 Borrar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  window._epTogFaq = function(i) { document.getElementById('epf'+i).classList.toggle('open'); };

  window._epNuevaFaq = function() {
    epFaqs.push({ id:'c'+Date.now(), q:'Nueva pregunta...', a:'Escribe la respuesta aquí...' });
    epRenderFaqs();
    var last = epFaqs.length - 1;
    setTimeout(function(){
      var el = document.getElementById('epf'+last);
      el.classList.add('open');
      document.getElementById('epfq'+last).focus();
      el.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 50);
  };

  window._epSave1 = function(i) {
    var q = document.getElementById('epfq'+i).value.trim();
    var a = document.getElementById('epfa'+i).value.trim();
    if (!q || !a) { toast('⚠️ Rellena pregunta y respuesta'); return; }
    epFaqs[i].q = q; epFaqs[i].a = a;
    saveFaqs(epFaqs);
    epRenderFaqs();
    setTimeout(function(){ document.getElementById('epf'+i).classList.add('open'); }, 30);
    toast('✅ Respuesta guardada');
  };

  window._epDel = function(i) {
    if (!confirm('¿Eliminar esta respuesta?')) return;
    epFaqs.splice(i, 1);
    saveFaqs(epFaqs);
    epRenderFaqs();
    toast('🗑️ Eliminada');
  };

  window._epGuardarFaqs = function() {
    epFaqs.forEach(function(_, i){
      var q = document.getElementById('epfq'+i);
      var a = document.getElementById('epfa'+i);
      if (q && a) { epFaqs[i].q = q.value.trim(); epFaqs[i].a = a.value.trim(); }
    });
    saveFaqs(epFaqs);
    toast('💾 Todos los cambios guardados');
  };

  window._epSelCol = function(el) {
    document.querySelectorAll('.ep-col').forEach(function(c){ c.classList.remove('sel'); });
    el.classList.add('sel');
    epColor = el.dataset.c;
    document.getElementById('ep-col-custom').value = epColor;
  };

  window._epSelColVal = function(val) {
    document.querySelectorAll('.ep-col').forEach(function(c){ c.classList.remove('sel'); });
    epColor = val;
  };

  window._epGuardarCfg = function() {
    var c = getCfg();
    c.nombre = document.getElementById('ep-nombre').value.trim() || c.nombre;
    c.tel    = document.getElementById('ep-tel').value.trim()    || c.tel;
    c.wa     = document.getElementById('ep-wa').value.trim()     || c.wa;
    c.color  = epColor;
    saveCfg(c);
    document.getElementById('ev-hdr-name').textContent = c.nombre;
    toast('✅ Guardado. Recarga la página para ver el color.');
  };

  window._epGuardarSaludo = function() {
    var s = document.getElementById('ep-saludo-txt').value.trim();
    if (!s) { toast('⚠️ El saludo no puede estar vacío'); return; }
    var c = getCfg();
    c.saludo = s;
    saveCfg(c);
    toast('✅ Saludo guardado');
  };

  // ══════════════════════════════════
  //   EVENTOS
  // ══════════════════════════════════
  document.getElementById('ev-fab').addEventListener('click', toggleChat);
  document.getElementById('ev-close').addEventListener('click', toggleChat);
  document.getElementById('ev-send').addEventListener('click', sendChat);
  document.getElementById('ev-input').addEventListener('keydown', function(e){ if(e.key==='Enter') sendChat(); });

  setTimeout(function(){
    if (!chatOpen) document.getElementById('ev-badge').style.display = 'flex';
  }, 4000);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoClick);
  } else {
    setupLogoClick();
  }

  if (cfg.activo === false) {
    document.getElementById('ev-wrap').style.display = 'none';
  }

})();
