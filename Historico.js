const db = firebase.firestore();
const messaging = firebase.messaging();
const uid = localStorage.getItem('Uid');

try {

    db.collection("usuarios(Site)").get()
        .then((snapshot) => {

            const select = document.querySelector('select[name="usuarios"]');

            if (snapshot.docs.length == 0) {

                const option = `<option>Nenhum usuario cadastrado :/</option>`;
                select.innerHTML += option;

            } else {

                const option = snapshot.docs.reduce((acc, doc) => {

                    acc += `<option>${doc.data().nome}</option>`
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
        const usuario = formdata.get("usuarios");

        db.collection("usuarios(Site)").where("nome", "==", usuario).get()
            .then((docref) => {

                docref.forEach(doc => {

                    db.collection("historico").where("usuarioUID", "==", doc.data().uid).orderBy("data_hora", "desc").get()
                        .then((docref) => {

                            if (docref.docs.length == 0) {

                                alert("Historico do usuario vazio :/");

                            } else {

                                const recyclerView = document.querySelector('.recyclerview1');

                                const notificacao = docref.docs.reduce((acc, doc) => {

                                    acc += `<div class="container-externo">
                                            <div class="conteudo">
                                                    <div class="texto1">
                                                        <h6>${doc.data().alteracao}</h6>
                                                    </div>
                                            </div>
                                        </div>`
                                    return acc
                                }, '')
                                recyclerView.innerHTML = notificacao;

                            }
                        })
                        .catch((error) => {
                            alert(error.message);
                        })

                })
            })
    })
} catch (err) {

    alert('Erro ' + err);

}
