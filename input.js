(function() {
  /* =============================================
     SITO OPERATING SYSTEM - JS CORE (V5.5)
     Protocolo: Integridad Total & Soberanía Digital
     Estado: Auditado, Corregido y Blindado
     ============================================= */

  const SUPABASE_URL = "https://jhpdlnpvlrbolukuteox.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ifHWyzybfNkfiXJDWTo57Q_5DtsnRdu";
  let supabaseClient = null;

  // 1. NÚCLEO DE DATOS (AUTO-INYECCIÓN Y ESPERA DE CARGA)
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
      window.supabaseClient = supabaseClient; // Garantiza disponibilidad global
      console.log("SITO: Núcleo de datos sincronizado.");
    }).catch(err => console.error("☢️ Fallo en el núcleo:", err));
  };
  initSitoCore();

  // 2. GESTIÓN DE PANTALLAS (PUENTE GLOBAL)
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

  window.navegar = (targetId) => {
    // Limpieza de IDs para que coincidan con el objeto screens
    const cleanId = targetId.replace('formulario-', '');
    const target = screens[cleanId] || document.getElementById(targetId);
    
    if(target) {
      Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
      target.style.display = (target.id === 'dashboard-aliado' || target.id === 'carousel-container') ? 'block' : 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. PROTOCOLO OFICIAL YOUTUBE API (CONTROL DE VIDEO HD)
  const cargarYoutubeAPI = () => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api"; // API OFICIAL SEGURA SSL
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  };
  cargarYoutubeAPI();

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('player', {
      height: '100%', width: '100%', videoId: 'Fs7pOoT6sTc',
      playerVars: { 
        'rel': 0, 
        'modestbranding': 1, 
        'autoplay': 0,
        'quality': 'hd720',
        'origin': window.location.origin 
      },
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

  // 4. PROTOCOLO DE VISIÓN (EL OJO)
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

  // 5. LOGIN Y ACCESO (AUDITADO - PROTECCIÓN CONTRA CONGELAMIENTO)
  const fLogin = document.getElementById('form-login');
  if(fLogin) {
    fLogin.onsubmit = async (e) => {
      e.preventDefault();
      
      const client = supabaseClient || window.supabaseClient;
      if(!client) {
          mostrarSitoAlert('☢️ Sincronizando Núcleo...', '⏳');
          return;
      }

      const user = document.getElementById('login_username').value;
      const pass = document.getElementById('login_password').value;

      try {
        const { data, error } = await client
          .from('acceso_aliados')
          .select('id_interno, estado_acceso, reg_username')
          .eq('reg_username', user)
          .eq('reg_password', pass)
          .maybeSingle(); 

        if (error || !data) {
          mostrarSitoAlert('❌ Acceso Denegado', '🚫');
        } else if (data.estado_acceso !== 'activo') {
          mostrarSitoAlert('⚠️ Cuenta en Auditoría', '⚖️');
        } else {
          sessionStorage.setItem('sito_id_aliado', data.id_interno);
          sessionStorage.setItem('sito_nombre_aliado', data.reg_username);
                    // Reemplazo Quirúrgico: Activa captura de identidad y alerta
          ejecutarIngresoExitoso();
          mostrarSitoAlert(`Bienvenido Operador`, '✅');
        } // <--- LLAVE DE CIERRE DEL ELSE AGREGADA
      } catch (err) { 
        mostrarSitoAlert('Fallo crítico de comunicación.', '☢️');
      }
    };
  }

  // 6. LÓGICA DE FORMULARIOS DINÁMICOS
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

  // 7. ENVÍO Y PERSISTENCIA (FORM DATA)
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
  if(fFinal) {
    fFinal.onsubmit = async (e) => {
      e.preventDefault();
      const checkSarlaft = document.getElementById('acepto_sarlaft');
      if (checkSarlaft && !checkSarlaft.checked) {
          alert("⚠️ Acceso Denegado: Debe validar el protocolo de seguridad patrimonial.");
          return;
      }
      new FormData(fFinal).forEach((v, k) => { formData[k] = v; });
      formData['acepto_sarlaft'] = true;

      showScreen(screens.carousel);
      startCarousel();

      const client = supabaseClient || window.supabaseClient;
      if(client) {
        const { error } = await client.from('postulaciones_sito').insert([formData]);
        window.sitoUploadError = error ? error.message : null;
      }
    };
  }

  // 8. MOTOR DE AUDITORÍA VISUAL (CARRUSEL)
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
            alert("⚠️ Error: " + window.sitoUploadError);
            showScreen(screens.paso4);
          } else {
            showScreen(screens.confirm);
          }
        }, 1200);
      }
    }, 2800);
  }


  /* ============================================================
     BLOQUE [D]: MOTOR DE ACTIVACIÓN DE PESTAÑA (UI)
     ============================================================ */
  function activarPestañaIdentidad(nombre, idManual = "EGGH-ALI-05") {
      if (!document.getElementById('pestaña-operador-fija')) {
          const div = document.createElement('div');
          div.id = 'pestaña-operador-fija';
          div.innerHTML = `
              <span class="indicador-nombre" id="pestaña-user">${nombre}</span>
              <span class="indicador-id" id="pestaña-id">${idManual}</span>
          `;
          document.body.appendChild(div);
      } else {
          document.getElementById('pestaña-user').innerText = nombre;
          document.getElementById('pestaña-id').innerText = idManual;
      }
      localStorage.setItem('sito_sesion_activa', 'true');
      document.getElementById('pestaña-operador-fija').style.display = 'block';
  }

  /* ============================================================
     BLOQUE [E]: CAPTURA DINÁMICA DE IDENTIDAD (AUTENTICACIÓN)
     ============================================================ */
  function ejecutarIngresoExitoso() {
      // Sincronía con los IDs de tu formulario de login real
      const inputNombre = document.getElementById('login_username').value;
      const inputID = "SITO-ALI-05"; // Puedes dinamizar esto luego

      if (!inputNombre) return;

      localStorage.setItem('operador_nombre', inputNombre.toUpperCase());
      localStorage.setItem('operador_id', inputID);

      activarPestañaIdentidad(inputNombre.toUpperCase(), inputID);
      window.navegar('dashboard-aliado');
  }


  // 9. COMUNICACIÓN TÁCTICA Y DASHBOARD
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
      // 1. Apagar todas las pantallas de registro/login
      document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
      
      // 2. Encender el Edificio Operativo
      const dash = document.getElementById('dashboard-aliado');
      if(dash) {
          dash.style.display = 'block'; 
          const alias = sessionStorage.getItem('sito_nombre_aliado');
          const aliasDisplay = document.getElementById('alias-perfil-display');
          const termDisplay = document.getElementById('terminal-display');
          if(aliasDisplay) aliasDisplay.innerText = `OPERADOR: ${alias}`;
          if(termDisplay) termDisplay.innerHTML += `<br>> Conexión establecida. Bienvenido, ${alias}.`;
      }
      // 3. Traer datos de la base de datos
      sincronizarDatosAliado(id);
    }
  };

  async function sincronizarDatosAliado(id) {
    const client = supabaseClient || window.supabaseClient;
    if(!client) return;
    try {
      const { data, error } = await client.rpc('acceso_nucleo_espejo', { id_solicitado: id });
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

  // 10. BINDINGS DE CONTROL (INTEGRIDAD V5.5 UNIFICADA)
  const bind = (id, action) => { 
    const el = document.getElementById(id); 
    if(el) el.onclick = action; 
  };

  bind('btn-crear-cuenta', () => showScreen(screens.video));
  bind('btn-iniciar-sesion', () => showScreen(screens.login));
  bind('btn-continuar-postulacion', () => showScreen(screens.paso1));
  bind('back-to-start', () => showScreen(screens.inicio));

  // Protocolo Universal para botones "Atrás"
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.target;
      navegar(target);
    };
  });
  
  bind('btn-finalizar', () => location.reload());

})();

        
