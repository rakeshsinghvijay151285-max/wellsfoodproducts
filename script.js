// Main JS for Wells SPA
document.addEventListener('DOMContentLoaded', function(){
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const dotsContainer = document.querySelector('.slider .dots');

  // Sticky header background
  function onScroll(){
    if(window.scrollY>40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    backToTop.style.display = window.scrollY>400? 'block':'none';
    // Active nav highlight
    document.querySelectorAll('[data-scroll]').forEach(a=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(!target) return;
      const rect = target.getBoundingClientRect();
      if(rect.top<=120 && rect.bottom>120) a.classList.add('active'); else a.classList.remove('active');
    });
  }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Smooth scroll for internal links
  document.querySelectorAll('[data-scroll]').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const id = link.getAttribute('href');
      const el = document.querySelector(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav if open
      if(hamburger.getAttribute('aria-expanded')==='true'){toggleMobileMenu();}
    });
  });

  // Mobile menu
  function toggleMobileMenu(){
    const expanded = hamburger.getAttribute('aria-expanded')==='true';
    hamburger.setAttribute('aria-expanded', !expanded);
    nav.style.display = expanded? 'none':'block';
  }
  hamburger.addEventListener('click', toggleMobileMenu);
  window.addEventListener('resize', ()=>{ if(window.innerWidth>1024) nav.style.display='block'; else nav.style.display='none' });

  // Back to top
  backToTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // SIMPLE SLIDER UTILS
  function SimpleSlider(containerSelector, opts={}){
    const root = document.querySelector(containerSelector);
    if(!root) return;
    const slidesEl = root.querySelector('.slides');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dots = root.querySelector('.dots');
    let index = 0; let playing=true; const interval = opts.interval||4000;

    function renderDots(){
      if(!dots) return;
      dots.innerHTML='';
      slides.forEach((s,i)=>{const btn=document.createElement('button'); if(i===0) btn.classList.add('active'); btn.addEventListener('click',()=>goTo(i)); dots.appendChild(btn)});
    }
    function update(){ slidesEl.style.transform = `translateX(-${index*100}%)`; Array.from(dots.children||[]).forEach((b,i)=>b.classList.toggle('active',i===index)); }
    function goTo(i){ index=(i+slides.length)%slides.length; update(); }
    function nextSlide(){ goTo(index+1); }
    function prevSlide(){ goTo(index-1); }
    if(next) next.addEventListener('click', ()=>{ nextSlide(); restart(); });
    if(prev) prev.addEventListener('click', ()=>{ prevSlide(); restart(); });
    root.addEventListener('mouseenter', ()=>playing=false);
    root.addEventListener('mouseleave', ()=>playing=true);
    // touch
    let startX=0; root.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
    root.addEventListener('touchend',e=>{const dx=(e.changedTouches[0].clientX-startX); if(Math.abs(dx)>40){ if(dx<0) nextSlide(); else prevSlide(); restart(); }});
    renderDots(); update();
    let timer = setInterval(()=>{ if(playing) nextSlide(); }, interval);
    function restart(){ clearInterval(timer); timer=setInterval(()=>{ if(playing) nextSlide(); }, interval); }
  }

  // Initialize hero slider
  SimpleSlider('#heroSlider',{interval:4500});

  // Testimonials slider
  SimpleSlider('#testSlider',{interval:5500});

  // Allow clicking hero/slider images to open in lightbox
  document.querySelectorAll('.slide img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=>{
      const src = img.src || img.dataset.src;
      if(src) openLightboxFromSrc(src);
    });
  });

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.querySelector('.lb-image');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');
  let galleryIndex=0;
  const gallerySrcs = Array.from(galleryItems).map(b=>b.dataset.src);
  galleryItems.forEach((btn,i)=>btn.addEventListener('click',()=>{ openLightbox(i); }));

  // Open lightbox for gallery (with prev/next enabled)
  function openLightbox(i){
    galleryIndex=i; lbImage.src = gallerySrcs[i];
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
    if(lbPrev) lbPrev.style.display = 'block';
    if(lbNext) lbNext.style.display = 'block';
  }

  // Open lightbox for arbitrary src (e.g., slider image click) without prev/next
  function openLightboxFromSrc(src){
    galleryIndex = -1; lbImage.src = src;
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
    if(lbPrev) lbPrev.style.display = 'none';
    if(lbNext) lbNext.style.display = 'none';
  }

  function closeLightbox(){
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); lbImage.src='';
  }
  function lbNextFn(){ if(gallerySrcs.length===0) return; galleryIndex=(galleryIndex+1)%gallerySrcs.length; lbImage.src=gallerySrcs[galleryIndex]; }
  function lbPrevFn(){ if(gallerySrcs.length===0) return; galleryIndex=(galleryIndex-1+gallerySrcs.length)%gallerySrcs.length; lbImage.src=gallerySrcs[galleryIndex]; }
  if(lbClose) lbClose.addEventListener('click', closeLightbox);
  if(lbNext) lbNext.addEventListener('click', lbNextFn);
  if(lbPrev) lbPrev.addEventListener('click', lbPrevFn);
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeLightbox(); if(hamburger.getAttribute('aria-expanded')==='true') toggleMobileMenu(); } if(e.key==='ArrowRight') lbNextFn(); if(e.key==='ArrowLeft') lbPrevFn(); });

  // Lazy load images with data-src
  const lazyImgs = document.querySelectorAll('img.lazy');
  const io = new IntersectionObserver(entries=>{ entries.forEach(ent=>{ if(ent.isIntersecting){ const img = ent.target; img.src = img.dataset.src; img.classList.remove('lazy'); io.unobserve(img); } }) },{rootMargin:'200px'});
  lazyImgs.forEach(i=>io.observe(i));

  // Contact form handling
  const form = document.getElementById('contactForm');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  form.addEventListener('submit', function(e){ e.preventDefault(); if(!form.checkValidity()){ form.reportValidity(); return; } alert('Form validated. Use WhatsApp button to send enquiry via WhatsApp.'); form.reset(); });
  sendWhatsAppBtn.addEventListener('click', ()=>{
    const name = encodeURIComponent(document.getElementById('fullName').value||'');
    const mobile = encodeURIComponent(document.getElementById('mobile').value||'');
    const email = encodeURIComponent(document.getElementById('email').value||'');
    const city = encodeURIComponent(document.getElementById('city').value||'');
    const type = encodeURIComponent(document.getElementById('enquiryType').value||'');
    const msg = encodeURIComponent(document.getElementById('message').value||'');
    const text = `Name: ${name}%0AContact: ${mobile}%0AEmail: ${email}%0ACity: ${city}%0AEnquiry: ${type}%0AMessage: ${msg}`;
    const url = `https://wa.me/919510067871?text=${text}`;
    window.open(url,'_blank');
  });

  // Enquire buttons prefilling enquiry type
  document.querySelectorAll('.enquire').forEach(btn=>btn.addEventListener('click', function(){ const type = this.dataset.enquiry||'Product Enquiry'; document.getElementById('enquiryType').value = type; }));

  // Prevent horizontal overflow
  document.documentElement.style.overflowY='scroll';
});
