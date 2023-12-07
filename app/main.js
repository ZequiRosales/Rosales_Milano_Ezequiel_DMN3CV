$(document).ready(function(){
    var usuarioIngresado = localStorage.getItem("usuarioIngresado");

    if (!usuarioIngresado) {
        $("#miModal").modal("show");

        $("#formUsuario").submit(function(){
            var nombreUsuario = $("#nombreUsuario").val();
            var saldoUsuario = parseFloat($("#saldoUsuario").val());
            var gastosUsuario = [];

            localStorage.setItem('nombreUsuario', nombreUsuario);
            localStorage.setItem('saldoUsuario', saldoUsuario);
            localStorage.setItem('gastosUsuario', JSON.stringify(gastosUsuario));
            localStorage.setItem('usuarioIngresado', 'true');

            $("#miModal").modal("hide");

            mostrarNombreYSaldo(nombreUsuario, saldoUsuario);
            mostrarGastos(gastosUsuario);
        });
    } else {
        var nombreGuardado = localStorage.getItem('nombreUsuario');
        var saldoGuardado = parseFloat(localStorage.getItem('saldoUsuario'));
        var gastosGuardados = JSON.parse(localStorage.getItem('gastosUsuario')) || [];

        mostrarNombreYSaldo(nombreGuardado, saldoGuardado);
        mostrarGastos(gastosGuardados);
    }

    function mostrarNombreYSaldo(nombre, saldo) {
        $("#nombreMostrado").text("Nombre: " + nombre);
        $("#saldoMostrado").text("Saldo: " + saldo);
    }

    function mostrarGastos(gastos) {
        $("#listaGastos").empty();

        for (var i = 0; i < gastos.length; i++) {
            var cardHtml = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${gastos[i].concepto}</h5>
                        <p class="card-text">Cantidad: $${gastos[i].cantidad}</p>
                        <button class="btn btn-danger eliminarGasto" data-indice="${i}">Eliminar</button>
                    </div>
                </div>
            `;

            $("#listaGastos").append(cardHtml);
        }
    }

    $("#agregarGasto").click(function(){
        var descripcionGasto = $("#descripcionGasto").val();
        var cantidadGasto = parseFloat($("#cantidadGasto").val());

        if (descripcionGasto && !isNaN(cantidadGasto) && cantidadGasto > 0) {
            var gastosGuardados = JSON.parse(localStorage.getItem('gastosUsuario')) || [];

            gastosGuardados.push({
                concepto: descripcionGasto,
                cantidad: cantidadGasto
            });

            var saldoActualizado = parseFloat(localStorage.getItem('saldoUsuario')) - cantidadGasto;
            localStorage.setItem('saldoUsuario', saldoActualizado);

            localStorage.setItem('gastosUsuario', JSON.stringify(gastosGuardados));

            mostrarGastos(gastosGuardados);
            mostrarNombreYSaldo(localStorage.getItem('nombreUsuario'), saldoActualizado);

            $("#descripcionGasto").val("");
            $("#cantidadGasto").val("");
        }
    });

    $("#listaGastos").on("click", ".eliminarGasto", function(){
        var indiceGasto = $(this).data("indice");
        var gastosGuardados = JSON.parse(localStorage.getItem('gastosUsuario')) || [];
        var cantidadGastoEliminar = gastosGuardados[indiceGasto].cantidad;
        var saldoActualizado = parseFloat(localStorage.getItem('saldoUsuario')) + cantidadGastoEliminar;

        localStorage.setItem('saldoUsuario', saldoActualizado);

        gastosGuardados.splice(indiceGasto, 1);

        localStorage.setItem('gastosUsuario', JSON.stringify(gastosGuardados));

        mostrarGastos(gastosGuardados);
        mostrarNombreYSaldo(localStorage.getItem('nombreUsuario'), saldoActualizado);
    });
});
