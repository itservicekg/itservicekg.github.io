/* =========================================================================
   IT SERVICE KG — main.js
   Header scroll state, mobile menu, smooth scroll, reveal-on-scroll,
   services tabs, carousels, FAQ accordion, contact form -> WhatsApp.
   ========================================================================= */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector(".site-header");
  var fabTop = document.querySelector(".fab-top");
  function onScroll(){
    if(header){
      window.scrollY > 12 ? header.classList.add("is-scrolled") : header.classList.remove("is-scrolled");
    }
    if(fabTop){
      window.scrollY > 600 ? fabTop.classList.add("is-visible") : fabTop.classList.remove("is-visible");
    }
  }
  document.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  if(fabTop){
    fabTop.addEventListener("click", function(){
      window.scrollTo({top:0, behavior: reduceMotion ? "auto" : "smooth"});
    });
  }

  /* ---------------- Mobile menu ---------------- */
  var burger = document.querySelector(".burger");
  var mobileNav = document.querySelector(".mobile-nav");
  if(burger && mobileNav){
    burger.addEventListener("click", function(){
      var open = mobileNav.classList.toggle("is-open");
      burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        mobileNav.classList.remove("is-open");
        burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------- Smooth anchor scroll with header offset ---------------- */
  var HEADER_OFFSET = 88;
  function scrollToHash(hash){
    if(!hash) return;
    var el = document.querySelector(hash);
    if(!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({top:top, behavior: reduceMotion ? "auto" : "smooth"});
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var hash = a.getAttribute("href");
    if(!hash || hash === "#") return;
    a.addEventListener("click", function(e){
      var target = document.querySelector(hash);
      if(target){
        e.preventDefault();
        scrollToHash(hash);
        history.pushState(null, "", hash);
      }
    });
  });
  if(window.location.hash){
    window.addEventListener("load", function(){
      setTimeout(function(){ scrollToHash(window.location.hash); }, 60);
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a, .mobile-nav a"));
  function setActiveNav(){
    var scrollPos = window.scrollY + HEADER_OFFSET + 10;
    var current = sections[0] && sections[0].id;
    sections.forEach(function(sec){
      if(sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function(a){
      var href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === "#" + current);
    });
  }
  document.addEventListener("scroll", setActiveNav, {passive:true});
  setActiveNav();

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -40px 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  }else{
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------------- Services tabs (Дом / Бизнес / Все) ---------------- */
  var tabs = document.querySelectorAll(".stab");
  var serviceCards = document.querySelectorAll(".service-card");
  tabs.forEach(function(tab){
    tab.addEventListener("click", function(){
      tabs.forEach(function(t){ t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      var filter = tab.getAttribute("data-filter");
      serviceCards.forEach(function(card){
        var cat = card.getAttribute("data-cat");
        var show = filter === "all" || filter === cat;
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------------- Generic horizontal carousel (portfolio / reviews) ---------------- */
  function initCarousel(trackSelector, prevSelector, nextSelector){
    var track = document.querySelector(trackSelector);
    if(!track) return;
    var prev = document.querySelector(prevSelector);
    var next = document.querySelector(nextSelector);
    function step(){
      var card = track.querySelector(":scope > *");
      return card ? card.getBoundingClientRect().width + 22 : 320;
    }
    if(prev) prev.addEventListener("click", function(){
      track.scrollBy({left: -step(), behavior: reduceMotion ? "auto" : "smooth"});
    });
    if(next) next.addEventListener("click", function(){
      track.scrollBy({left: step(), behavior: reduceMotion ? "auto" : "smooth"});
    });
  }
  initCarousel(".portfolio-track", ".portfolio-prev", ".portfolio-next");
  initCarousel(".reviews-track", ".reviews-prev", ".reviews-next");

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function(){
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove("is-open");
        a.style.maxHeight = null;
      }else{
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Contact form -> WhatsApp ---------------- */
  var form = document.querySelector("#requestForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = form.querySelector("#f-name").value.trim();
      var phone = form.querySelector("#f-phone").value.trim();
      var service = form.querySelector("#f-service");
      var serviceText = service.options[service.selectedIndex] ? service.options[service.selectedIndex].text : "";
      var comment = form.querySelector("#f-comment").value.trim();

      if(!name || !phone){
        form.querySelector(!name ? "#f-name" : "#f-phone").focus();
        return;
      }

      var message =
        "Здравствуйте!\n" +
        "Хочу заказать услугу.\n\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + phone + "\n" +
        "Услуга: " + serviceText + "\n" +
        "Комментарий: " + (comment || "—");

      var url = "https://wa.me/996776544888?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
    });
  }

})();
