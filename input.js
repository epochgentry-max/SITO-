(function() {
  /* =============================================
     SITO OPERATING SYSTEM - JS CORE (V5.2)
     Protocolo: Integridad Total & Soberanía Digital
     Estado: Auditado, Consolidado y Blindado
     ============================================= */

  const SUPABASE_URL = "https://jhpdlnpvlrbolukuteox.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ifHWyzybfNkfiXJDWTo57Q_5DtsnRdu";
  let supabaseClient = null;

  // 1. NÚCLEO DE DATOS (AUTO-INYECCIÓN)
  const initSitoCore = () => {
    const loadSupabase = () => {
      return new Promise((resolve, reject) => {
        if (window.supabase) return resolve();
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadSupabase().then(() => {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      window.supabaseClient = supabaseClient;
      console.log("SITO: Núcleo de datos sincronizado.");
    }).catch(err => console.error("☢️ Fallo en el núcleo:", err));
  };
  initSitoCore();

  // 2. GESTIÓN DE PANTALLAS (PROTOCOLO DE NAVEGACIÓN)
  const screens = {
    inicio: document.getElementById('inicio-sito'),
    video: document.getElementById('video-induccion'),
    login: document.getElementById('login-usuario-sito'),
    paso1: document.getElementById('formulario-paso1'),
    paso2: document.getElementById('formulario-paso2'),
    paso3: document.getElementById('formulario-paso3'),
    paso4: document.getElementById('formulario-paso4'),
    confirm: document.getElementById('formulario-confirmacion'),
    carousel: document.getElementById('carousel-container'),
    dashboard: document.getElementById('dashboard-aliado')
  };

  const showScreen = (s) => {
    Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
    if(s) {
      s.style.display = (s.id === 'dashboard-aliado' || s.id === 'carousel-container') ? 'block' : 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. CONTROL DE VIDEO (PROTOCOLO HD)
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api"; 
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('player', {
      height: '100%', width: '100%', videoId: 'Fs7pOoT6sTc',
      playerVars: { 'rel': 0, 'modestbranding': 1, 'quality': 'hd720' },
      events: {
        'onStateChange': (e) => {
          if (e.data == YT.PlayerState.ENDED) {
            const btn = document.getElementById('btn-continuar-postulacion');
            if(btn) btn.style.display = 'block';
          }
        }
      }
    });
  };

  // 4. PROTOCOLO DE VISIÓN (REINTEGRADO)
  const togglePass = document.querySelector('#togglePassword');
  const passField = document.querySelector('#login_password');
  if (togglePass && passField) {
    togglePass.onclick = function() {
      const isPass = passField.type === 'password';
      passField.type = isPass ? 'text' : 'password';
      this.textContent = isPass ? '🔒' : '👁️';
      passField.focus();
    };
  }

  // 5. LOGIN Y ACCESO - TABLA: acceso_aliados (REINTEGRADO)
  const fLogin = document.getElementById('form-login');
  if(fLogin) {
    fLogin.onsubmit = async (e) => {
      e.preventDefault();
      if(!supabaseClient) return alert("SITO: Sincronizando núcleo...");
      const user = document.getElementById('login_username').value;
      const pass = document.getElementById('login_password').value;
      try {
        const { data, error } = await supabaseClient
          .from('acceso_aliados')
          .select('id_interno, estado_acceso, reg_username')
          .eq('reg_username', user).eq('reg_password', pass).single();

        if (error || !data) {
          mostrarSitoAlert('❌ Acceso Denegado: Credenciales no reconocidas.', '🚫');
        } else if (data.estado_acceso !== 'activo') {
          mostrarSitoAlert('⚠️ Cuenta en Auditoría: Acceso restringido.', '⚖️');
        } else {
          sessionStorage.setItem('sito_id_aliado', data.id_interno);
          sessionStorage.setItem('sito_nombre_aliado', data.reg_username);
          mostrarSitoAlert(`Bienvenido, Aliado ${data.reg_username}`, '✅');
        }
      } catch (err) { mostrarSitoAlert('Fallo crítico de comunicación.', '☢️'); }
    };
  }

  // 6. LÓGICA DE FORMULARIOS (HIJOS, CONYUGE, VIAJES)
  const inputHijos = document.getElementById('numero_hijos');
  if(inputHijos) {
    inputHijos.oninput = () => {
      const cont = document.getElementById('contenedor-hijos');
      cont.innerHTML = "";
      const cant = parseInt(inputHijos.value);
      for(let i=1; i<=cant; i++) {
        const inp = document.createElement('input');
        inp.type = "text"; inp.placeholder = `Nombre hijo ${i} *`;
        inp.className = "hijo-item"; inp.required = true;
        inp.style.cssText = "margin-bottom:10px; width:100%; padding:12px; background:rgba(2,10,18,0.8); border:1px solid rgba(212,175,55,0.4); border-radius:8px; color:white;";
        cont.appendChild(inp);
      }
    };
  }

  window.toggleConyuge = (valor) => {
    const campo = document.getElementById('campo-conyuge');
    const input = document.getElementById('nombre_conyuge');
    if(campo && input) {
      const mostrar = (valor === 'casado' || valor === 'union_libre');
      campo.style.display = mostrar ? 'block' : 'none';
      input.required = mostrar;
    }
  };

  const selectViajes = document.getElementById('viajes_exterior');
  if(selectViajes) {
    selectViajes.onchange = () => {
      const dest = document.getElementById('destinos_viaje');
      if(dest) {
        dest.style.display = selectViajes.value === 'si' ? 'block' : 'none';
        dest.required = selectViajes.value === 'si';
      }
    };
  }

  // 7. ENVÍO Y PERSISTENCIA
  let formData = {};
  const setupForm = (id, next) => {
    const f = document.getElementById(id);
    if(f) f.onsubmit = e => {
      e.preventDefault();
      new FormData(f).forEach((v, k) => { formData[k] = v; });
      if(id === 'datos-familia') {
        const hijos = [];
        document.querySelectorAll('.hijo-item').forEach(h => hijos.push(h.value));
        formData['nombres_hijos'] = hijos;
      }
      showScreen(next);
    };
  };

  setupForm('datos-basicos', screens.paso2);
  setupForm('datos-contacto', screens.paso3);
  setupForm('datos-familia', screens.paso4);

  const fFinal = document.getElementById('datos-finales');
  const checkSarlaft = document.getElementById('acepto_sarlaft');

  if(fFinal) {
    fFinal.onsubmit = async (e) => {
      e.preventDefault();
      if (checkSarlaft && !checkSarlaft.checked) {
          alert("⚠️ Acceso Denegado: Debe validar el protocolo de seguridad patrimonial.");
          return;
      }
      new FormData(fFinal).forEach((v, k) => { formData[k] = v; });
      formData['acepto_sarlaft'] = true;

      showScreen(screens.carousel);
      startCarousel();

      if(supabaseClient) {
        const { error } = await supabaseClient.from('postulaciones_sito').insert([formData]);
        window.sitoUploadError = error ? error.message : null;
      }
    };
  }

  // 8. MOTOR DE AUDITORÍA VISUAL (CARRUSEL ACTUALIZADO)
  function startCarousel() {
    let idx = 0;
    const totalFrames = 6;
    const bar = document.getElementById('loading-bar');
    const car = document.getElementById('carousel');
    if(bar) bar.style.width = '0%';
    if(car) car.style.transform = 'translateX(0%)';

    const interval = setInterval(() => {
      idx++;
      if (idx < totalFrames) {
        if(car) car.style.transform = `translateX(-${idx * 100}%)`;
        if(bar) bar.style.width = `${(idx / totalFrames) * 100}%`;
      } else {
        clearInterval(interval);
        if(bar) bar.style.width = '100%';
        setTimeout(() => {
          if (window.sitoUploadError) {
            alert("⚠️ Error en Auditoría: " + window.sitoUploadError);
            showScreen(screens.paso4);
          } else {
            showScreen(screens.confirm);
          }
        }, 1200);
      }
    }, 2800);
  }

  // 9. COMUNICACIÓN TÁCTICA Y DASHBOARD (REINTEGRADO)
  window.mostrarSitoAlert = (m, i) => {
    const mod = document.getElementById('sito-alert');
    if(mod) {
      document.getElementById('sito-alert-msg').innerText = m;
      document.getElementById('sito-alert-icon').innerText = i;
      mod.style.display = 'flex';
    }
  };

  window.cerrarSitoAlert = () => {
    const mod = document.getElementById('sito-alert');
    if(mod) mod.style.display = 'none';
    const id = sessionStorage.getItem('sito_id_aliado');
    if (id) {
      const aliasEl = document.getElementById('alias-aliado');
      const idEl = document.getElementById('id-sito-display');
      if(aliasEl) aliasEl.innerText = sessionStorage.getItem('sito_nombre_aliado');
      if(idEl) idEl.innerText = id;
      showScreen(screens.dashboard);
      sincronizarDatosAliado(id);
    }
  };

  async function sincronizarDatosAliado(id) {
    if(!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient.rpc('acceso_nucleo_espejo', { id_solicitado: id });
      if (data && data[0]) {
        const p = data[0];
        const ficha = {
          'dat-nombre': p.f_nombre_completo, 'dat-cedula': p.f_cc_nit, 'dat-email': p.f_email,
          'dat-tel': p.f_telefono_movil, 'dat-negocio': p.f_nombre_comercial, 'dat-id-publico': p.f_id_publico_aliado,
          'dat-situacion': p.f_situacion_laboral, 'dat-sarlaft': p.f_acepto_sarlaft ? "ACEPTADO" : "PENDIENTE"
        };
        Object.keys(ficha).forEach(key => {
          const el = document.getElementById(key);
          if(el) el.innerText = ficha[key] || "---";
        });
      }
    } catch (e) { console.error("Error RPC:", e); }
  }

  // BINDINGS DE CONTROL FINAL
  document.getElementById('btn-crear-cuenta').onclick = () => showScreen(screens.video);
  document.getElementById('btn-iniciar-sesion').onclick = () => showScreen(screens.login);
  document.getElementById('btn-continuar-postulacion').onclick = () => showScreen(screens.paso1);
  document.getElementById('back-to-start').onclick = () => showScreen(screens.inicio);

  document.querySelectorAll('.btn-back').forEach(b => {
    b.onclick = () => showScreen(screens[b.dataset.target] || screens.inicio);
  });
  
  const btnFin = document.getElementById('btn-finalizar');
  if(btnFin) btnFin.onclick = () => location.reload();

})();


      
