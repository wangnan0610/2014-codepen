(function() {
  $(function() {
    var $window = $(window);
    var $document = $(document);
    var $navButtons = $("nav a").filter("[href^=#]");
    var $slidesContainer = $(".slides-container");
    var $slides = $(".slide");
    var $currentSlide = $slides.first();
    var pageHeight = $window.innerHeight();
    var isAnimating = false;
    var $navGoPrev = $(".go-prev");
    var $navGoNext = $(".go-next");

    var keyCodes = {
      UP: 38,
      DOWN: 40
    }

    //init
    goToSlide($currentSlide);

    //add event listener
    $navButtons.on("click", onNavButtonClick);
    $navGoPrev.on('click', goToPrevSlide);
    $navGoNext.on('click', goToNextSlide);
    $document.on("keydown", onKeyDown);
    $window.on("wheel", onMouseWheel);
    $window.on('resize', onWindowResize);

    function onNavButtonClick(event) {
      var $button = $(this);

      var $slide = $($button.attr('href'));

      if ($slide.length > 0) {
        goToSlide($slide);
        event.preventDefault();
      }
    };

    function goToSlide($slide) {

      if (!isAnimating && $slide.length) {
        isAnimating = true;

        $currentSlide = $slide;
        TweenLite.to($slidesContainer, 1, {
          scrollTo: {
            y: pageHeight * $currentSlide.index(),
          },
          onComplete: onSlideChangeEnd,
          onCompleteScope: this
        });

        TweenLite.to($navButtons.filter(".active"), 0.5, {
          className: "-=active"
        });
        TweenLite.to($navButtons.filter("[href=#" + $currentSlide.attr("id") + "]"), 0.5, {
          className: "+=active"
        });
      }
    };

    function onSlideChangeEnd() {
      isAnimating = false;
    }

    function goToPrevSlide() {
      if ($currentSlide.prev().length) {
        goToSlide($currentSlide.prev());
      }
    }

    function goToNextSlide() {
      if ($currentSlide.next().length) {
        goToSlide($currentSlide.next());
      }
    }

    function onKeyDown(event) {
      var keyCode = event.keyCode;

      //UP
      if (keyCode === keyCodes.UP) {
        goToPrevSlide();
        event.preventDefault();
      } else if (keyCode === keyCodes.DOWN) { //DOWN
        goToNextSlide();
        event.preventDefault();
      } else {
        //nothing
      }
    }

    function onMouseWheel(event) {
      //不除30的话会导致连续slide
      var delta = event.originalEvent.deltaY / 30;

      if (delta > 1) {
        goToNextSlide();
        event.preventDefault();
      } else if (delta < -1) {
        goToPrevSlide();
        event.preventDefault();
      }
    }

    function onWindowResize(event) {
      var newPageHeight = $window.innerHeight();

      if (pageHeight !== newPageHeight) {
        pageHeight = newPageHeight;

        TweenLite.set([$slidesContainer, $slides], {
          height: pageHeight + "px"
        });
        TweenLite.set($slidesContainer, {
          scrollTo: {
            y: pageHeight * $currentSlide.index()
          }
        });
      }
    }

  });
})();
