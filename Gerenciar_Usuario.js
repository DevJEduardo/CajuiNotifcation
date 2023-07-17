const db = firebase.firestore();
const uid = localStorage.getItem('Uid');
var nomeSession;
var emailSession;

try {

    class Editar_Usuario {
        constructor(id, nome, nomeAntigo, emailNovo, emailLogin, senhaLogin, perfil) {

            this.id = id;
            this.nome = nome;
            this.nomeAntigo = nomeAntigo;
            this.emailNovo = emailNovo;
            this.emailLogin = emailLogin;
            this.senhaLogin = senhaLogin;
            this.perfil = perfil;
        }

        editar() {

            document.querySelector("div[class='container-loader']").style.display = "block";

            firebase.auth().signInWithEmailAndPassword(this.emailLogin, this.senhaLogin)
                .then(() => {

                    const user = firebase.auth().currentUser;

                    user.updateEmail(this.emailNovo)
                        .then(() => {

                            db.collection("usuarios(Site)").doc(this.id).update({

                                nome: this.nome,
                                email: this.emailNovo,

                            })
                                .then(() => {

                                    db.collection("usuarios(Site)").doc(this.id).collection("perfis").get()
                                        .then((docref) => {

                                            docref.forEach(doc => {

                                                db.collection("usuarios(Site)").doc(this.id).collection("perfis").doc(doc.id).update({

                                                    perfil: this.perfil
                                                })
                                                    .then(() => {

                                                        db.collection("usuarios(Site)").where("uid", "==", uid).get()
                                                            .then((docRef) => {

                                                                docRef.forEach(doc => {

                                                                    const email = doc.data().email;

                                                                    const senha = doc.data().senha;

                                                                    document.querySelector("div[class='container-loader']").style.display = "none";

                                                                    firebase.auth().signInWithEmailAndPassword(email, senha)
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
                                                                                alteracao: `O usuario ${nomeSession} alterou o nome do usuario "${this.nomeAntigo}" para "${this.nome}" 
                                                                                e alterou seu email "${this.emailLogin}" para "${this.emailNovo}" no dia ${data_hora}`,
                                                                                data_hora: data_hora

                                                                            })
                                                                                .then(() => {


                                                                                    alert("Registro alterado com sucesso");

                                                                                    location.reload();
                                                                                })
                                                                                .catch((error) => {
                                                                                    alert(error.message);
                                                                                })
                                                                        })
                                                                        .catch((error) => {

                                                                            alert(error.message);
                                                                        });
                                                                });
                                                            })
                                                            .catch((error) => {
                                                                alert(error.message);
                                                            })
                                                    })
                                                    .catch((error) => {
                                                        alert(error.message);
                                                    })
                                            })

                                        })
                                        .catch((error) => {
                                            alert(error.message);
                                        })
                                })
                                .catch((error) => {
                                    console.error("Erro ao atualizar o documento: ", error);
                                });

                        }).catch((error) => {
                            document.querySelector("div[class='container-loader']").style.display = "none";
                            if (error.code == "auth/email-already-in-use") {

                                alert("Email existente")
                            } else {

                                alert(error.message);

                            }
                        });

                })
                .catch((error) => {
                    alert(error.message);
                })
        }
    }

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
        const envio = formdata.get("todos");

        if (envio === "editar") {

            firebase.storage().ref().child(usuario).getDownloadURL()
                .then((url) => {

                    const img = document.getElementById('imgPhotoCad');
                    img.setAttribute('src', url);
                })
                .catch((error) => {

                    if (error.code == "storage/object-not-found") {

                        firebase.storage().ref().child("vazio").child("personIcon.jpg").getDownloadURL()
                            .then((url) => {

                                const img = document.getElementById('imgPhotoCad');
                                img.setAttribute('src', url);
                            })
                            .catch((error) => {

                                alert(error.message);
                            });

                    } else {

                        alert(error.message);

                    }
                });

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

            const formprincipal = document.querySelector("form[class='principalForm']");
            const formeditar = document.querySelector("form[class='editarForm']");

            formprincipal.style.display = "none";
            formeditar.style.display = "block";

            db.collection("perfis").get()
                .then((snapshot) => {

                    const select = document.querySelector('select[name="perfis"]');

                    if (snapshot.docs.length == 0) {

                        const option = `<option>Nenhum perfil cadastrado :/</option>`;
                        select.innerHTML += option;

                    } else {

                        const option = snapshot.docs.reduce((acc, doc) => {

                            acc += `<option>${doc.data().descricao}</option>`
                            return acc

                        }, '')
                        select.innerHTML += option;
                    }
                })
                .catch((error) => {
                    alert(error.message);
                });

            db.collection("usuarios(Site)").where("nome", "==", usuario).get()
                .then((snapshot) => {

                    snapshot.forEach(doc => {

                        document.querySelector("input[name='nome']").value = doc.data().nome;
                        document.querySelector("input[name='email']").value = doc.data().email;

                        db.collection("usuarios(Site)").doc(doc.id).collection("perfis").get()
                            .then((snapshot) => {

                                snapshot.forEach(doc => {

                                    document.querySelector("p[class='perfilAtual']").innerHTML = "Atual perfil: " + doc.data().perfil;
                                })
                            })
                            .catch((error) => {
                                alert(error.message);
                            });

                        document.querySelector("button[class='editar']").addEventListener("click", function () {

                            const formdata = new FormData(formeditar);
                            const nome = formdata.get("nome").trim();
                            const nomeAntigo = doc.data().nome;
                            const emailLogin = doc.data().email;
                            const senhaLogin = doc.data().senha;
                            const emailNovo = formdata.get("email").replace(/ /g, "");
                            const perfil = formdata.get("perfis");
                            const imagem = formdata.get("imagem");

                            if (nome.length == 0 || emailNovo.length == 0) {

                                alert('Preencha todos os campos');

                            } else {

                                db.collection("usuarios(Site)").where("nome", "==", nome).get()
                                    .then((snapshot) => {

                                        if (snapshot.docs.length > 0) {

                                            alert("Nome de usuario existente");

                                        } else {

                                            if (imagem.size > 0) {

                                                const ext = imagem.name.toLowerCase().split('.').pop();

                                                if (ext != "jpg" && ext != "png") {

                                                    alert("Extensão de imagem não aceita");
                                                } else {

                                                    const forestRef = firebase.storage().ref().child(usuario);

                                                    forestRef.delete()
                                                        .then(() => {
                                                            firebase.storage().ref().child(nome).put(imagem)
                                                                .then(() => {

                                                                    var user = new Editar_Usuario(doc.id, nome, nomeAntigo, emailNovo, emailLogin, senhaLogin, perfil);
                                                                    user.editar();

                                                                })
                                                                .catch((error) => {

                                                                    alert(error.message);

                                                                })
                                                        })
                                                        .catch((error) => {

                                                            if (error.code == "storage/object-not-found") {

                                                                firebase.storage().ref().child(nome).put(imagem)
                                                                    .then(() => {

                                                                        var user = new Editar_Usuario(doc.id, nome, nomeAntigo, emailNovo, emailLogin, senhaLogin, perfil);
                                                                        user.editar();

                                                                    })
                                                                    .catch((error) => {

                                                                        alert(error.message);

                                                                    })

                                                            } else {

                                                                alert(error.message);

                                                            }

                                                        });
                                                }
                                            } else {

                                                var user = new Editar_Usuario(doc.id, nome, nomeAntigo, emailNovo, emailLogin, senhaLogin, perfil);
                                                user.editar();
                                            }
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
                });



        } else if (envio === "excluir") {

            db.collection("usuarios(Site)").where("nome", "==", usuario).get()
                .then((snapshot) => {

                    snapshot.forEach(doc => {

                        const emailLogin = doc.data().email;
                        const senhaLogin = doc.data().senha;

                        firebase.auth().signInWithEmailAndPassword(emailLogin, senhaLogin)
                            .then(() => {

                                const user = firebase.auth().currentUser;

                                user.delete()
                                    .then(() => {

                                        db.collection("usuarios(Site)").where("nome", "==", usuario).get()
                                            .then((snapshot) => {

                                                snapshot.forEach(doc => {

                                                    if (confirm("Deseja excluir este usuario?")) {

                                                        db.collection("usuarios(Site)").doc(doc.id).delete()
                                                            .then(() => {

                                                                const forestRef = firebase.storage().ref().child(usuario);

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

                                                                forestRef.delete()
                                                                    .then(() => {

                                                                        db.collection("historico").add({

                                                                            usuarioUID: uid,
                                                                            alteracao: `O usuario ${nomeSession} deletou o usuario ${doc.data().nome} no dia ${data_hora}`,
                                                                            data_hora: data_hora
                                                                        })
                                                                            .then(() => {

                                                                                alert("Usuario deletado com sucesso");

                                                                                if (this.emailLogin == emailSession) {
                                                                                    window.location.href = "https://cajuinotification.github.io/login/";
                                                                                } else {
                                                                                    location.reload();
                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                alert(error.message);
                                                                            })

                                                                    })
                                                                    .catch((error) => {

                                                                        if (error.code == "storage/object-not-found") {

                                                                            db.collection("historico").add({

                                                                                usuarioUID: uid,
                                                                                alteracao: `O usuario ${nomeSession} deletou o usuario ${doc.data().nome} no dia ${data_hora}`,
                                                                                data_hora: data_hora
                                                                            })
                                                                                .then(() => {

                                                                                    alert("Usuario deletado com sucesso");

                                                                                    if (this.emailLogin == emailSession) {
                                                                                        window.location.href = "https://cajuinotification.github.io/login/";
                                                                                    } else {
                                                                                        location.reload();
                                                                                    }
                                                                                })
                                                                                .catch((error) => {
                                                                                    alert(error.message);
                                                                                })

                                                                        } else {

                                                                            alert(error.message);

                                                                        }

                                                                    });
                                                            })
                                                            .catch((error) => {
                                                                alert(error.message);
                                                            });

                                                    }
                                                })
                                            })
                                            .catch((error) => {
                                                alert(error.message);
                                            });
                                    })
                                    .catch((error) => {
                                        alert(error.message);
                                    });
                            })
                            .catch((error) => {
                                alert(error.message);
                            });

                    })

                })
                .catch((error) => {

                    alert(error.message);
                })


        } else {
            alert("Você deseja editar ou excluir este usuario?");
        }


    })

} catch (err) {

    alert('Erro ' + err);

}