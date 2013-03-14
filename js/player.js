_V_("video").ready(function(){
	var player = this;
	var points_data;
	var duration = false;

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

	var in_section = false;
	var trackTime = function(){
		var player = this;
		var player_time = Math.round(player.currentTime() * 1000);

		if (points_data != undefined) {
			$.each(points_data, function(i, s){
				if (s.from <= player_time && s.to >= player_time) {
					if (!in_section) {
						// Entering section
						cameraFlash();
						player.pause();
 						in_section = i + 1; // Avoid 0 base issue

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
					} else {
						// In section
					}
				} else if (in_section == i + 1) {
					// Leaving section
					in_section = false;

					$('.point').fadeOut(150, function(){
						$(this).remove();
					});
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
	player.addEvent("play", removePopups);

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
});