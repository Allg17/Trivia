var numerQuestion = 0;
var datos = {};
var puntos = 0;
(function () {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy",
        type: "GET",
        dataType: "json",
        success: function (data) {
            try {
                if (data != null && data.results.length > 0) {
                    datos = data;
                    $("#NumberQuestion").text(data.results.length);
                    LoadData(data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Atencion!',
                        text: 'No pudo ser posible carga la data, intente de nuevo!'
                    })
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        error: function () {
            console.log("Error in the request");
        }
    })
})();

function LoadData(data) {
    try {
        if (data.results.length == numerQuestion) {
            document.getElementById('ContinuarBtn').disabled = true;
            Swal.fire({
                title: 'Game Finished \n points:' + puntos,
                width: 600,
                padding: '3em',
                color: '#716add',
                background: '#fff url(/img/trivia.png)',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("/img/nyan-cat.gif")
                  left top
                  no-repeat
                `
            })
            return;
        }
        $("#nextQuestion").text(numerQuestion + 1);
        var question = document.getElementById("label-Question");
        var buttons = document.getElementById("Buttons");
        question.innerHTML = numerQuestion + 1 + ". " + data.results[numerQuestion].question;
        buttons.innerHTML = "";
        var counter = 1;
        data.results[numerQuestion].incorrect_answers.forEach(element => {
            buttons.innerHTML += " <button id='btn-" + counter++ + "' onclick='clicked(" + (counter - 1) + ")'  type='button' class='btn btn-light' data-toggle='button'>" + element + "</button>";
        });
        buttons.innerHTML += " <button id='btn-" + counter++ + "'  onclick='clicked(" + (counter - 1) + ")'  type='button' class='btn btn-light' data-toggle='button'>" + data.results[numerQuestion].correct_answer + "</button>";
    } catch (error) {
        console.log(error.message);
    }
}
document.getElementById('ContinuarBtn').onclick = function () {
    if ($(".btn").hasClass("btn-outline-success")) {
        var sel = $(".active").html();
        if (datos.results[numerQuestion].correct_answer == sel)
            puntos++;

        ++numerQuestion;
        LoadData(datos)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Atencion!',
            text: 'No puede continuar sin antes seleccionar una respuesta!'
        })
    }
};

function clicked(d) {
    $("#Buttons").html($("#Buttons").html().replace("btn-outline-success", ""));
    $("#Buttons").html($("#Buttons").html().replace("focus", ""));
    $("#Buttons").html($("#Buttons").html().replace("active", ""));
    document.getElementById("btn-" + d).classList.toggle("active");
    document.getElementById("btn-" + d).classList.toggle("btn-outline-success");
};