/**
 * Common Methods
 */

function getBodyScrollTop() {
	var el = document.scrollingElement || document.documentElement;

	// return el.scrollTop;
	return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
}

// STYLE COMMON API
var StyleCommon = StyleCommon || {};
StyleCommon = (function(doc, global) {
	// PRIVATE VARIABLE
	var obj = {};

	// PRIVATE METHOD
	function preventDefault(_evt){
		if(_evt.cancelable) {
			_evt.preventDefault();
		}
	}

	function preventMomentumScroll(_el){
		var scrollTop = _el.scrollTop,
			offsetHeight = _el.offsetHeight,
			scrollHeight = _el.scrollHeight;
		if(scrollTop == 0){
			_el.scrollTo(0, 1);
			return true;
		}

		if(scrollTop + offsetHeight >= scrollHeight) {
			_el.scrollTo(0, scrollHeight - offsetHeight -1);
			return true;
		}
		return false;
	}

	// PUBLIC METHOD
	obj.scrollLock = function(_flag){
		if(_flag){
			doc.querySelector('body').classList.add('body_hold');
		}else{
			doc.querySelector('body').classList.remove('body_hold');
		}

		['scroll', 'touchmove', 'mousewheel'].forEach(function(_evtNm){
			if(_flag) window.addEventListener(_evtNm, preventDefault, {passive:false});
			else window.removeEventListener(_evtNm, preventDefault);
		});
	};

	obj.forceScroller = function(_el){

		_el.onscroll = function(_evt){
			preventMomentumScroll(_evt.currentTarget);
		};
		_el.ontouchmove = function(_evt){
			if(!preventMomentumScroll(_evt.currentTarget) && _evt.cancelable){
				_evt.stopPropagation();
			}
		};
		_el.onmousewheel = function(_evt){
			if(!preventMomentumScroll(_evt.currentTarget)){
				_evt.stopPropagation();
			}
		}
	};

	obj.scrollToSmooth = function(_top){
		var headerHeight = doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap').offsetHeight : 0;
		window.scrollTo({
			top: _top - headerHeight,
			behavior: 'smooth'
		});
	};

	obj.animateScrollTo = function(_selector, _duration, _adjust) {
		_duration = 400; //이동시간
		_adjust = 60; //조정값
		var targetEle = document.querySelector(_selector);

		if (!targetEle){return;}

		// - Get current & target positions
		var scrollEle = document.documentElement || window.scrollingElement,
			currentY = scrollEle.scrollTop,
			targetY = targetEle.offsetTop - (_adjust || 0);
		animateScroll(currentY, targetY, _duration);

		// - Animate and scroll to target position
		function animateScroll(_startY, _endY, _duration) {
			_duration = _duration ? _duration : 600;
			var unitY = (targetY - currentY) / _duration;
			var startTime = new Date().getTime();
			var endTime = new Date().getTime() + _duration;
			var scrollTo = function() {
				var now = new Date().getTime();
				var passed = now - startTime;
				if (now <= endTime) {
					scrollEle.scrollTop = currentY + (unitY * passed);
					requestAnimationFrame(scrollTo);
				}
				else {
					console.log('End off.')
				}
			};
			requestAnimationFrame(scrollTo);
		};
	};

	return obj;
})(document, window);

// LAYOUT COMMON MOVEMENT
var Wrapper = Wrapper || {};
Wrapper = (function(doc, global) {
	// ELEMENTS INITIALIZE
	var obj = {},
		header = {
			_that : doc.querySelector('#header'),
			_back : null,
			_backBtnHandler : backBtnHandler,
			_topLogo : doc.querySelector('.header_logo'),
			_topLogoBtnHandler : null,
			_gnbBtn : doc.querySelector('.gnb_btn'),
			_gnbBtnHandler : null,
			_close : null,
			_closeBtnHandler : closeBtnHandler,
			_load : {
				_that : null,
				_timer : null
			}
		},
		body = doc.querySelector('body'),
		scroller = doc.querySelector('html'),
		wrapper = doc.querySelector('#wrapper'),
		container = doc.querySelector('#container'),
		beforeTop = 0,
		lastScroll = 0,
		bodyHeight = body.offsetHeight,
		scollerGestureCallback;

	// PRIVATE FUNCTIONS
	function initialize(){
		global.addEventListener('scroll', wrapperHandler, false);
		global.addEventListener('load', wrapperHandler, false);

		global.addEventListener('orientationchange', orientationChangeHandler, true);
		body.addEventListener('load', orientationChangeHandler, true);

		if(header) {
			if(header._topLogo){
				header._topLogo.addEventListener('click', topLogoBtnHandler, true);
			}
			if(header._gnbBtn){
				header._gnbBtn.addEventListener('click', gnbBtnHandler);
			}
		}
	}

	function wrapperHandler(_evt){
		if(getBodyScrollTop() > beforeTop && getBodyScrollTop() > 0){ // UP GESTURE
			// if(scroller.scrollTop > 0 && !doc.querySelector('#header').classList.contains('fixed')){ // ADD HEADER FIXED
			if(getBodyScrollTop() > 0 && !doc.querySelector('#header').classList.contains('fixed')){ // ADD HEADER FIXED
				doc.querySelector('#header').classList.add('fixed');
				//doc.querySelector('#wrapper').style.paddingTop = doc.querySelector('#header').clientHeight + 'px';
			}
			if(scollerGestureCallback) scollerGestureCallback('UP', scroller);
		}else{ // DOWN GESTURE
			// if(scroller.scrollTop == 0 && doc.querySelector('#header').classList.contains('fixed')){ // ON TOP SCROLL POSITION REMOVE HEADER FIXED
			if(getBodyScrollTop() == 0 && doc.querySelector('#header').classList.contains('fixed')) { // ON TOP SCROLL POSITION REMOVE HEADER FIXED
				doc.querySelector('#header').classList.remove('fixed');
				doc.querySelector('#wrapper').style.paddingTop = '0px';
			}
			if(scollerGestureCallback) scollerGestureCallback('DOWN', scroller);
		}
		// if(!mainScrollDisabled) beforeTop = scroller.scrollTop;
		// beforeTop = scroller.scrollTop;
		beforeTop = getBodyScrollTop();
	}

	obj.wrapperHandler = wrapperHandler;

	function orientationChangeHandler(){
		setTimeout(function(){
			if(body.offsetHeight < body.offsetWidth){ // LANDSCAPE
				body.classList.add('lands')
			}else{ // PORTRATE
				body.classList.remove('lands');
			}
		}, 100);
	}

	function topLogoBtnHandler(_evt){

	}

	//gnb_btn click function
	function gnbBtnHandler(_evt){
		var gnbWrap = doc.querySelector('.gnb_wrap');
		if(gnbWrap.classList.contains('on')) {
			header._that.classList.remove('gnb_on');
			gnbWrap.classList.remove('on');
			header._gnbBtn.classList.remove('on');
			StyleCommon.scrollLock(false);
		}else {
			header._that.classList.add('gnb_on');
			gnbWrap.classList.add('on');
			header._gnbBtn.classList.add('on')
			StyleCommon.scrollLock(true);
		}
	}

	function backBtnHandler(_evt){
		global.history.back();
	}

	function closeBtnHandler(_evt){
		global.history.back();
	}

	// VALIDATION
	if(doc.querySelector('#header') && wrapper) setTimeout(initialize, 0);
	
	return obj;
})(document, window);

// WorksNav
var WorksNav = WorksNav || {};
WorksNav = (function(doc, global) {
	// ELEMENTS INITIALIZE
	var obj = {},
		body = doc.querySelector('body'),
		gnbD1 = doc.querySelector('.gnb_menu'),
		wnbD1 = doc.querySelector('.wnb_d1_wrap');

	// PRIVATE FUNCTIONS
	function initialize(){
		drawWorksNav(); //from works_data.js
	}

	obj.checkCurrentWorksNav = function(gnb,d1,d2) {
		setTimeout(function(){
			console.log("start");
			//console.log(work sNavData);
			gnbD1.querySelectorAll('li').forEach(function(_el,_idx){
				let tempTxt1 = _el.querySelector('a').getAttribute('data-menu-id');
				if(tempTxt1 === gnb){
					_el.classList.add('on');
				}
			});
			wnbD1.querySelectorAll('.d1_li').forEach(function(_el1,_idx1){
				//console.log(_el)
				let tempTxt1 = _el1.querySelector('a > span').innerText;
				if(tempTxt1 === d1){
					_el1.classList.add('on');
				}
				let wnbD2 = _el1.querySelector('.wnb_d2_wrap');
				if(wnbD2) {
					wnbD2.querySelectorAll('.d2_li').forEach(function(_el2,_idx2) {
						let tempTxt2 = _el2.querySelector('a > span').innerText;
						if(tempTxt2 === d2){
							_el2.classList.add('on');
						}
					});
				}
			});
		},100);
	}

	// VALIDATION
	if(doc.querySelector('.wnb_d1_wrap')) setTimeout(initialize, 0);

	return obj;
})(document, window);