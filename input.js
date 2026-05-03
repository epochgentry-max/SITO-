(function() {
  /* =============================================
     SITO OPERATING SYSTEM - JS CORE (V6.2)
     Protocolo: Integridad Total & Soberanía Digital
     Estado: Auditado, Consolidado y Blindado
     ============================================= */

  const SUPABASE_URL = "https://jhpdlnpvlrbolukuteox.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ifHWyzybfNkfiXJDWTo57Q_5DtsnRdu";
  let supabaseClient = null;

  // 1. NÚCLEO DE DATOS (SINCRONIZACIÓN TÁCTICA)
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

  // 2. GESTIÓN DE PANTALLAS (NAVEGACIÓN BLINDADA)
  window.navegar = (id) => {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(id);
    if(target) {
      target.classList.add('active');
      // Ajuste de visualización para contenedores especiales
      if(id === 'dashboard-aliado' || id === 'carousel-container') {
          target.style.display = 'block';
      } else {
          target.style.display = 'flex';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. CONTROL DE VIDEO (PROTOCOLO OFICIAL YOUTUBE)
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api"; 
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('player', {
      height: '100%', width: '100%', videoId: 'Fs7pOoT6sTc',
      playerVars: { 
        'rel': 0, 
        'modestbranding': 1, 
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

  // 4. PROTOCOLO DE VISIÓN (TOGGLE PASSWORD)
  const togglePass = document.querySelector('#toggle-password-icon');
  const passField = document.querySelector('#login_password');
  if (togglePass && passField) {
    togglePass.onclick = function() {
      const isPass = passField.type === 'password';
      passField.type = isPass ? 'text' : 'password';
      // Mantenemos la lógica de iconos o texto según el diseño original
      this.innerHTML = isPass ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
      ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      `;
      passField.focus();
    };
  }

  // 5. LOGIN Y ACCESO - TABLA: acceso_aliados
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

  // 7. ENVÍO Y PERSISTENCIA (SITIO SOBERANO)
  let formData = {};
  const setupForm = (id, nextId) => {
    const f = document.getElementById(id);
    if(f) f.onsubmit = e => {
      e.preventDefault();
      new FormData(f).forEach((v, k) => { formData[k] = v; });
      if(id === 'datos-familia') {
        const hijos = [];
        document.querySelectorAll('.hijo-item').forEach(h => hijos.push(h.value));
        formData['nombres_hijos'] = hijos;
      }
      navegar(nextId);
    };
  };

  setupForm('datos-basicos', 'formulario-paso2');
  setupForm('datos-contacto', 'formulario-paso3');
  setupForm('datos-familia', 'formulario-paso4');

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

      navegar('carousel-container');
      startCarousel();

      if(supabaseClient) {
        const { error } = await supabaseClient.from('postulaciones_sito').insert([formData]);
        window.sitoUploadError = error ? error.message : null;
      }
    };
  }

  // 8. MOTOR DE AUDITORÍA VISUAL (CARRUSEL INMORTAL)
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
            navegar('formulario-paso4');
          } else {
            navegar('formulario-confirmacion');
          }
        }, 1200);
      }
    }, 2800);
  }

  // 9. COMUNICACIÓN TÁCTICA Y DASHBOARD
  window.mostrarSitoAlert = (m, i) => {
    const mod = document.getElementById('sito-alert');
    if(mod) {
      document.getElementById('sito-alert-msg').innerText = m;
      document.getElementById('sito-alert-icon').innerText = i;
      mod.style.display = 'flex';
    } else {
      alert(m); // Fallback si el modal no existe en el DOM
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
      navegar('dashboard-aliado');
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

  // 10. BINDINGS DE CONTROL FINAL (PROTOCOLOS DE ENTRADA)
  const safeClick = (id, target) => {
      const el = document.getElementById(id);
      if(el) el.onclick = () => navegar(target);
  };

  safeClick('btn-crear-cuenta', 'video-induccion');
  safeClick('btn-iniciar-sesion', 'login-usuario-sito');
  safeClick('btn-continuar-postulacion', 'formulario-paso1');
  
  document.querySelectorAll('.btn-back').forEach(b => {
    b.onclick = () => {
        const t = b.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        navegar(t || 'inicio-sito');
    };
  });
  
  const btnFin = document.getElementById('btn-finalizar');
  if(btnFin) btnFin.onclick = () => location.reload();

})();
  
