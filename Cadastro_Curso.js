const db = firebase.firestore();
const uid = localStorage.getItem('Uid');
var nomeSession;

try {

    class Cadastro_Curso {
        constructor(curso) {

            this.curso = curso;
        }

        cadastrar() {

            document.querySelector("div[class='container-loader']").style.display = "none";

            db.collection("cursos").add({
                curso: this.curso
            })
                .then(() => {

                    const data = new Date();
                    const dia = String(data.getDate()).padStart(2, '0');
                    const mes = String(data.getMonth() + 1).padStart(2, '0');
                    const ano = String(data.getFullYear());
                    var hora = String(data.getHours());
                    if (hora == 0) {
                        hora = String(data.getHours()) + "0";
                    }
                    var minuto = String(data.getMinutes());
                    if (minuto < 10) {

                        minuto = String(data.getMinutes()).padStart(2, '0');

                    } else {

                        minuto = String(data.getMinutes());

                    }
                    const data_hora = `${dia}/${mes}/${ano} as ${hora}:${minuto}`;
                    db.collection("historico").add({

                        usuarioUID: uid,
                        alteracao: `O usuario ${nomeSession} cadastrou o curso "${this.curso}" no dia ${data_hora}`,
                        data_hora: data_hora
                    })
                        .then(() => {

                            alert('curso cadastrado');

                        })
                        .catch((error) => {
                            alert(error.message);
                        })
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    }

    document.querySelector("button").addEventListener("click", function () {

        document.querySelector("div[class='container-loader']").style.display = "block";

        const formdata = new FormData(document.querySelector('form'));
        const curso = formdata.get("curso").trim();

        if (curso.length == 0) {

            alert("Preencha todos os campos");

        } else {

            db.collection("cursos").where("curso", "==", curso).get()
                .then((snapshot) => {

                    if (snapshot.docs.length > 0) {

                        alert("Perfil existente");

                    } else {

                        document.querySelector("div[class='container-loader']").style.display = "block";

                        var cadCurso = new Cadastro_Curso(curso);
                        cadCurso.cadastrar();

                    }
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    });

} catch (err) {

    alert('Erro ' + err);
}