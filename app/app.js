$(document).ready(function () {
  // Mostrar todos los usuarios

  $('.checklogin').click(async function (e) {
    e.preventDefault();
    let nombre = $('#username').val();
    let password = $('#password').val();

    await $.ajax({
      type: 'POST',
      url: 'https://api-hospital-rosy.vercel.app/api/checkLogin',
      contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
      data: JSON.stringify({
        "nombre": nombre,
        "password": password
      }),

      success: function (response) {
        //console.log(response);
        if (response.rol === "admin") {
          window.location.href = "../html/admin.html";
        } else if (response.rol === "administrativo") {
          window.location.href = "../html/administrativo.html";
        } else {
          mensaje("Rol no reconocido");
        }
      }
    });

  });
  /*PARTE DE CREAR ESPECIALISTA*/

  $('.crearEspe').click(async function (e) {
    e.preventDefault(); // Evita el envío tradicional del formulario

    const especialista = {
      username: $('#username').val(),
      apellido: $('#apellido').val(),
      direccion: $('#direccion').val(),
      especialidad: $('#especialidad').val()
    };

    await $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/crearEspecialistas',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(especialista),
      success: function (response) {
        //alert(response.message);
        $('.formu')[0].reset();
      },
      error: function (xhr) {
        alert('Error al crear especialista: ' + xhr.responseText);
      }
    });
  });

  /*PARTE DE CREAR paciente*/
  $('.crearPaciente').click(async function (e) {
    e.preventDefault(); // Evita el envío tradicional del formulario

    const especialista = {
      usernamePaciente: $('#usernamePaciente').val(),
      apellidoPaciente: $('#apellidoPaciente').val(),
      direccionPaciente: $('#direccion').val(),
      telefonoPaciente: $('#telefono').val()
    };

    await $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/crearPaciente',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(especialista),
      success: function (response) {
        //alert(response.message);
        $('.formu')[0].reset();
      },
      error: function (xhr) {
        alert('Error al crear especialista: ' + xhr.responseText);
      }
    });
  });
});