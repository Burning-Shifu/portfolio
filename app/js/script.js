'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // slider

  // breakpoint where swiper will be destroyed
  // and switches to a dual-column layout
  const breakpoint = window.matchMedia('(min-width:900px)');
  // keep track of swiper instances to destroy later
  let mySwiper;

  const breakpointChecker = function () {
    // if larger viewport and multi-row layout needed
    if (breakpoint.matches === true) {
      // clean up old instances and inline styles when available
      if (mySwiper !== undefined) mySwiper.destroy(true, true);
      // or/and do nothing
      return;
      // else if a small viewport and single column layout needed
    } else if (breakpoint.matches === false) {
      // fire small viewport version of swiper
      return enableSwiper();
    }
  };

  const enableSwiper = function () {
    mySwiper = new Swiper('.projects__slider', {
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        600: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
      },
    });
  };

  // keep an eye on viewport size changes
  breakpoint.addListener(breakpointChecker);
  // kickstart
  breakpointChecker();

  // end slider

  // portfolio slides

  let slides = document.querySelectorAll(".projects__item-content");

  slides.forEach((slide) => {
    slide.addEventListener('click', () => {
      const slideHover = slide.querySelector(".projects__item-hover");
      slideHover.classList.toggle('_open');
    });
  });

  // end portfolio slides

  // video

  new ModalVideo('.js-modal-btn');

  // end video

  // form

  const form = document.getElementById('contact-form'),
    notify = form.querySelector('.contact__notification');

  form.addEventListener('submit', formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);
    let formData = new FormData(form);

    if (error === 0) {
      form.classList.add('_sending');

      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        let result = await response.json();
        notify.textContent = result.message;
        form.reset();
        form.classList.remove('_sending');
      } else {
        alert("Error!");
        form.classList.remove('_sending');
      }

    } else {
      notify.textContent = "Please try again!"
    }
  }

  function formValidate(e) {
    let error = 0;
    const formReq = document.querySelectorAll('._req'); +

      formReq.forEach((input) => {
        formRemoveError(input);

        if (input.classList.contains('_email')) {
          let emailValidationResult = validateEmail(input);
          if (emailValidationResult !== "valid") {
            formAddError(input);
            error++;
            notify.textContent = emailValidationResult;
          }
        } else {
          if (input.value.trim() === "") {
            formAddError(input);
            error++;
            notify.textContent = "Please fill all required fields!"
          }
        }
      });
    return error;
  }
  function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }
  function validateEmail(input) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)) {
      return "Please enter a valid email"; // This  message will be displayed
    } else {
      return "valid";
    }
  }

  // end form
});