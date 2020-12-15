/**
 * Common Methods
 */
;(function ( $ ) {
	$(document).ready(function() {

		//퀵메뉴 show & hide 시작 20180530 수정(TOP버튼 추가)
		var lastScrollPosition;
		var scrollPosition = 0;
		$(window).scroll(function(){
			scrollPosition = $(this).scrollTop();

			if ((scrollPosition < lastScrollPosition) || (scrollPosition <= 0)) {
				if (scrollPosition >= ($(document).height() - $(window).height())){
					$('.hsome_quickMenu').removeClass('active');
					$('a.hsome_topBtn').removeClass('upper');
				} else {
					$('.hsome_quickMenu').addClass('active');
					$('a.hsome_topBtn').addClass('upper');
				}
			} else {
				$('.hsome_quickMenu').removeClass('active');
				$('a.hsome_topBtn').removeClass('upper');
			}

			if (scrollPosition > 0) {
				$('a.hsome_topBtn').addClass('active');
			} else {
				$('a.hsome_topBtn').removeClass('active');
			}

			lastScrollPosition = scrollPosition;
		});

		$('a.hsome_topBtn').click(function(){
			$('.hsome_allContents_wrapper').addClass('op');
			setTimeout(function(){
				$('html, body').scrollTop(0);
				$('.hsome_allContents_wrapper').removeClass('op');
			}, 300);

			return false;
		});
		//퀵메뉴 show & hide 끝

		//퀵메뉴 클릭 시작
		var curScrollPosition = 0;
		$('.hsome_quickMenu a').click(function(){
			curScrollPosition = $(window).scrollTop();

			var $page_url = $(this).attr('href');

			if ($(this).parent().index() == 0 || $(this).parent().index() == 3 || $(this).parent().index() == 4) {//샵, 마이페이지 퀵메뉴 클릭하면 해당 화면 로딩 180625 수정
				$(".hsome_quickMenu_contents").addClass('active');

				//180615 수정 시작
				setTimeout(function(){
					getPage($page_url);
					$('.hsome_allContents').addClass('disabled');

				}, 300);
				setTimeout(function(){
					$('.hsome_quickMenu_contents').addClass('absolute');
				}, 400);
				//180615 수정 끝

	      		return false;
      		}
		});

		function getPage(page_url) {
			$('.hsome_quickMenu_contents').html('<img src="images/common/ico_loader.gif" alt="loading" class="hsome_quickMenu_loader" />');
			jQuery.ajax({
				url: page_url,
				data:'',
				type: "get",
				success:function(data){
					setTimeout(function(){
						$('.hsome_quickMenu_contents').html(data);

						initMypage();//180627 추가

						$('.hand_footer_gnb_wrap .footer a.close').click(function(){
							clsPage(curScrollPosition);
						});
					}, 0);
				}
			});
		}
		//퀵메뉴 클릭 끝

		//퀵메뉴 닫기 시작
		function clsPage(par_top){

			$('.hsome_quickMenu_contents').removeClass('absolute');

			setTimeout(function(){//180615 수정
				$(".hsome_quickMenu_contents").removeClass('active');
			}, 0);

			//$('.hsome_allContents').show();
			$('.hsome_allContents').css({ marginTop: par_top*-1 });
			$('.hsome_allContents').removeClass('disabled');
			setTimeout(function(){
				$('.hsome_allContents').css({ marginTop: 0 });
				$(window).scrollTop(par_top);
				$(".hsome_quickMenu_contents").empty();
			}, 300);

			$append_cnt = 0;//180716 추가
			$('.red_border_tab').removeClass('active');//180719 추가
			return false;
		}
		//퀵메뉴 닫기 끝

		//배경색 지정 시작
		backPage();
		function backPage(){
			if ($('.hsome_footer').length > 0) {
				$('html, body').addClass('back');
			}
		}
		//배경색 지정 끝

		//footer toggle 시작
		$('.hsome_footer a.f_info_viewer').click(function(){
			$(this).toggleClass('active');
			$(this).next().slideToggle('fast');
			return false;
		});
		//footer toggle 끝

		/*tab 180716 수정*/
		var $append_cnt = 0;
		$(document).on('click', '.ui_tab li a', function(){

			var $this = $(this),
				$this_parent = $this.closest('.ui_tab');

				$this_parent.addClass('active');

			if ($append_cnt == 0) {
				$this_parent.append('<li class="fcs"></li>');	
				$append_cnt = 1;
			}
			
			$this_parent.find('.fcs').css({
				transform: 'translateX('+ $this.position().left +'px)'
			});
			$(window).resize(function(){
				$this_parent.find('.fcs').css({
					transform: 'translateX('+ $this.position().left +'px)'
				});
			});

			$this.parent('li').siblings('li').removeClass('on');
			$this.parent('li').addClass('on');

			activeCont = $this.attr('href');
			selectCont = $('.tab_cont .cont'+activeCont+'')

			selectCont.siblings('.cont').removeClass('on');
			$('.tab_cont '+activeCont+'').addClass('on');

			return false;
		});

		/*shop*/
		$(document).on('click', '.shop_cont .one_link', function(){

			if($(this).parent('.one_wrap').siblings().is('.two_depth')){
				if($(this).parent('.one_wrap').parent('li').hasClass('on')){
					$(this).parent('.one_wrap').parent('li').toggleClass('on');
				}else{
					$(this).parent('.one_wrap').parents('.one_depth').find('li').removeClass('on');
					$(this).parent('.one_wrap').parent('li').addClass('on');
				}

				$(this).parents('.shop_cont').find('.two_depth , .three_depth').slideUp(300);
				$(this).parents('.shop_cont').find('.one_depth .on .two_depth').slideDown(300);

				return false;
			}
		});

		$(document).on('click', '.shop_cont .two_link', function(){
			if($(this).siblings().is('.three_depth')){
				if($(this).parent('li').hasClass('on')){
					$(this).parent('li').toggleClass('on');
				}else{
					$(this).parents().find('.two_depth').children('li').removeClass('on');
					$(this).parent('li').addClass('on');
				}

				$(this).parents('.shop_cont').find('.three_depth').slideUp(300);
				$(this).parents('.shop_cont').find('.two_depth .on .three_depth').slideDown(300);

				return false;
			}
		});

		$(document).on('click', '.hand_footer_gnb_wrap .ui_tab li a', function(){
			$('.smart_pop').hide();
			$('.smart_wrap').show();
			$('.shop_cont .two_depth , .shop_cont .three_depth').slideUp(300);
			$('.one_lists , .two_lists').removeClass('on');
		})

		/*smart*/
		$(document).on('click', '.smart_list .left_tab a', function(){
			$('.defalut_all').hide();
			$('.list_cont').addClass('on');
		});

		/*smart_pop*/
		$(document).on('click', '.smart_top .filter_link', function(){//180615 수정
			$('.smart_pop').show();
			$('.smart_wrap').hide();

			$('.hand_footer_gnb_wrap a.pre').show();
			$('.hand_footer_gnb_wrap .header .ui_tab').hide();

			var smartSwiper = new Swiper('.smart_pop .product_list', {
				slidesPerView:'auto',
				spaceBetween:5,
				freeMode:true
			});
		});

		$(document).on('click', '.smart_pop .smart_check_btn .check_btn, .hand_footer_gnb_wrap a.pre', function(){//180615 수정
			$('.smart_pop').hide();
			$('.smart_wrap').show();

			$('.hand_footer_gnb_wrap a.pre').hide();
			$('.hand_footer_gnb_wrap .header .ui_tab').show();
		});

		//20180530 추가 시작
		function new_tag_append (el){
			var $el_wid = el.width(),
				$el_parent_wid = el.parent().width();

			if ($el_wid > $el_parent_wid) {
			//if (($el_wid - $el_parent_wid) >= 0) {
				el.parent().stop().animate({
					scrollLeft: $el_wid - $el_parent_wid// + 6
				}, 400);
			}
		}
		//20180530 추가 끝

		//샵 퀵메뉴 > NOMAL 탭 > 브랜드 탭 > 즐겨찾기 추가/삭제 시작 180615 탭 아이디 수정
		var $brand = '',
			$appended_html = '';
		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont .shop_list_brand .like', function(){
			var $this = $(this);

			$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul').addClass('active');
			if ($(this).attr('class').indexOf('on') == -1) {
				$(this).addClass('on');

				$brand = $(this).parent().find('.logo').text();//브랜드 명 가져오기

				$appended_html = '<li class="flag">' +
							'<a href="#" class="name">'+ $brand +'</a>' +
							'<a href="#" class="delete">삭제</a>' +
							'<input type="hidden" name=' + $(this).parent().parent().index() + ' />'
						'</li>';

				$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul').append($appended_html);
				setTimeout(function(){
					$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul li.flag').each(function(){
						if ($(this).attr('class').indexOf('active') == -1) {
							$(this).addClass('active');
						}
					});
				}, 0);

				new_tag_append($('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul'));//20180530 추가

			} else {
				//활성화된 하트버튼을 클릭하면 하트버튼이 비활성화 되고, 추가된 태그가 삭제됨
				$this.removeClass('on');

				$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul li input[name='+ $this.parent().parent().index().toString() +']').parent().removeClass('active');
				setTimeout(function(){
					$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul li input[name='+ $this.parent().parent().index().toString() +']').parent().remove();
				}, 300);

				if ($('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul li').length == 1) {
					$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul').removeClass('active');
				}
			}
		});
		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul .delete', function() {
			var $parent = $(this).parent();
			$('.hand_footer_gnb_wrap .shop_cont .shop_list_brand .one_lists').eq($parent.find('input').attr('name')*1).find('.like').removeClass('on');

			$parent.removeClass('active');
			setTimeout(function(){
				$parent.remove();
			}, 300);

			if ($('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul li').length == 1) {
				$('.hand_footer_gnb_wrap .shop_cont #tab_01 .flag_wrap ul').removeClass('active');
			}

			return false;
		});
		//샵 퀵메뉴 > NOMAL 탭 > 브랜드 탭 > 즐겨찾기 추가/삭제 끝

		//샵 퀵메뉴 > NOMAL 탭 > 카테고리 탭 > 즐겨찾기 추가/삭제 시작 180615 탭 아이디 수정
		var $category_1dth = '',
			// $category_2dth = '',
			$category_3dth = '',
			$category_appended_html = '';
		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont .shop_list_category .like', function(){
			var $this = $(this);

			$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul').addClass('active');

			if ($(this).closest('.one_lists').index() == 0) {
				$category_1dth = 'woman';
			} else if ($(this).closest('.one_lists').index() == 1) {
				$category_1dth = 'man';
			} else if ($(this).closest('.one_lists').index() == 2) {
				$category_1dth = 'life';
			}

			if ($(this).attr('class').indexOf('on') == -1) {
				$(this).addClass('on');
				$category_3dth = $(this).parent().find('a').text();//카테고리 명 가져오기
				$category_appended_html = 	'<li class="flag ' + $category_1dth + '">' +
												'<a href="#" class="name">'+ $(this).closest('.two_lists').find('.two_link').text() + '&gt;' + $category_3dth +'</a>' +
												'<a href="#" class="delete">삭제</a>' +
												'<input type="hidden" name=' +
													$(this).closest('.one_lists').index() + '' +
													$(this).closest('.two_lists').index() + '' +
													$(this).parent().index() + //3depth
												' />' +
											'</li>';

				$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul').append($category_appended_html);
				setTimeout(function(){
					$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul li.flag').each(function(){
						if ($(this).attr('class').indexOf('active') == -1) {
							$(this).addClass('active');
						}
					});
				}, 0);

				new_tag_append($('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul'));//20180530 추가

			} else {
				//활성화된 하트버튼을 클릭하면 하트버튼이 비활성화 되고, 추가된 태그가 삭제됨
				$this.removeClass('on');

				$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul li input[name='+ ($this.closest('.one_lists').index() + '' + $this.closest('.two_lists').index() + '' + $this.parent().index()).toString() +']').parent().removeClass('active');
				setTimeout(function(){
					$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul li input[name='+ ($this.closest('.one_lists').index() + '' + $this.closest('.two_lists').index() + '' + $this.parent().index()).toString() +']').parent().remove();
				}, 300);

				if ($('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul li').length == 1) {
					$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul').removeClass('active');
				}
			}
		});
		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul .delete', function() {
			var $parent = $(this).parent();
			$('.hand_footer_gnb_wrap .shop_cont .shop_list_category .one_lists').eq($parent.find('input').attr('name').charAt(0)*1).find('.two_lists').eq($parent.find('input').attr('name').charAt(1)*1).find('.three_lists').eq($parent.find('input').attr('name').charAt(2)*1).find('.like').removeClass('on');

			$parent.removeClass('active');
			setTimeout(function(){
				$parent.remove();
			}, 300);

			if ($('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul li').length == 1) {
				$('.hand_footer_gnb_wrap .shop_cont #tab_02 .flag_wrap ul').removeClass('active');
			}

			return false;
		});
		//샵 퀵메뉴 > NOMAL 탭 > 카테고리 탭 > 즐겨찾기 추가/삭제 끝

		//샵 퀵메뉴 > SMART 탭 > 필터 조건 추가/삭제 시작
		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_list ul[class*=check_list] li[class*=check] input', function(){

			var $this = $(this);

			if ($this.prop('checked')) {
				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul').addClass('active');
				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_check_btn').addClass('active');//180615 수정

				switch ($('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_list .left_tab li.on').index()) {
					case 0 : $smart_category_1dth = 'woman'; break;
					case 1 : $smart_category_1dth = 'man'; break;
					case 2 : $smart_category_1dth = 'life'; break;
					default : $smart_category_1dth = ''; break;
				}

				$smart_category_3dth = $this.next().html();//카테고리 명 가져오기
				$smart_category_appended_html = '<li class="flag ' + $smart_category_1dth + '">' +
													'<span class="name">'+ $smart_category_3dth +'</span>' +
													'<a href="#" class="delete">삭제</a>' +
													'<input type="hidden" name=' +
														$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_list .left_tab li.on').index() + '' +
														$(this).parent().index() + //2depth
													' />' +
												'</li>';

				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul').append($smart_category_appended_html);
					setTimeout(function(){
						$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul li.flag').each(function(){
							if ($(this).attr('class').indexOf('active') == -1) {
								$(this).addClass('active');
							}
						});
					}, 0);

					new_tag_append($('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul'));//20180530 추가

			} else {
				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul li input[name='+ ($this.closest('.cont').index() + '' + $this.parent().index()).toString() +']').parent().removeClass('active');
				setTimeout(function(){
					$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul li input[name='+ ($this.closest('.cont').index() + '' + $this.parent().index()).toString() +']').parent().remove();
				}, 300);

				if ($('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul li').length == 1) {
					$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul').removeClass('active');
					$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_check_btn').removeClass('active');//180615 수정
				}
			}

		});


		$(document).on('click', '.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul .delete', function() {
			var $parent = $(this).parent();
			$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_list div[id*=smart_tab]').eq($parent.find('input').attr('name').charAt(0)*1).find('ul[class*=check_list] li').eq($parent.find('input').attr('name').charAt(1)*1).find('input').prop('checked', false);

			$parent.removeClass('active');
			setTimeout(function(){
				$parent.remove();
			}, 300);

			if ($('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul li').length == 1) {
				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .flag_wrap ul').removeClass('active');
				$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_check_btn').removeClass('active');//180615 수정
			}

			return false;
		});
		//샵 퀵메뉴 > SMART 탭 > 필터 조건 추가/삭제 끝

		$(document).on('click', '.hand_footer_gnb_wrap .red_border_tab li:nth-child(3) a', function(){//SMART 탭 클릭하면 상품 갯수 카운팅 애니메이션 시작 180719 수정
			jQuery({someValue: $('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_top .filter_num').text()*1}).animate({someValue: 110}, {
				duration: 1000,
				easing:'swing', // can be anything
				step: function() { // called on every step
					// Update the element's text with rounded-up value:
					$('.hand_footer_gnb_wrap .shop_cont .smart_wrap .smart_top .filter_num').text(Math.ceil(this.someValue));
				}
			});
		});

		//180625 추가 시작
		$(document).on('click', '.hand_footer_gnb_wrap .hs_product_list li .chk_mark input', function(){
			if ($(this).is(':checked')) {
				$(this).parent().parent().find('.func_as').addClass('active');
			} else {
				$(this).parent().parent().find('.func_as').removeClass('active');
			}	
		});
		//180625 추가 끝

		//gnb > 마이페이지 180627 추가 시작
		var mypage_opts = {
				slidesPerView: 'auto',
				centeredSlides: true,
				spaceBetween: 25,
				pagination: {
				clickable: true,
			},
		};

		var mypage_card_swiper = new Swiper('.mypage_card_container.swiper-container', mypage_opts);
		function initMypage(){
			mypage_card_swiper = new Swiper('.mypage_card_container.swiper-container', mypage_opts);
			mypage_card_swiper.on('slideChange', function(){
				var $current_slide = $('.mypage_card_container.swiper-container .swiper-slide').eq(mypage_card_swiper.activeIndex);
				var $order = $current_slide.attr('class').indexOf('order'),
					$benefit = $current_slide.attr('class').indexOf('benefit'),
					$infomation = $current_slide.attr('class').indexOf('infomation'),
					$activity = $current_slide.attr('class').indexOf('activity');
				$('.hand_footer_gnb_wrap.mypage .red_border_tab li').removeClass('on');
				if ($order != -1) {
					$('.hand_footer_gnb_wrap.mypage .red_border_tab li').eq(0).addClass('on');
				} else if ($benefit != -1) {
					$('.hand_footer_gnb_wrap.mypage .red_border_tab li').eq(1).addClass('on');
				} else if ($infomation != -1) {
					$('.hand_footer_gnb_wrap.mypage .red_border_tab li').eq(2).addClass('on');
				} else {
					$('.hand_footer_gnb_wrap.mypage .red_border_tab li').eq(3).addClass('on');
				}

				if ($current_slide.find('#chartView').length > 0) {
					mypage_chart();
				}
			});

			//180719 edit start
			if ($('.hand_footer_gnb_wrap.mypage').length > 0) {
				var $mypage_tab = $('.hand_footer_gnb_wrap.mypage .red_border_tab');
				$mypage_tab.append('<li class="fcs"></li>');
				$mypage_tab.find('.fcs').css({ 
					left: $mypage_tab.find('li:first-child a').position().left,
					width: $mypage_tab.find('li:first-child a').outerWidth()
				});
			}

			$(document).on('click', '.hand_footer_gnb_wrap.mypage .red_border_tab li a', function(){
				mypage_card_swiper.slideTo($('.mypage_card_container.swiper-container .swiper-slide.' + $(this).attr('class') + '.start').index());

				var $this = $(this),
					$this_parent = $this.closest('.red_border_tab');
				$this_parent.find('.fcs').css({
					left: 0,
					transform: 'translateX('+ $this.position().left +'px)',
					width: $this.outerWidth()
				});
				$(window).resize(function(){
					$this_parent.find('.fcs').css({
						left: 0,
						transform: 'translateX('+ $this.position().left +'px)',
						width: $this.outerWidth()
					});
				});

				return false;
			});
			//180719 edit end

			// mypage_chart();
		}
		$(document).on('click', '.mypage_card_container .grade_stage.front .s-circle a', function(){//나의 회원등급 혜택 보기
			$(this).closest('.swiper-slide').addClass('active');
			return false;
		});
		$(document).on('click', '.mypage_card_container .grade_stage.back .s-bt a', function(){//온라인 회원 등급 보기
			$(this).closest('.swiper-slide').removeClass('active');
			return false;
		});
		//gnb > 마이페이지 180627 추가 끝

	});
})( jQuery );

function handleChange (el) {//타이틀 영역의 셀렉트 박스
  document
  .querySelector('.hsome_header .selected_text span')
  .innerHTML = el.value
}

function mypage_chart(){
	//180627 마이페이지 > 온라인 회원 등급 그래프 스크립트 추가 시작
	var myGradeChart = echarts.init(document.getElementById('chartView'));
	var myGradeChartOption = {
	    color: '#f1f1f1',
	    series: [{
	        name: 'Line 1',
	        type: 'pie',
	        clockWise: true,
	        radius: ['50%', '47%'],
	        itemStyle: {
	            normal: {
	                label: {
	                    show: false
	                },
	                labelLine: {
	                    show: false
	                }
	            }
	        },
	        hoverAnimation: false, 
	        data: [{
	            value: 80,
	            name: '01',
	            itemStyle: {
	                normal: {
	                    color: '#e46764',
	                    label: {
	                        show: false
	                    },
	                    labelLine: {
	                        show: false
	                    }
	                } 
	            }
	        }, {
	            name: '02',
	            value: 20
	        }]
	    }]
	}
	myGradeChart.setOption(myGradeChartOption);
	//180627 마이페이지 > 온라인 회원 등급 그래프 스크립트 추가 끝	
}
