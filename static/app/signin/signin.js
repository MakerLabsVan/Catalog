(function() {

    $("#iframe-site").css('height', $(window).height() + 'px');
    $("#iframe-site").css('width', $(window).width() + 'px');

    const ONE_MINUTE = 60000;
    const MINUTES = 5;
    var idleTime = 0;
    $(document).ready(function () {
      //Increment the idle time counter every minute.
      var idleInterval = setInterval(timerIncrement, ONE_MINUTE); // 1 minute

      //Zero the idle timer on mouse movement.
      $(this).mousemove(function (e) {
          idleTime = 0;
      });
      $(this).keypress(function (e) {
          idleTime = 0;
      });
  });

  function timerIncrement() {
      idleTime = idleTime + 1;
      if (idleTime > MINUTES ) {
          window.location.href = '/';
          jQuery("body").load(window.location.href);
      }
  };

})();
