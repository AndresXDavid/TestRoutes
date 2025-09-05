document.addEventListener('DOMContentLoaded', () => {
     const deptSel = document.getElementById('department');
     const muniSel = document.getElementById('municipality');

     async function loadMunicipalities(deptCode) {

     muniSel.innerHTML = '<option value="">Cargando...</option>';
     try {
          const url = `/api/municipalities?department=${encodeURIComponent(deptCode)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Error al cargar municipios');
          const data = await res.json();
          muniSel.innerHTML = '<option value="">-- Seleccione municipio --</option>';
          data.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.name;
          opt.textContent = m.name;
          muniSel.appendChild(opt);
          });
     } catch (err) {
          console.error(err);
          muniSel.innerHTML = '<option value="">Error al cargar</option>';
     }
     }

     deptSel?.addEventListener('change', (e) => {
     const val = e.target.value;
     if (!val) {
          muniSel.innerHTML = '<option value="">-- Seleccione municipio --</option>';
          return;
     }
     loadMunicipalities(val);
     });

});