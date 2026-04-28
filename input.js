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

// =============================================
// PROTOCOLO DE VISIÓN SITO: CONTROL DEL OJO
// =============================================
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#login_password');

if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function () {
        // 1. Detectar estado actual y alternar
        const isPassword = passwordField.getAttribute('type') === 'password';
        const type = isPassword ? 'text' : 'password';
        
        // 2. Aplicar cambio al hardware (input)
        passwordField.setAttribute('type', type);
        
        // 3. Actualizar el Icono (Feedback Visual)
        this.textContent = isPassword ? '🔒' : '👁️';
        
        // 4. Efecto de foco para no perder la línea de escritura
        passwordField.focus();
    });
}
  
  
  // 2.1 LÓGICA DE LOGIN - PROTOCOLO DE ACCESO AUTORIZADO
  const fLogin = document.getElementById('form-login');
  if(fLogin) {
    fLogin.onsubmit = async (e) => {
      e.preventDefault();
      
      const user = document.getElementById('login_username').value;
      const pass = document.getElementById('login_password').value;

      console.log("SITO: Solicitando acceso al Núcleo...");




      

     // --- LÓGICA DE LOGIN AUDITADA (MAPEO EXACTO DE SUPABASE) ---
const fLogin = document.getElementById('form-login');
if(fLogin) {
  fLogin.onsubmit = async (e) => {
    e.preventDefault();
    
    const user = document.getElementById('login_username').value.trim();
    const pass = document.getElementById('login_password').value.trim();

    try {
      const { data, error } = await window.supabaseClient
        .from('acceso_aliados')
        .select('id_interno, estado_acceso, reg_username') // Mapeo real de tus columnas
        .eq('reg_username', user)
        .eq('reg_password', pass)
        .single();

      if (error || !data) {
        window.mostrarSitoAlert('❌ Acceso Denegado: Credenciales no reconocidas.', '🚫');
        return;
      }

      if (data.estado_acceso !== 'activo') {
        window.mostrarSitoAlert('⚠️ Cuenta en Auditoría: Acceso restringido temporalmente.', '⚖️');
        return;
      }

      // GUARDADO DE SESIÓN CON DATOS REALES
      sessionStorage.setItem('sito_id_aliado', data.id_interno);
      sessionStorage.setItem('sito_nombre_aliado', data.reg_username); // Usamos el username como nombre
      
      // FEEDBACK PERSONALIZADO
      const saludo = `¡Bienvenido, ${data.reg_username}!\n[ID: ${data.id_interno}]`;
      window.mostrarSitoAlert(saludo, '✅');
      
      // Actualizamos el último ingreso en segundo plano (Opcional pero recomendado)
      await window.supabaseClient
        .from('acceso_aliados')
        .update({ ultimo_ingreso: new Date() })
        .eq('id_interno', data.id_interno);

    } catch (err) {
      console.error("Error de conexión:", err);
      window.mostrarSitoAlert('Fallo crítico de comunicación con el Núcleo SITO.', '☢️');
    }
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

  // --- SISTEMA DE COMUNICACIÓN TÁCTICA SITO ---
  window.mostrarSitoAlert = (mensaje, icono = '✅') => {
    const modal = document.getElementById('sito-alert');
    const msg = document.getElementById('sito-alert-msg');
    const ico = document.getElementById('sito-alert-icon');
    
    if(modal && msg && ico) {
      msg.innerText = mensaje;
      ico.innerText = icono;
      modal.style.display = 'flex';
    }
  };

  window.cerrarSitoAlert = () => {
    const modal = document.getElementById('sito-alert');
    if(modal) modal.style.display = 'none';
    
    // Si el acceso fue concedido (existe sesión), disparamos el Dashboard
    if (sessionStorage.getItem('sito_id_aliado')) {
       // showScreen(screens.dashboard); // Descomenta cuando el ID del dashboard esté listo
       console.log("Navegando al Núcleo...");
       // Aquí podrías poner: screens.login.style.display = 'none'; screens.dashboard.style.display = 'block';
    }
  };
  
  
})();

