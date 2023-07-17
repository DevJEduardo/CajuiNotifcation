const db = firebase.firestore();
const messaging = firebase.messaging();
const uid = localStorage.getItem('Uid');
var nomeSession;

try {

    class Editar_Curso {
        constructor(id, cursoAntigo, curso) {

            this.id = id,
                this.cursoAntigo = cursoAntigo,
                this.curso = curso;
        }

        editar() {

            document.querySelector("div[class='container-loader']").style.display = "none";

            db.collection("cursos").doc(this.id).update({

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
                        alteracao: `O usuario ${nomeSession} alterou o curso "${this.cursoAntigo}" para "${this.curso}" no dia ${data_hora}`,
                        data_hora: data_hora
                    })
                        .then(() => {

                            alert("Curso alterado com sucesso");
                            location.reload();

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

    db.collection("cursos").get()
        .then((snapshot) => {

            const select = document.querySelector('select[name="cursos"]');

            if (snapshot.docs.length == 0) {

                const option = `<option>Nenhum curso cadastrado :/</option>`;
                select.innerHTML += option;

            } else {

                const option = snapshot.docs.reduce((acc, doc) => {

                    acc += `<option>${doc.data().curso}</option>`
                    return acc

                }, '')
                select.innerHTML += option;
            }
        })
        .catch((error) => {
            alert(error.message);
        });

    document.querySelector("button").addEventListener("click", function () {

        const formdata = new FormData(document.querySelector('form'));
        const curso = formdata.get("cursos");
        const envio = formdata.get("todos");

        if (envio === "editar") {

            const formprincipal = document.querySelector("form[class='principalForm']");
            const formeditar = document.querySelector("form[class='editarForm']");

            formprincipal.style.display = "none";
            formeditar.style.display = "block";

            db.collection("cursos").where("curso", "==", curso).get()
                .then((snapshot) => {

                    snapshot.forEach(doc => {

                        document.querySelector("input[name='curso']").value = doc.data().curso;

                        document.querySelector("button[class='editar']").addEventListener("click", function () {

                            const formdata = new FormData(formeditar);
                            const curso = formdata.get("curso").trim();

                            if (curso.length == 0) {

                                alert("Preencha todos os campos");

                            } else {

                                db.collection("cursos").where("curso", "==", curso).get()
                                    .then((snapshot) => {

                                        if (snapshot.docs.length > 0) {

                                            document.querySelector("div[class='container-loader']").style.display = "none";

                                            alert("Curso existente");

                                        } else {

                                            document.querySelector("div[class='container-loader']").style.display = "block";

                                            var ediCurso = new Editar_Curso(doc.id, doc.data().curso, curso);
                                            ediCurso.editar();

                                        }
                                    })
                                    .catch((error) => {
                                        alert(error.message);
                                    });
                            }

                        })

                    })
                })
                .catch((error) => {
                    alert(error.message);
                })

        } else if (envio === "excluir") {

            db.collection("cursos").where("curso", "==", curso).get()
                .then((snapshot) => {

                    snapshot.forEach(doc => {

                        if (confirm("Deseja excluir este curso?")) {

                            db.collection("cursos").doc(doc.id).delete()
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
                                        alteracao: `O usuario: ${nomeSession} deletou o curso "${doc.data().curso}" no dia ${data_hora}`,
                                        data_hora: data_hora
                                    })
                                        .then(() => {

                                            alert("Curso deletado com sucesso");
                                            location.reload();

                                        })
                                        .catch((error) => {
                                            alert(error.message);
                                        })
                                })
                                .catch((error) => {
                                    alert(error.message);
                                });
                        }

                    })
                })
                .catch((error) => {

                    alert(error.message);
                })
        } else {
            alert("Você deseja editar ou excluir este perfil?");
        }


    })

} catch (err) {

    alert('Erro ' + err);

}