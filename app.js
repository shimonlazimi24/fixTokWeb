// FixTok landing - interactions
(function () {
  'use strict';

  // sticky nav shadow
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var burger = document.querySelector('.nav__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('.nav__mobile a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', !open);
    });
  });

  // smooth anchor (no scrollIntoView)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // video play buttons: poster until click, then native controls + play.
  // Only one marketing video plays at a time.
  var vwraps = document.querySelectorAll('.vwrap');
  vwraps.forEach(function (w) {
    var video = w.querySelector('video');
    var btn = w.querySelector('.vplay');
    if (!video || !btn) return;
    btn.addEventListener('click', function () {
      vwraps.forEach(function (other) {
        var ov = other.querySelector('video');
        if (ov && ov !== video && !ov.paused) ov.pause();
      });
      w.classList.add('vwrap--playing');
      video.controls = true;
      video.play();
    });
    video.addEventListener('ended', function () {
      w.classList.remove('vwrap--playing');
      video.controls = false;
    });
  });

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
