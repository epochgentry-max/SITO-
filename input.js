(function() {
  /* =============================================
     SITO OPERATING SYSTEM - JS CORE (V4.0)
     Protocolo: Integridad, Navegación y Auditoría
     ============================================= */

  // --- AUTO-INYECCIÓN DE DEPENDENCIAS (INDEPENDENCIA DEL MODELO) ---
  const initSitoCore = () => {
    const SUPABASE_URL = "https://jhpdlnpvlrbolukuteox.supabase.co";
    const SUPABASE_KEY = "sb_publishable_ifHWyzybfNkfiXJDWTo57Q_5DtsnRdu";

    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.onload = () => {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("SITO: Núcleo de datos conectado.");
      };
      document.head.appendChild(script);
    } else {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  };
  initSitoCore();

  const screens = {
    inicio: document.getElementById('inicio-sito'),
    video: document.getElementById('video-induccion'),
    login: document.getElementById('login-usuario-sito'),
    paso1: document.getElementById('formulario-paso1'),
    paso2: document.getElementById('formulario-paso2'),
    paso3: document.getElementById('formulario-paso3'),
    paso4: document.getElementById('formulario-paso4'),
    confirm: document.getElementById('formulario-confirmacion'),
    carousel: document.getElementById('carousel-container')
  };

  const showScreen = (s) => {
    Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
    if(s) s.style.display = 'flex';
  };

    // 1. CONTROL DE VIDEO (YOUTUBE API - PROTOCOLO SEGURO)
  if (!window.YT) {
    var tag = document.createElement('script');
    // ACTUALIZACIÓN QUIRÚRGICA: Protocolo HTTPS para compatibilidad con Vercel
    tag.src = "https://www.youtube.com/iframe_api"; 
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('player', {
      height: '360',
      width: '100%',
      videoId: 'Fs7pOoT6sTc',
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

  // 2. NAVEGACIÓN Y ASIGNACIÓN DE EVENTOS
  const bind = (id, action) => { 
    const el = document.getElementById(id); 
    if(el) el.onclick = action; 
  };

  bind('btn-crear-cuenta', () => showScreen(screens.video));
  bind('btn-iniciar-sesion', () => showScreen(screens.login));
  
  // 2.1 LÓGICA DE LOGIN - PROTOCOLO DE ACCESO AUTORIZADO
  const fLogin = document.getElementById('form-login');
  if(fLogin) {
    fLogin.onsubmit = async (e) => {
      e.preventDefault();
      
      const user = document.getElementById('login_username').value;
      const pass = document.getElementById('login_password').value;

      console.log("SITO: Solicitando acceso al Núcleo...");

                 try {
        const { data, error } = await window.supabaseClient
          .from('acceso_aliados')
          .select('id_interno, estado_acceso')
          .eq('reg_username', user)
          .eq('reg_password', pass)
          .single();

        if (error || !data) {
          alert('❌ Acceso Denegado: Credenciales no reconocidas.');
          return;
        }

        if (data.estado_acceso !== 'activo') {
          alert('⚠️ Cuenta en Auditoría: Acceso restringido.');
          return;
        }

        sessionStorage.setItem('sito_id_aliado', data.id_interno);
        document.getElementById('alias-aliado').textContent = user;
        document.getElementById('id-sito-display').textContent = data.id_interno;

        console.log("SITO: Acceso concedido. Iniciando Dashboard...");
        showScreen(document.getElementById('dashboard-aliado'));

      } catch (err) {
        console.error("Fallo crítico:", err);
        alert('Fallo de comunicación con el Núcleo SITO.');
      }
    }; // Cierra fLogin.onsubmit
  } // Cierra if(fLogin)

  /* --- COORDENADA A: INTERACCIÓN DEL OJO (FUERA DEL LOGIN) --- */
  const togglePassword = document.getElementById('toggle-password-icon');
  const passwordInput = document.getElementById('login_password');

  if(togglePassword && passwordInput) {
    togglePassword.onclick = () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      
      togglePassword.innerHTML = isPass 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M1 1s22 22 22 22"></path></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    };
  }

  bind('back-to-start', () => showScreen(screens.inicio));
  bind('btn-continuar-postulacion', () => showScreen(screens.paso1));

    document.querySelectorAll('.btn-back').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.target;
      let finalTarget = target === 'video' ? 'video' : target;
      
      if (screens[finalTarget]) {
        showScreen(screens[finalTarget]);
      } else {
        showScreen(screens.inicio);
      }
    };
  });
  

  // 3. LÓGICA DINÁMICA (Hijos, Viajes y Cónyuge)
  const inputHijos = document.getElementById('numero_hijos');
  if(inputHijos) {
    inputHijos.oninput = () => {
      const cont = document.getElementById('contenedor-hijos');
      cont.innerHTML = "";
      const cant = parseInt(inputHijos.value);

      for(let i=1; i<=cant; i++) {
        const inp = document.createElement('input');
        inp.type = "text";
        inp.placeholder = `Nombre completo hijo ${i} *`;
        inp.className = "hijo-item";
        inp.required = true;
        inp.style.cssText = "margin-bottom:10px; width:100%; padding:12px; background:rgba(2,10,18,0.8); border:1px solid rgba(212,175,55,0.4); border-radius:8px; color:white; outline:none;";
        cont.appendChild(inp);
      }
    };
  }

  window.toggleConyuge = (valor) => {
    const campo = document.getElementById('campo-conyuge');
    const input = document.getElementById('nombre_conyuge');
    if(valor === 'casado' || valor === 'union_libre') {
      if(campo) campo.style.display = 'block';
      if(input) input.required = true;
    } else {
      if(campo) campo.style.display = 'none';
      if(input) {
        input.required = false;
        input.value = "";
      }
    }
  };

  const selectViajes = document.getElementById('viajes_exterior');
  if(selectViajes) {
    selectViajes.onchange = () => {
      const campoDestinos = document.getElementById('destinos_viaje');
      if(campoDestinos) {
        campoDestinos.style.display = selectViajes.value === 'si' ? 'block' : 'none';
        campoDestinos.required = selectViajes.value === 'si';
      }
    };
  }

  // --- OBJETO DE RECOLECCIÓN DE DATOS (SITO CORE) ---
  let formData = {};

  const setupForm = (id, next) => {
    const f = document.getElementById(id);
    if(f) f.onsubmit = e => { 
      e.preventDefault(); 
      const data = new FormData(f);
      data.forEach((value, key) => { formData[key] = value; });
      
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
  if(fFinal) fFinal.onsubmit = async (e) => {
    e.preventDefault();
    const dataFinal = new FormData(fFinal);
    dataFinal.forEach((value, key) => { formData[key] = value; });
    formData['acepto_sarlaft'] = document.getElementById('acepto_sarlaft')?.checked || false;

    showScreen(screens.carousel);
    startCarousel();

    if (window.supabaseClient) {
      try {
        const { error } = await window.supabaseClient
          .from('postulaciones_sito')
          .insert(formData); 

        if (error) {
          window.sitoUploadError = error.message;
        } else {
          window.sitoUploadError = null;
        }
      } catch (err) {
        window.sitoUploadError = "Fallo de conexión al Núcleo.";
      }
    } else {
      window.sitoUploadError = "El Núcleo Supabase no cargó a tiempo.";
    }
  };

  // 5. SISTEMA DE CARRUSEL
  function startCarousel() {
    let index = 0;
    const totalSlides = 6;
    const carousel = document.getElementById('carousel');
    const loadingBar = document.getElementById('loading-bar');
    
    if(carousel) carousel.style.transform = `translateX(0%)`;
    if(loadingBar) loadingBar.style.width = "0%";

    const interval = setInterval(() => {
      if (index < totalSlides - 1) {
        index++;
        if(carousel) carousel.style.transform = `translateX(-${index * 100}%)`;
        if(loadingBar) loadingBar.style.width = (index * (100 / totalSlides)) + "%";
      } else {
        clearInterval(interval);
        if(loadingBar) loadingBar.style.width = "100%";
        
        setTimeout(() => {
          if (window.sitoUploadError) {
            alert("SITO: Error al guardar. Razón: " + window.sitoUploadError);
            showScreen(screens.inicio); 
          } else {
            showScreen(screens.confirm); 
          }
        }, 800);
      }
    }, 3000); 
  }

  // 6. FINALIZACIÓN SEGURA
  const btnFinalizar = document.getElementById('btn-finalizar');
  if(btnFinalizar) {
    btnFinalizar.onclick = () => {
      btnFinalizar.textContent = "Cerrando Sesión Segura...";
      btnFinalizar.disabled = true;
      setTimeout(() => {
        document.querySelectorAll('form').forEach(f => f.reset());
        const contHijos = document.getElementById('contenedor-hijos');
        if(contHijos) contHijos.innerHTML = "";
        formData = {}; 
        showScreen(screens.inicio);
        btnFinalizar.textContent = "Finalizar y Salir";
        btnFinalizar.disabled = false;
      }, 1500);
    };
  }

  
  
  
})();
     
