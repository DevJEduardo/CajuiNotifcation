const db = firebase.firestore();
const messaging = firebase.messaging();
const uid = localStorage.getItem('Uid');
var nomeSession;

firebase.storage().ref().child("vazio").child("if.png").getDownloadURL()
    .then((url) => {

        const img = document.getElementById('imgPhotoCad');
        img.setAttribute('src', url);
    })
    .catch((error) => {
        alert(error.message)
    });

try {

    class Cadastro_Notificacao {
        constructor(titulo, descricao, link, data_hora, cont, imagem) {

            this.titulo = titulo;
            this.descricao = descricao;
            this.link = link;
            this.data_hora = data_hora;
            this.cont = cont;
            this.imagem = imagem;
        }
        cadastrar() {

            document.querySelector("div[class='container-loader']").style.display = "block";

            db.collection("Notificações").add({

                title: this.titulo,
                body: this.descricao,
                link: this.link,
                data_hora: this.data_hora,
                enviadoPor: uid,
                enviadoPara: this.cont,
                aberto: 0,
                url: ""


            })
                .then((docRef) => {

                    if (this.imagem.size > 0) {

                        firebase.storage().ref().child("Notificações").child(docRef.id).put(this.imagem)
                            .then(() => {

                                firebase.storage().ref().child("Notificações").child(docRef.id).getDownloadURL()
                                    .then((url) => {
                                        console.log(url);

                                        document.querySelector("div[class='container-loader']").style.display = "none";

                                        db.collection("Notificações").doc(docRef.id).update({

                                            url: url,
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
                                                    alteracao: `O usuario ${nomeSession} cadastrou a notificação "${this.titulo}" no dia ${data_hora}`,
                                                    data_hora: data_hora
                                                    
                                                })
                                                    .then(() => {

                                                        alert("Notificação cadastrada");

                                                    })
                                                    .catch((error) => {
                                                        alert(error.message);
                                                    })

                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            })


                                    })
                                    .catch((error) => {
                                        alert(error.message);
                                    })
                            })
                            .catch((error) => {

                                alert(error.message);

                            })
                    } else {

                        firebase.storage().ref().child("vazio").child("if.png").getDownloadURL()
                            .then((url) => {

                                document.querySelector("div[class='container-loader']").style.display = "none";

                                db.collection("Notificações").doc(docRef.id).update({

                                    url: url,
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
                                            alteracao: `O usuario: ${nomeSession} cadastrou a notificação "${this.titulo}" no dia ${data_hora}`,
                                            data_hora: data_hora
                                        })
                                            .then(() => {

                                                alert("Notificação cadastrada");

                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            })

                                    })
                                    .catch((error) => {
                                        alert(error.message);
                                    })


                            })
                            .catch((error) => {
                                alert(error.message);
                            })
                    }

                })
                .catch((error) => {
                    document.querySelector("div[class='container-loader']").style.display = "none";
                    alert(error.message);
                });
        }
    }

    var cont = 1;

    document.querySelector("input[class='todos']").addEventListener("click", function () {

        if (cont > 1) {

            const select = document.querySelector('select[name="perfis"]');
            var nrlist = select.options.length;
            for (var x = 0; x <= nrlist; x++) {
                select.remove(0);
            }

        }

        const select = document.querySelector('select[name="perfis"]');
        const option = `<option>Enviar notificação a todos os usuarios</option>`;
        select.innerHTML += option;

        cont++;
    })

    document.querySelector("input[class='cursos']").addEventListener("click", function () {

        if (cont > 1) {

            const select = document.querySelector('select[name="perfis"]');
            var nrlist = select.options.length;
            for (var x = 0; x <= nrlist; x++) {
                select.remove(0);
            }

        }

        db.collection("cursos").get()
            .then((snapshot) => {

                const select = document.querySelector('select[name="perfis"]');

                if (snapshot.docs.length == 0) {

                    const option = `<option>Nenhuma curso cadastrado :/</option>`;
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

        cont++;

    })

    document.querySelector("input[class='especifica']").addEventListener("click", function () {

        if (cont > 1) {

            const select = document.querySelector('select[name="perfis"]');
            var nrlist = select.options.length;
            for (var x = 0; x <= nrlist; x++) {
                select.remove(0);
            }

        }

        db.collection("usuarios").get()
            .then((snapshot) => {

                const select = document.querySelector('select[name="perfis"]');

                if (snapshot.docs.length == 0) {

                    const option = `<option>Nenhuma pessoa cadastrada :/</option>`;
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

        cont++;

    })

    function isValidUrl(url) {
        try {
            if (url.length == 0) {
                return true;
            } else {
                new URL(url);
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    function isValidImg(img) {
        try {
            const ext = img.name.toLowerCase().split('.').pop();
            if (img.size == 0) {
                return true;
            } else if (ext != "jpg" && ext != "png") {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    const imagemUp = document.getElementById('imgPhotoCad');
    const file = document.querySelector('input[name="imagem"]');

    imagemUp.addEventListener("click", function () {

        file.click()

        file.addEventListener('change', (event) => {

            let reader = new FileReader();

            reader.onload = () => {

                imagemUp.src = reader.result;

            }

            reader.readAsDataURL(file.files[0]);

        })
    })

    document.querySelector("button").addEventListener("click", function () {

        const formdata = new FormData(document.querySelector('form'));
        const titulo = formdata.get("titulo");
        const descricao = formdata.get("descricao");
        var link = formdata.get("link");
        const envio = formdata.get("todos");
        var imagem = formdata.get("imagem");

        if (titulo.length == 0 || descricao.length == 0) {

            alert('Preencha todos os campos');
        } else {

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
            if (!isValidUrl(link)) {

                alert("Link invalido");

            } else {

                if (!isValidImg(imagem)) {

                    alert("Extensão de imagem não aceita");

                } else {

                    if (envio == null) {

                        alert("Selecione o tipo de envio");

                    } else {

                        if (envio === "todos") {

                            db.collection("usuarios").get()
                                .then((docref) => {

                                    var cont = null;

                                    docref.forEach((doc) => {

                                        const token = doc.data().token;
                                        let body = {
                                            to: token,
                                            notification: {
                                                title: titulo,
                                                body: descricao,
                                                icon: 'IF.jpg',
                                                click_action: link
                                            }
                                        }

                                        let options = {
                                            method: "POST",
                                            headers: new Headers({
                                                Authorization: "key=AAAASSRJZdU:APA91bFgE5CfkW8F0fgooOA7h_z5n2NIr1L3VcZ7Ahe3AwT20NqPuWNECuQkjDrnp4fHogLIsuRIizYM6XnLAONn6qtUdJBbBKLJRIrdJQlYkug8lCTEAj2R0sWEfaFrU1GDw8yfdUnf",
                                                "Content-Type": "application/json"
                                            }),
                                            body: JSON.stringify(body)
                                        }

                                        fetch("https://fcm.googleapis.com/fcm/send", options)
                                            .then((resposta) => {
                                                console.log('Send ' + resposta);
                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            })

                                        cont++;

                                    })
                                    var notificacao = new Cadastro_Notificacao(titulo, descricao, link, data_hora, cont, imagem);
                                    notificacao.cadastrar();
                                })
                                .catch((error) => {

                                    alert(error.message);

                                });
                        } else if (envio === "cursos") {

                            const select = formdata.get("perfis");

                            db.collection("usuarios").where("curso", "==", select).get()
                                .then((docref) => {

                                    var cont = null;

                                    docref.forEach((doc) => {

                                        const token = doc.data().token;
                                        let body = {
                                            to: token,
                                            notification: {
                                                title: titulo,
                                                body: descricao,
                                                icon: 'IF.jpg',
                                                click_action: link
                                            }
                                        }

                                        let options = {
                                            method: "POST",
                                            headers: new Headers({
                                                Authorization: "key=AAAASSRJZdU:APA91bFgE5CfkW8F0fgooOA7h_z5n2NIr1L3VcZ7Ahe3AwT20NqPuWNECuQkjDrnp4fHogLIsuRIizYM6XnLAONn6qtUdJBbBKLJRIrdJQlYkug8lCTEAj2R0sWEfaFrU1GDw8yfdUnf",
                                                "Content-Type": "application/json"
                                            }),
                                            body: JSON.stringify(body)
                                        }

                                        fetch("https://fcm.googleapis.com/fcm/send", options)
                                            .then((resposta) => {
                                                console.log('Send ' + resposta);
                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            })

                                        cont++;

                                    })
                                    var notificacao = new Cadastro_Notificacao(titulo, descricao, link, data_hora, cont, imagem);
                                    notificacao.cadastrar();
                                })
                                .catch((error) => {

                                    alert(error.message);

                                });
                        } else {

                            const select = formdata.get("perfis");

                            db.collection("usuarios").where("nome", "==", select).get()
                                .then((docref) => {

                                    var cont = null;

                                    docref.forEach((doc) => {

                                        const token = doc.data().token;
                                        let body = {
                                            to: token,
                                            notification: {
                                                title: titulo,
                                                body: descricao,
                                                icon: 'IF.jpg',
                                                click_action: link
                                            }
                                        }

                                        let options = {
                                            method: "POST",
                                            headers: new Headers({
                                                Authorization: "key=AAAASSRJZdU:APA91bFgE5CfkW8F0fgooOA7h_z5n2NIr1L3VcZ7Ahe3AwT20NqPuWNECuQkjDrnp4fHogLIsuRIizYM6XnLAONn6qtUdJBbBKLJRIrdJQlYkug8lCTEAj2R0sWEfaFrU1GDw8yfdUnf",
                                                "Content-Type": "application/json"
                                            }),
                                            body: JSON.stringify(body)
                                        }

                                        fetch("https://fcm.googleapis.com/fcm/send", options)
                                            .then((resposta) => {
                                                console.log('Send ' + resposta);
                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            })

                                        cont++;

                                    })
                                    var notificacao = new Cadastro_Notificacao(titulo, descricao, link, data_hora, cont, imagem);
                                    notificacao.cadastrar();

                                })
                                .catch((error) => {

                                    alert(error.message);

                                });
                        }
                    }

                }
            }
        }
    });
} catch (err) {

    alert('Erro ' + err);

}