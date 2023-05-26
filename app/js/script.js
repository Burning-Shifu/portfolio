'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // var swiper = new Swiper(".myProjects", {
  //   slidesPerView: 2,
  //   grid: {
  //     rows: 2,
  //   },


  //   pagination: {
  //     el: ".swiper-pagination",
  //     clickable: true,
  //   },

    // breakpoints: {
    //   500: {
    //     slidesPerView: 1,
    //     spaceBetween: 20,
    //   },
    //   600: {
    //     slidesPerView: 2,
    //     spaceBetween: 30,
    //   },
    //   900: {
    //     slidesPerView: 3,
    //     grid: {
    //       rows: 2,
    //     }
    //   },
    // },
  // });
  // const swiper = new Swiper('.projects__slider', {
  //   slidesPerView: 2,
  //   spaceBetween: 30,
  //   pagination: {
  //       el: '.swiper-pagination',
  //   },
  // });

  // breakpoint where swiper will be destroyed
  // and switches to a dual-column layout
  const breakpoint = window.matchMedia( '(min-width:900px)' );
  // keep track of swiper instances to destroy later
  let mySwiper;
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  const breakpointChecker = function() {
    // if larger viewport and multi-row layout needed
    if ( breakpoint.matches === true ) {
        // clean up old instances and inline styles when available
        if ( mySwiper !== undefined ) mySwiper.destroy( true, true );
        // or/and do nothing
        return;
    // else if a small viewport and single column layout needed
    } else if ( breakpoint.matches === false ) {
        // fire small viewport version of swiper
        return enableSwiper();
    }
  };
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  const enableSwiper = function() {
    mySwiper = new Swiper ('.projects__slider', {
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
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  // keep an eye on viewport size changes
  breakpoint.addListener(breakpointChecker);
  // kickstart
  breakpointChecker();


});