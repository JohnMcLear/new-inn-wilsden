// Populate site from YAML files
// Simple mobile menu toggle
const menuBtn = document.querySelector('.menu');
const nav = document.querySelector('.nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    nav.style.display = open ? 'none' : 'flex';
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

// Load YAML helper
async function loadYAML(url){
  const res = await fetch(url, {cache: 'no-store'});
  if(!res.ok) throw new Error('Failed to load ' + url);
  const text = await res.text();
  return jsyaml.load(text);
}

function renderHours(hours){
  const dl = document.getElementById('hours-list');
  dl.innerHTML = '';
  const order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  order.forEach(day=>{
    const val = hours[day] ?? 'Closed';
    const dt = document.createElement('dt'); dt.textContent = day;
    const dd = document.createElement('dd'); dd.textContent = val;
    dl.append(dt, dd);
  });
}

function renderEvents(events){
  const root = document.getElementById('events-list');
  root.innerHTML = '';
  if(!events || events.length === 0){
    const el = document.createElement('p');
    el.className = 'muted'; el.textContent = 'No events announced just yet — check back soon.';
    root.append(el); return;
  }
  events
    .sort((a,b)=> new Date(a.date) - new Date(b.date))
    .forEach(ev=>{
      const card = document.createElement('article'); card.className = 'card';
      const soon = (new Date(ev.date) - Date.now()) < 1000*60*60*24*7; // within 7 days
      const badge = document.createElement('span'); badge.className = 'badge';
      badge.textContent = soon ? 'Soon' : (ev.badge || 'Event');
      const title = document.createElement('div'); title.className = 'title'; title.textContent = ev.title;
      const meta = document.createElement('div'); meta.className = 'meta';
      meta.textContent = new Date(ev.date).toLocaleString(undefined, {weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'});
      const desc = document.createElement('p'); desc.textContent = ev.description || '';
      card.append(badge, title, meta, desc);
      if (ev.link){
        const a = document.createElement('a'); a.href = ev.link; a.target = '_blank'; a.rel='noopener'; a.textContent = 'More info →';
        card.append(a);
      }
      root.append(card);
    });
}

function renderAles(ales){
  const root = document.getElementById('ales-list');
  root.innerHTML = '';
  ales.forEach(ale=>{
    const card = document.createElement('article'); card.className='card';
    const badge = document.createElement('span'); badge.className='badge'; badge.textContent = ale.style || 'Cask Ale';
    const title = document.createElement('div'); title.className='title'; title.textContent = ale.name;
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = [ale.abv ? (ale.abv + '% ABV') : null, ale.brewery].filter(Boolean).join(' • ');
    const notes = document.createElement('p'); notes.textContent = ale.notes || '';
    card.append(badge, title, meta, notes);
    root.append(card);
  });
}

function applyContact(cfg){
  /*
  const contact = document.getElementById('contact-block');
  const addrLines = [cfg.address.line1, cfg.address.line2, cfg.address.town, cfg.address.postcode].filter(Boolean);
  contact.innerHTML = `
    <div><strong>Address</strong><br>${addrLines.join('<br>')}</div>
    <div><strong>Telephone</strong><br><a id="phone-link-inline" href="tel:${cfg.phone.replace(/\s/g,'')}">${cfg.phone}</a></div>
    ${cfg.email ? `<div><strong>Email</strong><br><a id="email-inline" href="mailto:${cfg.email}">${cfg.email}</a></div>` : ''}
    ${cfg.facebook ? `<div><strong>Facebook</strong><br><a target="_blank" rel="noopener" href="${cfg.facebook}">${cfg.facebook}</a></div>` : ''}
  `;
  const mapsQ = encodeURIComponent(`${cfg.address.line1}, ${cfg.address.town} ${cfg.address.postcode}`);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapsQ}`;
  document.getElementById('directions-link').href = directions;
  const phoneHref = 'tel:' + cfg.phone.replace(/\s/g,'');
  document.getElementById('phone-link').href = phoneHref;
  document.getElementById('facebook-link').href = cfg.facebook || '#';
  document.getElementById('facebook-link-footer').href = cfg.facebook || '#';
  if (cfg.email) document.getElementById('email-link').href = 'mailto:' + cfg.email;

  // Light embed map
  const map = document.getElementById('map-frame');
  const mapSrc = `https://www.google.com/maps?q=${mapsQ}&output=embed`;
  map.src = mapSrc;
  */
}

// Boot
(async () => {
  try {
    const site = await loadYAML('data/site.yaml');
    renderHours(site.hours);
    applyContact(site.contact);
    const events = await loadYAML('data/events.yaml');
    renderEvents(events.events || []);
    const ales = await loadYAML('data/cask_ales.yaml');
    renderAles(ales.casks || []);
  } catch (err) {
    console.error(err);
  }
})();
