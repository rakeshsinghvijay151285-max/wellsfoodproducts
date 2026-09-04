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
  function updateNavDisplay(){
    if(window.innerWidth > 1024){
      nav.style.display = 'block';
      nav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      return;
    }

    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    nav.style.display = expanded ? 'block' : 'none';
    nav.classList.toggle('is-open', expanded);
  }

  function toggleMobileMenu(){
    if(window.innerWidth > 1024) return;
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'block';
    nav.classList.toggle('is-open', !expanded);
  }
  hamburger.addEventListener('click', toggleMobileMenu);
  window.addEventListener('resize', updateNavDisplay);
  updateNavDisplay();

  // Back to top
  backToTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // SIMPLE SLIDER UTILS
  function SimpleSlider(containerSelector, opts={}){
    const root = document.querySelector(containerSelector);
    if(!root) return;

    const trackSelector = opts.trackSelector || '.slides';
    const itemSelector = opts.itemSelector || '.slide';
    const dotsSelector = opts.dotsSelector || '.dots';
    const track = root.querySelector(trackSelector);
    const items = Array.from(root.querySelectorAll(itemSelector));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dots = dotsSelector ? root.querySelector(dotsSelector) : null;
    if(!track || items.length === 0) return;

    let index = 0; let playing = opts.autoPlay !== false; const interval = opts.interval || 4000;

    function renderDots(){
      if(!dots) return;
      dots.innerHTML='';
      items.forEach((s,i)=>{const btn=document.createElement('button'); if(i===0) btn.classList.add('active'); btn.addEventListener('click',()=>goTo(i)); dots.appendChild(btn)});
    }
    function update(){
      track.style.transform = `translateX(-${index*100}%)`;
      if(dots){ Array.from(dots.children||[]).forEach((b,i)=>b.classList.toggle('active',i===index)); }
    }
    function goTo(i){ index=(i+items.length)%items.length; update(); }
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
  SimpleSlider('#heroSlider',{interval:4500, trackSelector:'.slides', itemSelector:'.slide', dotsSelector:'.dots'});

  // Testimonials slider
  SimpleSlider('#testSlider',{interval:5500, trackSelector:'.test-slides', itemSelector:'.test', dotsSelector:null});

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
  const io = new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        const img = ent.target;
        const src = img.dataset.src || img.getAttribute('src');
        if(src){ img.src = src; }
        img.classList.remove('lazy');
        io.unobserve(img);
      }
    });
  }, {rootMargin:'200px'});
  lazyImgs.forEach(i=>io.observe(i));

  // Contact form handling
  const form = document.getElementById('contactForm');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  const defaultWhatsAppMessage = 'I would like to discuss distributorship. Please share the quotation.';

  function openWhatsAppWithMessage(message = defaultWhatsAppMessage) {
    const url = `https://wa.me/919510067871?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  if(form){
    form.addEventListener('submit', function(e){ e.preventDefault(); if(!form.checkValidity()){ form.reportValidity(); return; } alert('Form validated. Use WhatsApp button to send enquiry via WhatsApp.'); form.reset(); });
  }

  if(sendWhatsAppBtn){
    sendWhatsAppBtn.addEventListener('click', ()=>{
      openWhatsAppWithMessage(defaultWhatsAppMessage);
    });
  }

  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      openWhatsAppWithMessage(defaultWhatsAppMessage);
    });
  });

  // Enquire buttons prefilling enquiry type
  const enquiryTypeField = document.getElementById('enquiryType');
  document.querySelectorAll('.enquire').forEach(btn=>btn.addEventListener('click', function(){ const type = this.dataset.enquiry||'Product Enquiry'; if(enquiryTypeField) enquiryTypeField.value = type; }));

  // Prevent horizontal overflow
  document.documentElement.style.overflowY='scroll';
});
