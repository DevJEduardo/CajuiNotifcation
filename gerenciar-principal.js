const db = firebase.firestore();
const messaging = firebase.messaging();
const uid = localStorage.getItem('Uid');

try {

    db.collection("Notificações").where("enviadoPor", "==", uid).orderBy("data_hora", "desc").get()
        .then((docref) => {

            if (docref.docs.length == 0) {
                const p = document.querySelector("p[class='textoPrincipal']");
                p.innerHTML = "Você não cadastrou nenhuma notificação :/"
            } else {

                const recyclerView = document.querySelector('.recyclerview');

                const notificacao = docref.docs.reduce((acc, doc) => {

                    if (doc.data().link === "") {

                        acc += `<div class="container-externo">
                                        <div class="conteudo">
                                            <div class="texto">
                                                <h1>${doc.data().title}</h1>
                                                <h3>${doc.data().body}</h3>
                                                <h6>UidRemetente: ${doc.data().enviadoPor}</h6>
                                                <h6>Destinatario(s): ${doc.data().enviadoPara}</h6>
                                                <h6>Aberto(s): ${doc.data().aberto}</h6>
                                                <h6>Data de envio: ${doc.data().data_hora}</h6>
                                            </div>
                                            <div class="imagem">
                                                <img src="${doc.data().url}" alt="Imagem">
                                            </div>
                                        </div>
                                    </div>`
                        return acc

                    } else {

                        acc += `<a class="link" href="${doc.data().link}" target="_blank">
                                        <div class="container-externo">
                                            <div class="conteudo">
                                                <div class="texto">
                                                    <h1>${doc.data().title}</h1>
                                                    <h3>${doc.data().body}</h3>
                                                    <h6>Uidremetente: ${doc.data().enviadoPor}</h6>
                                                    <h6>Destinatario(s): ${doc.data().enviadoPara}</h6>
                                                    <h6>Aberto(s): ${doc.data().aberto}</h6>
                                                    <h6>Data de envio: ${doc.data().data_hora}</h6>
                                                </div>
                                                <div class="imagem">
                                                    <img src="${doc.data().url}" alt="Imagem">
                                                </div>
                                            </div>
                                        </div>
                                    </a>`
                        return acc
                    }
                }, '')
                recyclerView.innerHTML = notificacao;

            }
        })
        .catch((error) => {
            alert(error.message);
        })
} catch (err) {

    alert('Erro ' + err);

}