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

    const paciente = {
      usernamePaciente: $('#usernamePaciente').val(),
      apellidoPaciente: $('#apellidoPaciente').val(),
      direccionPaciente: $('#direccion').val(),
      telefonoPaciente: $('#telefono').val()
    };

    await $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/crearPaciente',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(paciente),
      success: function (response) {
        //alert(response.message);
        $('.formu')[0].reset();
      },
      error: function (xhr) {
        alert('Error al crear especialista: ' + xhr.responseText);
      }
    });
  });





  function cargarPacientes() {
    $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/pacientes',
      method: 'GET',
      success: function (pacientes) {
        const contenedor = $('.listaPacientes');
        contenedor.empty();
        let pacienteSeleccionado = null;

        pacientes.forEach(paciente => {
          const tarjeta = $(`
          <section class="paciente">
            <img src="../imagenes/paciente.png" alt="imagen paciente" class="img-fluid">
            <section class="datos">
              <p><strong>Nombre:</strong> ${paciente.nombre}</p>
              <p><strong>Apellido:</strong> ${paciente.apellido}</p>
              <p><strong>Dirección:</strong> ${paciente.direccion}</p>
              <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
            </section>
          </section>
          `);

          tarjeta.click(function (e) {
            e.preventDefault();
            pacienteSeleccionado = paciente;
            $('.modalFecha').fadeIn();
            console.log('Paciente seleccionado:', pacienteSeleccionado);
          });

          contenedor.append(tarjeta);
        });

        $('.darCita').click(function () {
          e.preventDefault();
          const fecha = $('#fechaSeleccionada').val();

          if (!fecha || !pacienteSeleccionado) {
            alert('Selecciona una fecha válida y un paciente.');
            return;
          }

          const citaPaciente = {
            nombre: pacienteSeleccionado.nombre,
            apellido: pacienteSeleccionado.apellido,
            codigoPaciente: pacienteSeleccionado._id,
            fecha: fecha
          };

          console.log('Cita a enviar:', citaPaciente);
          //alert(JSON.stringify(citaPaciente)); // Congela y te deja ver los datos


          $.ajax({
            url: 'https://api-hospital-rosy.vercel.app/api/asignarCita',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(citaPaciente),
            success: function (respuesta) {

              alert('Cita registrada correctamente', respuesta);
              $('.modalFecha').fadeOut();
              $('#fechaSeleccionada').val('');
              console.log(respuesta);

            },
            error: function (e) {
              alert('Error al registrar la cita.', e);
            }
          });
        });
      },
      error: function () {
        alert('Error al cargar los pacientes.');
      }
    });
  }
  cargarPacientes();


  //CARGAR PACIENTES PARA EL HISTORIAL DE CITAS.
  function cargarPacientes2() {
    $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/pacientes',
      method: 'GET',
      success: function (pacientes) {
        const contenedor2 = $('.listaPacienteHistorial');
        contenedor2.empty();
        let pacienteSeleccionado = null;

        pacientes.forEach(paciente => {
          const tarjeta = $(`
          <section class="paciente">
            <img src="../imagenes/paciente.png" alt="imagen paciente" class="img-fluid">
            <section class="datos">
              <p><strong>Nombre:</strong> ${paciente.nombre}</p>
              <p><strong>Apellido:</strong> ${paciente.apellido}</p>
              <p><strong>Dirección:</strong> ${paciente.direccion}</p>
              <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
            </section>
          </section>
        `);
          contenedor2.append(tarjeta);

          tarjeta.click(function (e) {
            e.preventDefault();
            pacienteSeleccionado = paciente;
            $('.modalHistorial').fadeIn();

            const idPaciente = { id: pacienteSeleccionado._id };

            $.ajax({
              url: 'https://api-hospital-rosy.vercel.app/api/vercitaspaciente',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(idPaciente),
              success: function (citasPaciente) {
                if (!Array.isArray(citasPaciente)) {
                  console.error('La respuesta no es un array:', citasPaciente);
                  return;
                }

                const contenedorCitas = $('.histoCitas');
                contenedorCitas.empty();

                if (citasPaciente.length === 0) {
                  contenedorCitas.append('<p>No hay citas registradas para este paciente.</p>');
                } else {
                  citasPaciente.forEach(cita => {
                    const citaHtml = $(`
                      <div class="cita">
                        <p><strong>Fecha:</strong> ${cita.fecha}</p>
                        <p><strong>Asistió:</strong> ${cita.asistio}</p>
                      </div>
                    `);
                    contenedorCitas.append(citaHtml);
                  });
                }
              },
              error: function (e) {
                alert('Error al cargar las citas.');
                console.error(e);
              }
            });
          });
        });
      },
      error: function () {
        alert('Error al cargar los pacientes.');
      }
    });
  }

  cargarPacientes2();


  //cerrar modal
  $('.cerrarModal').click(function (e) {
    e.preventDefault();
    $('.modalFecha').fadeOut();
    $('.modalHistorial').fadeOut();
  });








});