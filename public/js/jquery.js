$('document').ready(function () {
	var contador = 60;
	$('.contador').html(contador);
	$('input[class=titulo]').keyup(function () {
		var tam = $(this).val().length;
		var real = contador - tam;
		if (real < 0) {
			$('.contador').css('color', 'red');
		} else {
			$('.contador').css('color', 'black');
		}
		$('.contador').html(contador - tam);
	});

	$('#busca').submit(function(){
		var valor = $('.input-busca').val();
		if(valor == ""){
			return false;
		}else{
			return true;
		}
	});
});