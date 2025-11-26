// timeline.js — Dibuja una línea del tiempo desde TIMELINE_DATA y ofrece filtros e interacciones
(function(){
  const data = TIMELINE_DATA.slice().sort((a,b)=>a.year-b.year);
  const timelineEl = document.getElementById('timeline');
  const details = document.getElementById('details');
  const search = document.getElementById('search');
  const filter = document.getElementById('filter');
  const resetBtn = document.getElementById('reset');
  const rangeStart = document.getElementById('rangeStart');
  const rangeEnd = document.getElementById('rangeEnd');

  const minYear = Math.min(...data.map(e=>e.year));
  const maxYear = Math.max(...data.map(e=>e.year));

  // Mapa para mostrar categorías en español en el panel de detalles
  const CATEGORY_ES = {
    protocol: 'Protocolo',
    browser: 'Navegador',
    company: 'Empresa/servicio',
    standard: 'Estándar/Tecnología',
    milestone: 'Hito',
    platform: 'Plataforma'
  };

  rangeStart.min = minYear; rangeStart.max = maxYear; rangeEnd.min = minYear; rangeEnd.max = maxYear;
  rangeStart.value = minYear; rangeEnd.value = maxYear;

  function createAxis(){
    const axis = document.createElement('div');
    axis.className = 'axis';
    timelineEl.appendChild(axis);

    // Genera marcas cada 20/10/5 años dependiendo del rango
    const start = parseInt(rangeStart.value);
    const end = parseInt(rangeEnd.value);
    const viewRange = end - start;
    const step = viewRange > 60 ? 20 : viewRange > 30 ? 10 : 5;

    for(let y=start;y<=end;y+=step){
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.position='absolute';
      tick.style.top='26px';
      tick.style.left = ((y-start)/(end-start))*100 + '%';
      tick.style.transform = 'translateX(-50%)';
      tick.style.fontSize = '.75rem';
      tick.textContent = y;
      timelineEl.appendChild(tick);
    }
  }

  function render(events){
    timelineEl.innerHTML = '';
    createAxis();

    const start = parseInt(rangeStart.value);
    const end = parseInt(rangeEnd.value);

    // distribuir en filas para evitar solapamiento: agrupar por posición aproximada
    const rows = [];
    const getRowForPos = (p)=>{
      const gap = 4; // percent threshold; if within `gap` of existing event in same row, choose next row
      for(let r=0;r<rows.length;r++){
        const lastPos = rows[r][rows[r].length-1];
        if(Math.abs(lastPos - p) > gap){
          rows[r].push(p);
          return r;
        }
      }
      rows.push([p]);
      return rows.length-1;
    };

    events.forEach((ev, idx)=>{
      const posPct = ((ev.year - start)/(end - start))*100;
      // Clamp
      const clamped = Math.max(0, Math.min(100, posPct));

      const el = document.createElement('div');
      el.className = `event ${ev.category}`;
      el.dataset.idx = idx;
      // determine row and vertical offset
      const row = getRowForPos(clamped);
      const yOffset = -12 - (row*36); // base offset above center; spread by 36px per row
      el.style.left = clamped + '%';
      el.style.top = `calc(50% + ${yOffset}px)`;

      // Mostrar vista compacta si los eventos están muy cercanos
      el.innerHTML = `<div class="year">${ev.year}</div><div class="title" title="${ev.title}">${ev.title}</div><div class="hint">${ev.description}</div>`;

      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', ev.title + ' ' + ev.year);
      el.addEventListener('click', ()=> showDetails(ev));
      el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key === ' ') { e.preventDefault(); showDetails(ev);} });
      timelineEl.appendChild(el);
    });
  }

  function showDetails(ev){
    // mostrar detalles en español: título, año, descripción, categoría y enlace
    details.innerHTML = `\n      <h3>${ev.title} <small>(${ev.year})</small></h3>\n      <p>${ev.description}</p>\n      <p><strong>Categoría:</strong> ${CATEGORY_ES[ev.category] || ev.category}</p>\n      <p><a href="${ev.link}" target="_blank" rel="noopener">Más información</a></p>`;
  }

  function applyFilters(){
    const q = search.value.trim().toLowerCase();
    const cat = filter.value;
    const start = parseInt(rangeStart.value);
    const end = parseInt(rangeEnd.value);
    const filtered = data.filter(ev => {
      if(cat !== 'all' && ev.category !== cat) return false;
      if(ev.year < start || ev.year > end) return false;
      if(q && !(ev.title+ ' ' + ev.description + ' ' + ev.category).toLowerCase().includes(q)) return false;
      return true;
    });
    render(filtered);
  }

  // Attach controls
  search.addEventListener('input', () => applyFilters());
  filter.addEventListener('change', () => applyFilters());
  rangeStart.addEventListener('change', ()=>{ if(parseInt(rangeStart.value) > parseInt(rangeEnd.value)) rangeStart.value = rangeEnd.value; applyFilters(); });
  rangeEnd.addEventListener('change', ()=>{ if(parseInt(rangeEnd.value) < parseInt(rangeStart.value)) rangeEnd.value = rangeStart.value; applyFilters(); });
  resetBtn.addEventListener('click', () => {
    search.value = '';
    filter.value = 'all';
    rangeStart.value = minYear; rangeEnd.value = maxYear;
    applyFilters();
  });

  // initial render
  render(data);

  // Keyboard navigation: left/right to move years window by small increments
  document.addEventListener('keydown', (e)=>{
    const step = 1;
    if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='SELECT')) return;
    if(e.key === 'ArrowLeft'){
      rangeStart.value = Math.max(minYear, parseInt(rangeStart.value) - step);
      rangeEnd.value = Math.max(parseInt(rangeStart.value), parseInt(rangeEnd.value) - step);
      applyFilters();
    } else if(e.key === 'ArrowRight'){
      rangeStart.value = Math.min(parseInt(rangeEnd.value), parseInt(rangeStart.value) + step);
      rangeEnd.value = Math.min(maxYear, parseInt(rangeEnd.value) + step);
      applyFilters();
    }
  });
})();
