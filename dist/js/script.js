$(function() {
  $('html').removeClass('no-js');

  var body = $('body');

	validation_scripts();  
});

function validation_scripts() {
  var body = $('body');

  body.on('click touch', '.js-validate-form :submit', function(e) {
  	var form = $(this).closest('form');
  	console.log(validateForm(form));
  	return false;
  });

  body.on('keyup change', '.input--error, .input--success', function() {
    if ( validInput( $(this) ) )  {
    	$(this).removeClass('input--error');
      $(this).addClass('input--success');
    } else {
	    $(this).removeClass('input--success');
	    $(this).addClass('input--error');
	  };
	});
};

function validateForm(form) {
	var form = form,
    	error = false;

  $('[required]', form).removeClass('input--error');
  $('[required]', form).removeClass('input--success');

  $('[required]:not([disabled])', form).each(function(){
    var input = $(this);

    if( validInput( input ) ) {
      input.addClass('input--success');
    } else {
      error = true;
      input.addClass('input--error');
    };
  });

  if ( !error && form.find('.required--reset-password').length ) {
  	if ( form.find('.required--reset-password').eq(0).val() != form.find('.required--reset-password').eq(1).val() ) {
  		alertMessage('Пароли не совпадают', 'danger', 'top-right');
      return false;
  	}
  };

  if ( error ) {
    if ( $('.input--error.required--rus:not([disabled]):visible', form).length ) {
    	$('.input--error.required--rus:not([disabled]):visible', form).focus();
      alertMessage('Введите имя на русском', 'danger', 'top-right');
    } else {
      alertMessage('Нужные поля не заполнены', 'danger', 'top-right');
      $('.input--error:not([disabled]):visible:first', form).focus();
    }
    return false;
  }
};

function validInput(input) {
  var result = true,
    type = input.attr('type'),
    val = input.val().trim(),
    patternEmail = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

  if( val == '' ) {
    result = false;
  };

  if( type == 'tel' &&  val.indexOf("_") != -1) {
    result = false;
  };

  if( input.hasClass('required--rus') && ( val.search(/^[А-Яа-яЁё\s]+$/) == -1 ) ) {
      result = false;
  }

  if( type == 'email' &&  !( patternEmail.test( val ) ) ) {
    result = false;
  };

  if((type == 'radio' || type == 'checkbox') && !input.prop('checked')) {
    result = false;
  }


  return result;
};

function alertMessage(content, type, placement, closeTime){
  var type = type ? type : 'info',
      placement = placement ? placement : 'top-right',
      closeTime = closeTime ? closeTime : 4000;


  $.alert(content, {
		closeTime: closeTime,
		autoClose: true,
		position: [placement], //top-left,  top-right, bottom-left, bottom-right
		withTime: false,
		type: type, // info, warning, danger
		isOnly: true
	});

}

