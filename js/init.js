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
      var phoneOk = /^[+0-9][0-9\s().-]{7,}$/.test(contactPhone);

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
   /* Certification Gallery - Dynamic Generation
   ------------------------------------------------------*/

   function loadCertificates() {
      const certificateSources = {
         'Hackerrank': [
            "sql_basic certificate.jpg",
            "sql_advanced certificate.jpg",
            "sql_intermediate certificate.jpg",
            "frontend_developer_react certificate.jpg",
            "react_basic certificate.jpg"
         ],
         'LevelUp FPT': [
            "AI Augmented Engineer for Developer.jpg",
            "BRCMS awareness for Employees by GRC.jpg",
            "Corporate Social Responsibility Training 2025 for All by GRC.jpg",
            "Data Protection Training for All by GDPO.jpg",
            "FPT_Occupational Safety and Health for All by GRC.jpg",
            "ISMS Refresh Training S1 2025 for All by ISM.jpg",
            "Prevention Culture No Recurrent Problems​ for Delivery by SEPG.jpg"
         ],
         'LinkedIn Learning': [
            "CertificateOfCompletion_AIPowered Presentations Crafting Compelling PowerPoints with ChatGPT and Copilot.jpg",
            "CertificateOfCompletion_Agile Teams in the Age of AI.jpg",
            "CertificateOfCompletion_Using AI in the Design to FullStack Development Life Cycle.jpg"
         ],
         'Datacamp': [
            "Introduction to AI Agents.jpg",
            "Understanding ChatGPT.jpg",
            "Understanding Prompt Engineering.jpg"
         ],
         'Coursera': [
            "Use Generative AI as Your Thought Partner.jpg"
         ],
         'Harvard ManageMentor®': [
            "leading_with_generative_ai.jpg",
         ],
         'Udacity': [
            "Go Language (Golang).jpg"
         ],
         'Scrum': [
            "Professional Scrum Master I.jpg",
         ],
         'International Institute of Business Analysis': [
            "Certified Business Analyst Professional (CBAP).jpg",
         ],
         'OutSystems': [
            "Associate Traditional Web Developer.jpg"
         ]
      };

      const container = $('#certification-container');
      const imagePath = 'certificates/photo';

      for (const source in certificateSources) {
         if (Object.hasOwnProperty.call(certificateSources, source)) {
            const imageList = certificateSources[source];
            const sectionId = source.toLowerCase().replace(/[^a-z0-9]/g, '');

            // Tạo HTML cho từng section (tiêu đề và gallery)
            let sectionHtml = `
            <h2 class="source-title">${source}</h2>
            <div id="${sectionId}-gallery" class="bgrid-quarters s-bgrid-thirds cf certification-section">`;

            // Thêm hình ảnh vào gallery
            imageList.forEach(imageName => {
               const imageUrl = `${imagePath}/${imageName}`;
               const cleanName = imageName
                  .replace(/[-_]/g, ' ')
                  .replace(/.jpg/g, '')
                  .replace(/certificate/gi, 'Certificate');

               sectionHtml += `
               <div class="columns portfolio-item">
                  <div class="item-wrap">
                     <a href="${imageUrl}" title="${cleanName}">
                        <img alt="${cleanName}" src="${imageUrl}">
                        <div class="overlay">
                           <div class="portfolio-item-meta">
                              <h5>${cleanName}</h5>
                              <p>View</p>
                           </div>
                        </div>
                        <div class="link-icon"><i class="icon-plus"></i></div>
                     </a>
                  </div>
               </div>`;
            });

            sectionHtml += `</div>`; // Đóng div gallery
            if (source !== Object.keys(certificateSources).pop()) {
               sectionHtml += `<hr>`; // Thêm đường kẻ ngang trừ mục cuối cùng
            }

            container.append(sectionHtml);
         }
      }

      // Khởi tạo Magnific Popup sau khi tất cả nội dung đã được tạo
      $('.item-wrap a').magnificPopup({
         type: 'image',
         gallery: {
            enabled: true
         }
      });
   }
   // Call the function when the page is ready
   loadCertificates();

});