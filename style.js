$(document).ready(function () {
    $('.sub-btn').click(function () {
        $(this).next('.sub-menu').slideToggle();
        $(this).find('.dropdown').toggleClass('rotate')
    });

    $('.ll').click(function () {
        $(this).find('.fundo-none').toggleClass('fundo-view')
    });

    class MobileNavbar {
        constructor(mobileMenu, sideBar) {
            this.mobileMenu = document.querySelector(mobileMenu);
            this.sideBar = document.querySelector(sideBar);
            this.activeClass = "active";
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
            this.sideBar.classList.toggle(this.activeClass);
            this.mobileMenu.classList.toggle(this.activeClass);
        }

        addClickEvent() {
            this.mobileMenu.addEventListener("click", () => {
                this.handleClick();
            })
        }
    }
    const mobileMenu = new MobileNavbar(".mobile-menu", ".side-bar");
    mobileMenu.addClickEvent();

    

    db.collection("usuarios(Site)").where("uid", "==", uid).get()
        .then((docRef) => {

            docRef.forEach(doc => {

                const nomeUser = document.querySelector('div[class="nome"]');

                nomeSession = doc.data().nome;
                emailSession = doc.data().email;

                const emailUser = document.querySelector('div[class="email"]');

                const email = doc.data().email;

                firebase.storage().ref().child(nomeSession).getDownloadURL()
                    .then((url) => {

                        const img = document.getElementById('imgPhoto');
                        img.setAttribute('src', url);
                    })
                    .catch((error) => {

                        if (error.code == "storage/object-not-found") {

                            firebase.storage().ref().child("vazio").child("personIcon.jpg").getDownloadURL()
                                .then((url) => {

                                    const img = document.getElementById('imgPhoto');
                                    img.setAttribute('src', url);
                                })
                                .catch((error) => {
                                    alert(error.message);
                                });

                        } else {

                            alert(error.message);

                        }
                    });

                nomeUser.innerHTML = nomeSession;
                emailUser.innerHTML = email;

            });
        })
        .catch((error) => {
            alert(error.message);
        })

    document.querySelector("a[name='logout']").addEventListener("click", function () {
        firebase.auth().signOut()
            .then((docref) => {
                localStorage.setItem('sessionOn', "não");
                localStorage.setItem('Uid', "");
                window.location.href = "https://cajuinotification.github.io/login/";
            })
            .cath((error) => {
                alert(error.message);
            });
    })
});