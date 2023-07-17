const db = firebase.firestore();
const uid = localStorage.getItem('Uid');
var nomeSession;

firebase.storage().ref().child("vazio").child("personIcon.jpg").getDownloadURL()
    .then((url) => {

        const img = document.getElementById('imgPhotoCad');
        img.setAttribute('src', url);
    })
    .catch((error) => {
        alert(error.message)
    });

try {

    class Cadastro_Usuario {
        constructor(nome, email, senha, perfil) {

            this.nome = nome;
            this.email = email;
            this.senha = senha;
            this.perfil = perfil;
        }

        cadastrar() {

            document.querySelector("div[class='container-loader']").style.display = "block";

            firebase.auth().createUserWithEmailAndPassword(this.email, this.senha)
                .then((userCredential) => {

                    db.collection("usuarios(Site)").add({

                        uid: userCredential.user.uid,
                        nome: this.nome,
                        email: this.email,
                        senha: this.senha
                    })
                        .then((docRef) => {

                            const id = docRef.id;

                            document.querySelector("div[class='container-loader']").style.display = "none";

                            db.collection("usuarios(Site)").doc(id).collection("perfis").add({
                                idUsuario: id,
                                perfil: this.perfil
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
                                        alteracao: `O usuario ${nomeSession} cadastrou o usuario "${this.nome}" no dia ${data_hora}`,
                                        data_hora: data_hora
                                    })
                                        .then(() => {

                                            alert('Usuario cadastrado');

                                        })
                                        .catch((error) => {
                                            document.querySelector("div[class='container-loader']").style.display = "none";
                                            alert(error.message);
                                        })
                                })
                                .catch((error) => {
                                    document.querySelector("div[class='container-loader']").style.display = "none";
                                    alert(error.message);
                                });
                        })
                        .catch((error) => {
                            document.querySelector("div[class='container-loader']").style.display = "none";
                            alert(error.message);
                        });
                })
                .catch((error) => {

                    document.querySelector("div[class='container-loader']").style.display = "none";

                    if (error.code == "auth/email-already-in-use") {

                        alert("Email existente")
                    } else if (error.code == "auth/invalid-email") {

                        alert("Email invalido");
                    } else {

                        alert(error.message);

                    }
                });
        }
    }

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
        const nome = formdata.get("nome").trim();
        const email = formdata.get("email").replace(/ /g, "");
        const senha = formdata.get("senha").replace(/ /g, "");
        const perfil = formdata.get("perfis");
        const imagem = formdata.get("imagem");

        if (nome.length == 0 || senha.length == 0 || email.length == 0) {

            alert('Preencha todos os campos');

        } else {

            if (senha.length < 6) {

                alert('senha invalida');
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

                                    firebase.storage().ref().child(nome).put(imagem)
                                        .then(() => {

                                            var user = new Cadastro_Usuario(nome, email, senha, perfil);
                                            user.cadastrar();

                                        })
                                        .catch((error) => {

                                            alert(error.message);

                                        })
                                }
                            } else {

                                var user = new Cadastro_Usuario(nome, email, senha, perfil);
                                user.cadastrar();

                            }
                        }
                    })
                    .catch((error) => {
                        alert(error.message);
                    });

            }
        }
    });

} catch (err) {

    alert('Erro ' + err);
}