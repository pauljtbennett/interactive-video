_V_("video").ready(function(){
	var player = this;
	var points_data;
	var duration = false;
	var in_section = false;

	var delay = 8000;
	var count = delay;
	var counter;

	var snd = new Audio("audio/camera.mp3");
	
	snd.volume = 0.5;

	$.ajax({
		'async': false,
		'global': false,
		'url': 'video-data.php',
		'dataType': "json",
		'success': function(data){
			points_data = data;
		},
		'error':function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	var compareSections = function(a, b){
		if (a.from < b.from)
			return -1;
		if (a.from > b.from)
			return 1;
		return 0;
	};

	points_data = points_data.sort(compareSections);	

	var enterSection = function(s){
		killCountdown();
		cameraFlash();
		player.pause();
			in_section = s.from;

		$.each(s.points, function(j, p){
			if ($('#point-' + p.id).length == 0) {
				$('#video').append('<a href="#" class="point" id="point-' + p.id + '" data-popup="popup-' + p.id + '">&#10133;</a>');
				$('#video').append('<div class="popup" id="popup-' + p.id + '"></div>');

				$('#point-' + p.id).css({
					top: p.y,
					left: p.x
				});

				$('#popup-' + p.id).html(p.name).hide();
				$('#popup-' + p.id).append('<a class="btn" href="#">Buy</a>');
			}
		});

		$('.video-skin').append('<span class="countdown"><span class="bar"></span></span>');

		counter = setInterval(timer, 25);
	};

	var inSection = function(s){

	};

	var leaveSection = function(s){
		in_section = false;

		$('.point').fadeOut(150, function(){
			$(this).remove();
		});
	};

	var jumpToSection = function(s){
		player.currentTime(s.from / 1000);
		enterSection(s);
	};

	var nextSection = function(){
		var sections = points_data;
		var section = false;
		
		$.each(sections, function(i, s){
			var time = s.from / 1000;

			if (time > player.currentTime()) {
				section = s;
				return false;
			}
		});

		return section; // At last section
	};

	var previousSection = function(){
		var sections = points_data;
		var section = false;
		
		$.each(sections.reverse(), function(i, s){
			var time = s.from / 1000;

			if (time < player.currentTime()) {
				section = s;
				return false;
			}
		});

		return section; // At first section
	};

	var trackTime = function(){
		var player = this;
		var player_time = Math.round(player.currentTime() * 1000);

		if (points_data != undefined) {
			$.each(points_data, function(i, s){
				if (s.from <= player_time && s.to >= player_time) {
					if (!in_section) {
						enterSection(s);
					} else {
						inSection(s);
					}
				} else if (in_section == s.from) {
					leaveSection(s);
				}
			});
		}
	};

	var removePopups = function(){
		$('.popup').fadeOut(150, function(){
			$(this).remove();
		});
	};

	var paintTimelineSections = function(){
		if (!duration && player.currentTime() > 0) {
			duration = player.duration();
		
			$.each(points_data, function(i, s){
				var jumpTo = s.from / 1000;
				var position = (jumpTo / duration) * 100;
				
				$('.vjs-progress-holder').append('<a href="#" class="progress-point" id="progress-point-' + i + '" data-jump="' + jumpTo + '">&#10133;</a>');
				$('#progress-point-' + i).css({ left : position + '%' });
			});
		}	
	};

	var timer = function(){
		count = count - 30;
	
		if (count <= 0) {
			console.log('playas gon\' play');
			killCountdown();
			cameraFlash();
			player.play();

			return;
		}

		var width = ((delay - count) / delay) * 100;

		$('.countdown .bar').css({ width : width + '%' });
	};

	var killCountdown = function(){
		clearInterval(counter);
		count = delay;
		$('.countdown').remove();
	};

	var cameraFlash = function(){
		$('#video .overlay').show().css({ opacity : 0.85 }).fadeOut(750);
		
		snd.play();
	};

	player.addEvent("timeupdate", trackTime);
	player.addEvent("timeupdate", paintTimelineSections); // Needs video to be playing to get duration
	player.addEvent("play", removePopups);
	player.addEvent("play", killCountdown);

	$('#video .vjs-play-control').wrap('<div class="vjs-direction-control" />');
	$('#video .vjs-play-control').before('<div class="vjs-prev-control"><div><span class="vjs-control-text">Previous</span></div></div>');
	$('#video .vjs-play-control').after('<div class="vjs-next-control"><div><span class="vjs-control-text">Next</span></div></div>');
	
	$('#video').append('<div class="overlay"></div>');
	$('#video').on('click', '.point', function(e){
		e.preventDefault();
		killCountdown();
		var $self = $(this);

		$('.popup').fadeOut(150, function(){
			$(this).hide();
		});

		if ($('#' + $self.attr('data-popup')).length > 0) {
			var $popup = $('#' + $self.attr('data-popup'));

			if (parseFloat($self.css('left')) > ($('#video').width() / 2)) {
				$popup.css({ 'right': 10 });
			} else {
				$popup.css({ 'left': 10 });
			}

			$popup.fadeIn(150);
		}
	});

	$('#video').on('click', '.progress-point', function(e){
		e.preventDefault();
		var $self = $(this);

		player.currentTime($self.attr('data-jump'));
	});

	$('.vjs-next-control span').bind("click", function(){
		if (nextSection()) {
			jumpToSection(nextSection());
		}
	});

	$('.vjs-prev-control span').bind("click", function(){
		if (previousSection()) {
			jumpToSection(previousSection());
		}
	});	
});