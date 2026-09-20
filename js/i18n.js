/* Language files: /lang/en.json, /lang/vi.json */
(function (window, document) {
   var STORAGE_KEY = 'site-lang';
   var SUPPORTED = { en: true, vi: true };
   var dict = {};
   var current = 'en';
   var ready = false;
   var waiters = [];

   function get(obj, path) {
      return path.split('.').reduce(function (acc, key) {
         return acc && acc[key] !== undefined ? acc[key] : undefined;
      }, obj);
   }

   function t(key) {
      var value = get(dict, key);
      return typeof value === 'string' ? value : '';
   }

   function detectLang() {
      try {
         var saved = localStorage.getItem(STORAGE_KEY);
         if (saved && SUPPORTED[saved]) {
            return saved;
         }
      } catch (e) { /* ignore */ }

      var navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      return navLang.indexOf('vi') === 0 ? 'vi' : 'en';
   }

   function apply() {
      document.documentElement.lang = current;
      document.documentElement.setAttribute('data-lang', current);

      var page = document.documentElement.getAttribute('data-page') || 'home';
      var title = t('meta.title.' + page);
      if (title) {
         document.title = title;
      }
      var description = t('meta.description.' + page);
      var meta = document.querySelector('meta[name="description"]');
      if (meta && description) {
         meta.setAttribute('content', description);
      }

      var nodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
         var el = nodes[i];
         var text = t(el.getAttribute('data-i18n'));
         if (text) {
            el.textContent = text;
         }
      }

      var htmlNodes = document.querySelectorAll('[data-i18n-html]');
      for (var j = 0; j < htmlNodes.length; j++) {
         var htmlEl = htmlNodes[j];
         var html = t(htmlEl.getAttribute('data-i18n-html'));
         if (html) {
            htmlEl.innerHTML = html;
         }
      }

      var attrMap = [
         ['data-i18n-placeholder', 'placeholder'],
         ['data-i18n-title', 'title'],
         ['data-i18n-aria', 'aria-label'],
         ['data-i18n-alt', 'alt']
      ];
      for (var a = 0; a < attrMap.length; a++) {
         var attr = attrMap[a][0];
         var prop = attrMap[a][1];
         var list = document.querySelectorAll('[' + attr + ']');
         for (var k = 0; k < list.length; k++) {
            var translated = t(list[k].getAttribute(attr));
            if (translated) {
               list[k].setAttribute(prop, translated);
            }
         }
      }

      var buttons = document.querySelectorAll('[data-set-lang]');
      for (var b = 0; b < buttons.length; b++) {
         var isActive = buttons[b].getAttribute('data-set-lang') === current;
         buttons[b].classList.toggle('is-active', isActive);
         buttons[b].setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
   }

   function markReady() {
      ready = true;
      waiters.forEach(function (cb) { cb(); });
      waiters = [];
   }

   function load(lang, isSwitch) {
      var code = SUPPORTED[lang] ? lang : 'en';
      current = code;
      try {
         localStorage.setItem(STORAGE_KEY, code);
      } catch (e) { /* ignore */ }

      fetch('lang/' + code + '.json', { cache: 'no-cache' })
         .then(function (res) {
            if (!res.ok) {
               throw new Error('Language file not found');
            }
            return res.json();
         })
         .then(function (data) {
            dict = data || {};
            apply();
            markReady();
            if (isSwitch) {
               document.dispatchEvent(new CustomEvent('site:lang', { detail: { lang: code } }));
            }
         })
         .catch(function () {
            dict = {};
            apply();
            markReady();
         });
   }

   function setLang(lang) {
      if (!SUPPORTED[lang] || (lang === current && ready)) {
         return;
      }
      load(lang, true);
   }

   function whenReady(cb) {
      if (ready) {
         cb();
      } else {
         waiters.push(cb);
      }
   }

   document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-set-lang]') : null;
      if (!btn) {
         return;
      }
      e.preventDefault();
      setLang(btn.getAttribute('data-set-lang'));
   });

   window.SiteI18n = {
      t: t,
      lang: function () { return current; },
      setLang: setLang,
      whenReady: whenReady,
      apply: apply
   };

   load(detectLang(), false);
})(window, document);
