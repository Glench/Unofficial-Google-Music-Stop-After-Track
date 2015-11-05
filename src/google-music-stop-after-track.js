// Glen Chiacchieri
// September 2013
// depends on jquery

// setup the controls

$(document).on('ready', function() {

    var interval = null;
    var setup = function() {
        // setup after loading bar exists and now playing gets made
        var $loadingScreen = $('#loading-progress')
        if ($('#loading-progress').length == 0 && $('.song-menu').length > 0) {

            // inject custom menu item into DOM

            $('.song-menu').append('<div class="goog-menuseparator" style="-webkit-user-select: none;" role="separator" id=":6" aria-hidden="false"></div> <div class="goog-menuitem" role="menuitem" style="-webkit-user-select: none;" id="stop-after-track"><div class="goog-menuitem-content" style="-webkit-user-select: none;">Stop after this track</div></div>');

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
    var oldVolume = null;


    // main functions
    var enableStop = function() {
        var $stopAfterTrack = $('#stop-after-track');
        var $subdiv = $stopAfterTrack.find('div');
        shouldStop = true;
        stopAfterTrack = getCurrentTrack();
        // add checkmark
        $subdiv.prepend('&#10003; ');

        interval = setInterval(checkChangedTrack, 30);
    };
    var disableStop = function() {
        var $stopAfterTrack = $('#stop-after-track');
        var $subdiv = $stopAfterTrack.find('div');
        shouldStop = false;
        stopAfterTrack = null;
        $subdiv.text('Stop after this track');
        // document.getElementsByTagName("audio")[0].removeEventListener("ended", trackDone, true);
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
        var $songInfo = $('#playerSongInfo')
        if ($songInfo.css('display') === 'none') {
            return ''
        }
        return $songInfo.text();
    };
    var pressPauseButton = function() {
        var $playPauseButton = $('[data-id="play-pause"]')
        // once button is enabled, click it
        if ($playPauseButton.attr('aria-disabled') == 'false') {
            $playPauseButton.click();
            $('audio').get(0).volume = oldVolume;
            disableStop();
            return;
        }
        setTimeout(pressPauseButton, 30)
    }
    var checkChangedTrack = function() {
        var currentTrack = getCurrentTrack();
        if (currentTrack != stopAfterTrack) {
            disableStop();

            // I made currentTrack the empty string when user reaches end of playlist
            if (currentTrack !== '') {
                var audio = $('audio').get(0);
                oldVolume = audio.volume;
                audio.volume = 0;
                setTimeout(pressPauseButton, 30)
            }
        }

    };
});
