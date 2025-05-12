$(document).ready(function () {
    // Mostrar todos los usuarios
    
    $('.checklogin').click(async function(e) {
        e.preventDefault();
        let nombre=$('#username').val();
        let password=$('#password').val();

       
        await $.ajax({    
            type: 'POST',
            url: 'https://api-hospital-rosy.vercel.app/api/checkLogin',
            contentType: 'application/json', // Especifica que el contenido es JSON porque AJAX es el producto de una mente enferma
            data: JSON.stringify({
                "nombre": nombre,
                "password": password
            }),
            success: function(response) {
                //console.log(response);
                if(response.rol === "admin") {
                    window.location.href = "../html/admin.html";
                  } else if (response.rol === "administrativo") {
                    window.location.href = "../html/administrativo.html";
                  } else {
                    mensaje("Rol no reconocido");
                  }
            }
        });
        
    });
  
  
  });