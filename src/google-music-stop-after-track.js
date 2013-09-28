// Glen Chiacchieri
// September 2013
// depends on jquery

// setup the controls

$(document).on('ready', function() {

    var interval = null;
    var setup = function() {
        // setup after loading bar exists and now playing gets made

        if ($('#loading-progress').css('display') === 'none' && $('.now-playing-menu').length !== 0) {

            // inject custom menu item into DOM

            $('.now-playing-menu').append('<div class="goog-menuseparator" style="-webkit-user-select: none;" role="separator" id=":6" aria-hidden="false"></div> <div class="goog-menuitem" role="menuitem" style="-webkit-user-select: none;" id="stop-after-track"><div class="goog-menuitem-content" style="-webkit-user-select: none;">Stop after this track</div></div>');

            // set up hover states for menu item

            var cssClass = 'goog-menuitem-highlight';
            $('#stop-after-track').hover(
                function() {$(this).addClass(cssClass);},
                function() {$(this).removeClass(cssClass);}
            );
            $('#stop-after-track').on('click', toggleStopAfterTrack);

            clearInterval(interval);
        }
    };
    interval = setInterval(setup, 800);


    // state variables
    var shouldStop = false;
    var stopAfterTrack = null;


    // main functions
    var enableStop = function() {
        var $stopAfterTrack = $('#stop-after-track');
        var $subdiv = $stopAfterTrack.find('div');
        shouldStop = true;
        stopAfterTrack = getCurrentTrack();
        // add checkmark
        $subdiv.prepend('&#10003; ');

        // start checking for if we should pause the track
        document.getElementsByTagName("audio")[0].parentNode.addEventListener("ended", trackDone, true);
        interval = setInterval(checkChangedTrack, 500);
    };
    var disableStop = function() {
        var $stopAfterTrack = $('#stop-after-track');
        var $subdiv = $stopAfterTrack.find('div');
        shouldStop = false;
        stopAfterTrack = null;
        $subdiv.text('Stop after this track');
        document.getElementsByTagName("audio")[0].parentNode.removeEventListener("ended", trackDone, true);
        clearInterval(interval);
    };
    var toggleStopAfterTrack = function(evt) {
        if (shouldStop) {
            disableStop();
        } else {
            enableStop();
        }
    };


    // helper functions
    var getCurrentTrack = function() {
        return $('#playerSongInfo').text();
    };
    var trackDone = function () {
        // pause html 5 player
        this.firstChild.pause();
        event.stopImmediatePropagation();
        // sync UI with player state
        $('[data-id="play-pause"]').click();
        disableStop();
    };
    var checkChangedTrack = function() {
        if (getCurrentTrack() != stopAfterTrack) {
            disableStop();
        }
    };
});
