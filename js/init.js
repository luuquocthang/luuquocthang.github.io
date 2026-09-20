/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/

jQuery(document).ready(function ($) {

   /*----------------------------------------------------*/
   /* FitText Settings
   ------------------------------------------------------ */

   setTimeout(function () {
      $('h1.responsive-headline').fitText(1, { minFontSize: '40px', maxFontSize: '90px' });
   }, 100);


   /*----------------------------------------------------*/
   /* Smooth Scrolling
   ------------------------------------------------------ */

   $('.smoothscroll').on('click', function (e) {
      e.preventDefault();

      var target = this.hash,
         $target = $(target);

      $('html, body').stop().animate({
         'scrollTop': $target.offset().top
      }, 800, 'swing', function () {
         window.location.hash = target;
      });
   });


   /*----------------------------------------------------*/
   /* Highlight the current section in the navigation bar
   ------------------------------------------------------*/

   var sections = $("section");
   var navigation_links = $("#nav-wrap a");

   sections.waypoint({

      handler: function (event, direction) {

         var active_section;

         active_section = $(this);
         if (direction === "up") active_section = active_section.prev();

         var active_link = $('#nav-wrap a[href="#' + active_section.attr("id") + '"]');

         navigation_links.parent().removeClass("current");
         active_link.parent().addClass("current");

      },
      offset: '35%'

   });


   /*----------------------------------------------------*/
   /* Make sure that #header-background-image height is
   /* equal to the browser height.
   ------------------------------------------------------ */

   $('header').css({ 'height': $(window).height() });
   $(window).on('resize', function () {

      $('header').css({ 'height': $(window).height() });
      $('body').css({ 'width': $(window).width() })
   });


   /*----------------------------------------------------*/
   /* Fade In/Out Primary Navigation
   ------------------------------------------------------*/

   $(window).on('scroll', function () {

      var h = $('header').height();
      var y = $(window).scrollTop();
      var nav = $('#nav-wrap');

      if ((y > h * .20) && (y < h) && ($(window).outerWidth() > 768)) {
         nav.fadeOut('fast');
      }
      else {
         if (y < h * .20) {
            nav.removeClass('opaque').fadeIn('fast');
         }
         else {
            nav.addClass('opaque').fadeIn('fast');
         }
      }

   });


   /*----------------------------------------------------*/
   /* Modal Popup
   ------------------------------------------------------*/

   $(document).on('click', '.popup-modal-dismiss', function (e) {
      e.preventDefault();
      $.magnificPopup.close();
   });

   var contactPopupOptions = {
      type: 'inline',
      midClick: true,
      removalDelay: 200,
      mainClass: 'mfp-fade mfp-contact',
      closeBtnInside: true,
      callbacks: {
         open: function () {
            $('#contactForm').show();
            $('#message-warning, #message-success').hide();
         }
      }
   };

   $('.contact-popup').magnificPopup(contactPopupOptions);

   if (window.location.hash === '#contact-modal') {
      $.magnificPopup.open($.extend({
         items: { src: '#contact-modal' }
      }, contactPopupOptions));
   }


   /*----------------------------------------------------*/
   /* Flexslider
   /*----------------------------------------------------*/
   $('.flexslider').flexslider({
      namespace: "flex-",
      controlsContainer: ".flex-container",
      animation: 'slide',
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 7000,
      animationSpeed: 600,
      randomize: false,
   });

   /*----------------------------------------------------*/
   /* contact form  (Web3Forms -> email)
      Get a free access key: https://web3forms.com
      then paste it below. Restrict the key to this domain
      in the Web3Forms dashboard after the first successful send.
   ------------------------------------------------------*/

   var WEB3FORMS_ACCESS_KEY = '931eedb7-d53f-4520-af9b-e8d3e5e91899';

   $('form#contactForm button.submit').click(function (e) {
      e.preventDefault();

      var contactName = $.trim($('#contactForm #contactName').val());
      var contactEmail = $.trim($('#contactForm #contactEmail').val());
      var contactPhone = $.trim($('#contactForm #contactPhone').val());
      var contactSubject = $.trim($('#contactForm #contactSubject').val());
      var contactMessage = $.trim($('#contactForm #contactMessage').val());
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
      var phoneOk = contactPhone === '' || /^[+0-9][0-9\s().-]{7,}$/.test(contactPhone);

      if (contactName.length < 2) {
         $('#message-warning').html('Please enter your name.').fadeIn();
         return false;
      }
      if (!emailOk) {
         $('#message-warning').html('Please enter a valid email address.').fadeIn();
         return false;
      }
      if (!phoneOk) {
         $('#message-warning').html('Please enter a valid phone number.').fadeIn();
         return false;
      }
      if (contactMessage.length < 10) {
         $('#message-warning').html('Please enter a message (at least 10 characters).').fadeIn();
         return false;
      }
      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
         $('#message-warning').html('Contact form is not configured yet. Please email thanglq.l2t@gmail.com directly.').fadeIn();
         return false;
      }

      $('#image-loader').fadeIn();
      $('#message-warning').hide();

      $.ajax({
         type: 'POST',
         url: 'https://api.web3forms.com/submit',
         contentType: 'application/json',
         dataType: 'json',
         data: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            subject: contactSubject || 'New message from luuquocthang.github.io',
            message: contactMessage,
            from_name: contactName,
            replyto: contactEmail,
            botcheck: $('#contactForm input[name="botcheck"]').is(':checked')
         }),
         success: function (res) {
            $('#image-loader').fadeOut();
            if (res && res.success) {
               $('#message-warning').hide();
               $('#contactForm').fadeOut();
               $('#message-success').fadeIn();
            } else {
               $('#message-warning').html((res && res.message) || 'Something went wrong. Please try again.').fadeIn();
            }
         },
         error: function () {
            $('#image-loader').fadeOut();
            $('#message-warning').html('Could not send the message. Please email thanglq.l2t@gmail.com instead.').fadeIn();
         }
      });
      return false;
   });


   /*----------------------------------------------------*/
   /* Credentials — compact list, not a gallery
   ------------------------------------------------------*/

   function prettyCertName(fileName) {
      var map = {
         'sql_basic certificate.jpg': 'SQL (Basic)',
         'sql_advanced certificate.jpg': 'SQL (Advanced)',
         'sql_intermediate certificate.jpg': 'SQL (Intermediate)',
         'frontend_developer_react certificate.jpg': 'Frontend Developer (React)',
         'react_basic certificate.jpg': 'React (Basic)',
         'AI Augmented Engineer for Developer.jpg': 'AI-Augmented Engineer for Developers',
         'BRCMS awareness for Employees by GRC.jpg': 'BRCMS Awareness',
         'Corporate Social Responsibility Training 2025 for All by GRC.jpg': 'Corporate Social Responsibility (2025)',
         'Data Protection Training for All by GDPO.jpg': 'Data Protection',
         'FPT_Occupational Safety and Health for All by GRC.jpg': 'Occupational Safety and Health',
         'ISMS Refresh Training S1 2025 for All by ISM.jpg': 'ISMS Refresh (2025)',
         'Prevention Culture No Recurrent Problems​ for Delivery by SEPG.jpg': 'Prevention Culture for Delivery',
         'CertificateOfCompletion_AIPowered Presentations Crafting Compelling PowerPoints with ChatGPT and Copilot.jpg': 'AI-Powered Presentations',
         'CertificateOfCompletion_Agile Teams in the Age of AI.jpg': 'Agile Teams in the Age of AI',
         'CertificateOfCompletion_Using AI in the Design to FullStack Development Life Cycle.jpg': 'AI in the Design-to-Full-Stack Lifecycle',
         'Introduction to AI Agents.jpg': 'Introduction to AI Agents',
         'Understanding ChatGPT.jpg': 'Understanding ChatGPT',
         'Understanding Prompt Engineering.jpg': 'Understanding Prompt Engineering',
         'Use Generative AI as Your Thought Partner.jpg': 'Generative AI as a Thought Partner',
         'leading_with_generative_ai.jpg': 'Leading with Generative AI',
         'Go Language (Golang).jpg': 'Go (Golang)',
         'Professional Scrum Master I.jpg': 'Professional Scrum Master I',
         'Certified Business Analyst Professional (CBAP).jpg': 'Certified Business Analysis Professional (CBAP)',
         'Associate Traditional Web Developer.jpg': 'Associate Traditional Web Developer (OutSystems 11)'
      };
      if (map[fileName]) {
         return map[fileName];
      }
      return fileName
         .replace(/CertificateOfCompletion[_ ]?/gi, '')
         .replace(/[-_]/g, ' ')
         .replace(/\.jpg$/i, '')
         .replace(/certificate/gi, '')
         .replace(/\s+/g, ' ')
         .trim();
   }

   function loadCertificates() {
      var groups = [
         {
            title: 'Professional',
            items: [
               { file: 'Professional Scrum Master I.jpg', issuer: 'Scrum.org' },
               { file: 'Certified Business Analyst Professional (CBAP).jpg', issuer: 'IIBA' },
               { file: 'Associate Traditional Web Developer.jpg', issuer: 'OutSystems' },
               { file: 'Go Language (Golang).jpg', issuer: 'Udacity' },
               { file: 'sql_advanced certificate.jpg', issuer: 'HackerRank' },
               { file: 'sql_intermediate certificate.jpg', issuer: 'HackerRank' },
               { file: 'sql_basic certificate.jpg', issuer: 'HackerRank' },
               { file: 'frontend_developer_react certificate.jpg', issuer: 'HackerRank' },
               { file: 'react_basic certificate.jpg', issuer: 'HackerRank' }
            ]
         },
         {
            title: 'AI and product',
            items: [
               { file: 'AI Augmented Engineer for Developer.jpg', issuer: 'FPT' },
               { file: 'leading_with_generative_ai.jpg', issuer: 'Harvard ManageMentor' },
               { file: 'Use Generative AI as Your Thought Partner.jpg', issuer: 'Coursera' },
               { file: 'Introduction to AI Agents.jpg', issuer: 'DataCamp' },
               { file: 'Understanding Prompt Engineering.jpg', issuer: 'DataCamp' },
               { file: 'Understanding ChatGPT.jpg', issuer: 'DataCamp' },
               { file: 'CertificateOfCompletion_Using AI in the Design to FullStack Development Life Cycle.jpg', issuer: 'LinkedIn Learning' },
               { file: 'CertificateOfCompletion_Agile Teams in the Age of AI.jpg', issuer: 'LinkedIn Learning' },
               { file: 'CertificateOfCompletion_AIPowered Presentations Crafting Compelling PowerPoints with ChatGPT and Copilot.jpg', issuer: 'LinkedIn Learning' }
            ]
         },
         {
            title: 'Company training',
            note: 'Internal programs at FPT Software.',
            items: [
               { file: 'BRCMS awareness for Employees by GRC.jpg', issuer: 'FPT' },
               { file: 'Corporate Social Responsibility Training 2025 for All by GRC.jpg', issuer: 'FPT' },
               { file: 'Data Protection Training for All by GDPO.jpg', issuer: 'FPT' },
               { file: 'FPT_Occupational Safety and Health for All by GRC.jpg', issuer: 'FPT' },
               { file: 'ISMS Refresh Training S1 2025 for All by ISM.jpg', issuer: 'FPT' },
               { file: 'Prevention Culture No Recurrent Problems​ for Delivery by SEPG.jpg', issuer: 'FPT' }
            ]
         }
      ];

      var container = $('#certification-container');
      var imagePath = 'certificates/photo';
      var html = '';

      groups.forEach(function (group) {
         html += '<div class="credential-group">';
         html += '<h4>' + group.title + '</h4>';
         if (group.note) {
            html += '<p class="credential-note">' + group.note + '</p>';
         }
         html += '<ul class="credential-list">';
         group.items.forEach(function (item) {
            var name = prettyCertName(item.file);
            var url = imagePath + '/' + item.file;
            html += '<li><a class="credential-link" href="' + url + '" title="' + name + '">' + name + '</a>';
            html += '<span class="credential-issuer">' + item.issuer + '</span></li>';
         });
         html += '</ul></div>';
      });

      container.html(html);

      $('.credential-link').magnificPopup({
         type: 'image',
         gallery: { enabled: true }
      });
   }

   loadCertificates();

});