/*Copyright (c) 2013 Brian Franco

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.*/


$(function(){  
	// -- Initialization --
	$('.main').hide().fadeIn(2000);
	var store = localStorage;	
	
	// --- Called upon editing ---
	// ===========================
	$.fn.updateThermo = function() {
		var data = store.getItem($(this).parent().parent().attr("id")+"_saved");
		if (data) {
			var saved = data;
			var $goal = $(this).parent().parent().attr("data-amount");
			var $sofar = ((320*saved)/$goal)-12;
			var color = $(this).parent().parent().attr('data-color');
			
			$(this).html(saved);
			if (parseInt(saved) >= parseInt($goal)) { 
				$(this).parent().parent().addClass('done');
				$(this).parent().parent().css('box-shadow','inset 0 0 8px #ddd, 0 0 10px hsla('+color+',50%,50%,1)');
				$(this).parent().parent().children('header').css('box-shadow','0 0 10px hsla('+color+',50%,50%,1)');
			} 
			else {
				$(this).parent().parent().removeClass('done');
				$(this).parent().parent().css('box-shadow','inset 0 0 8px #ddd, 0 0 10px hsla('+color+',50%,50%,0)');
				$(this).parent().parent().children('header').css('box-shadow','0 0 10px hsla('+color+',50%,50%,0)');
			}
			
			var snd = new Audio("bling.wav")
			
			if ($sofar < 12) {	$(this).parent().css('height','3%'); }
			else { $(this).parent().css('height',$sofar); snd.play(); }
		}
	};
	
	// --- Called on start or creation of thermo ---
	// =============================================
	$.fn.buildThermo = function() {
		//Build new stuff
		var args = arguments[0] || {};
		var name = args.title;
		var val = args.value;
		var img = args.image;
		var par = args.parent;
		var saved = args.saved;
		var color = args.color;
		
		var newsection = $('<section class="goal"></section>');
		par.append(newsection);
		//newsection.hide();
		//newsection.show('slow');
		newsection.append('<header></header><h1></h1><h2></h2><ul><li><a href="#" class="del" title="Delete">&times;</a></li></ul>');
		newsection.append('<div class="sofar"><span class="top"></span><h2 class="editable" contentEditable="true"></h2><span class="fancy"></span></div>');
		
		//Set new stuff
		newsection.attr('id',goalcount);
		newsection.attr('data-name', name);
		newsection.children('h1').append(name);
		newsection.attr('data-amount', val);
		newsection.children('h2').append(val);
		
		//Set image if string wasn't empty
		if (img != '' || img != null) { 
			newsection.children('header').append(
				'<i class="'+img+'"></i>'
			); 
		}
		
		//Make sure stuff exists before setting
		if (val != null && name != null && img != null) {
			store.setItem(newsection.attr("id")+"_val", val);
			store.setItem(newsection.attr("id")+"_name", name);
			store.setItem(newsection.attr("id")+"_img", img);
		}
		
		if (saved != "undefined") { 
			store.setItem(newsection.attr("id")+"_saved", saved);
			newsection.children('.sofar').children('h2').append(saved);
		}
		else { store.setItem(newsection.attr("id")+"_saved", "0"); }
		
		//Update goal counter
		++goalcount;
		
		//Colors	
		newsection.attr('data-color', color);
		newsection.children('header').css('background','hsla('+color+',75%,55%,1)');
		newsection.children('.sofar').css('background','hsla('+color+',75%,55%,1)');
		newsection.children('.sofar').children('.top').css('background','hsla('+color+',75%,30%,1)');
		newsection.children('.sofar').children('h2').css('color','hsla('+color+',75%,55%,1)');	
	}
	
	// --- Readjust counts when removing thermos ---
	// =============================================
	$.fn.countFix = function() {
		var args = arguments[0] || {};
		var id = parseInt(args.num);
		var idp = id+1;
		
		if (store.getItem(idp+"_name") != null) {
			//alert('Setting tables '+id+" to the next tables value");
			store.setItem(id+"_name",store.getItem(idp+"_name"));
			store.setItem(id+"_val",store.getItem(idp+"_val"));
			store.setItem(id+"_img",store.getItem(idp+"_img"));
			store.setItem(id+"_saved",store.getItem(idp+"_saved"));
			if (store.getItem(idp+1+"_name") == null) {
				//alert('Deleting now nonexistant table '+idp);
				store.removeItem(idp+'_id');
				store.removeItem(idp+'_val');
				store.removeItem(idp+'_img');
				store.removeItem(idp+'_name');
				store.removeItem(idp+'_saved');
				--goalcount;
			}
			else {
				$(this).countFix({num: idp });
			}
		}
		else {
			//alert('Deleting table '+id+", since it's the last");
			store.removeItem(id+'_id');
			store.removeItem(id+'_val');
			store.removeItem(id+'_img');
			store.removeItem(id+'_name');
			store.removeItem(id+'_saved');
			--goalcount;
		}
	}

	// --- Update previously saved info ---
	// ====================================

	var goalcount = 0;
	if (store.length > 0) { $('.starter').hide(); }
	while (store.getItem(goalcount+"_val") != null) {
		$('header .new.on').removeClass('on');
		var rColor = Math.floor(Math.random()*61);
		$('.main').buildThermo({
			parent: $('.main'),
			title: store.getItem(goalcount+"_name"),
			value: store.getItem(goalcount+"_val"),
			image: store.getItem(goalcount+"_img"),
			saved: store.getItem(goalcount+"_saved"),
			color: rColor
		});
	} 

	$('section.goal .sofar h2').each(function() {
		$(this).updateThermo();
	});	
	
	// -- Edit info --
	$('body').on('focus','.editable', function() {
		$(this).addClass('edit');
	});

	// Enter blurs, not line breaks
	$(document).keypress(function(e) {
		if(e.which == 13) {
			$('.edit').blur();
		}
	});

	// Adjust thermo with newly edited value
	$('body').on('blur','.editable', function() {
		var val = $(this).html().replace(/\D/g,'');
		store.setItem($(this).parent().parent().attr("id")+"_saved", val);
		$(this).updateThermo();
		$(this).removeClass('edit');
	});
	
	// -- Navigation Menu Buttons
	$('.about').click( function() { 
		$('.about-box').toggleClass('on');
	});

	$('.clear').click( function() { 
		store.clear(); 
		$('section.goal').hide();
		$('section.goal').remove;
		$('.starter').show('slow');
	});

	// Open Add menu
	$('.add').click( function() { 
		$('header .new').toggleClass('on'); 
	});

	// Opens icon menu
	$('.ico').click( function() { 
		$('.ico-menu').toggleClass('on'); 
	});

	// Icon select
	$('.ico-menu i').click( function() { 
		var icoclass = $(this).attr('class');
		$('.ico').attr('class',"ico");
		$('.ico').addClass(icoclass);
		$('.ico-menu').removeClass('on'); 
	});
	
	// -- Add new info --
	$('header .new a').click( function() {
		//Save values
		var name = $('input.name').val();
		var val = $('input.val').val();
		var img = $('.ico').attr('class').replace('ico ','');
		var rColor = Math.floor(Math.random()*61);
		
		$(this).buildThermo({
			parent: $('.main'),
			title: name,
			value: val.replace('$',''),
			image: img,
			saved: '0',
			color: rColor
		});
		
		$('.starter').hide('slow');
		$('.ico-menu').removeClass('on');
		$('.ico').attr('class',"ico");
		$('.new').removeClass('on');
	});
	
	//Thermo "inline" options
	$('.main').on("click", '.del', function(e) { 
		e.preventDefault();
		var section = $(this).parent().parent().parent();
		var sectionid = section.attr('id')
		section.hide('slow', function () {
			section.remove();

			if ($('.goal').length == 0 ) { 
				$('.starter').show('slow');
			}
		});

		$('.main').countFix({num: sectionid});
	});
	
});