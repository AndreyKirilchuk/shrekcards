let vefired = false;
let pass = localStorage.getItem('pass') ?? '';
const app = document.getElementById('app');
let theme = localStorage.getItem('theme') ?? 'dark';
let cards = JSON.parse(localStorage.getItem('cards')) ?? [];
let id = +(localStorage.getItem('id') ?? 1);
let search = "";

const render = () => {

    let filtered = cards.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    app.innerHTML = `
    ${(vefired && `
        <header>
            <div class="logo">
                ШрекКардс
            </div>

            <div>
                <input type="search" requeried placeholder="Поиск..." id="sea" value="${search}" />
            </div>

            <nav>
                <button onclick="leave()">
                    Выйти
                </button>
            </nav>
        </header>

        <div class="content">
            <div class="flex">
                <nav>
                    <button onclick="showDialog(this)">
                        Добавить карточку
                    </button>    

                    <dialog>
                        <form onsubmit="addCard(this)" class="card">
                            <input type="text" placeholder="Название карты" id="name" class="name" required>

                            <div class="flex">
                                <input type="text" placeholder="Номер карты" id="number" class="number" required >

                                <input type="password" placeholder="CVC" id="cvc" required minlength="3" maxlength="3">
                            </div>
                    
                            <div class="flex">
                                <input type="author" placeholder="Имя держателя" class="author" required id="author">
                    
                                <div>
                                    <input type="text" placeholder="До 10 / 24" id="date" class="date" required id="date"> 
                                </div>
                            </div>
                    
                            <input type="submit" value="Добавить карту">
                        </form>
                    </dialog>
                </nav>


                <nav>
                    <button onclick="updateTheme()">
                        Сменить тему
                    </button>   

                    <button onclick="showDialog(this)">
                        Сменить пароль
                    </button>   

                    <dialog>
                        <form onsubmit="renamePass()">
                            <input type="password" required min="3" id="pass" placeholder="Введите новый пароль">
                            <input type="submit" value="Сменить">
                        </form>        
                    </dialog>
                </nav>
            </div>

            <div class="card_list">
                ${filtered.map( el => `
                    <div class="card_container">
                        Название: ${el.name}<br>
                        Номер: ***${el.number.slice(-4)} <br>
                        <button onclick="showDialog(this)">
                            Подробнее
                        </button>

                            <dialog>
                                <form onsubmit="redactCard(this)" class="card">
                                    <input type="hidden" value="${el.id}" id="id">
                                    <input type="text" placeholder="Название карты" value="${el.name}" id="name" class="name" required>
                                    <button type="button" onclick="copy(this)">
                                        Скопировать номер карты
                                    </button>

                                    <input type="hidden" value="${el.number}" id="hiddename">

                                    <div class="flex">
                                        <input type="text" placeholder="Номер карты" value="${el.number}" id="number" class="number" required>

                                        <input type="password" placeholder="CVC" id="cvc" value="${el.cvc}" required minlength="3" maxlength="3">
                                    </div>
                            
                                    <div class="flex">
                                        <input type="author" placeholder="Имя держателя" value="${el.author}" class="author" required id="author">
                            
                                        <div>
                                            <input type="text" placeholder="До 10 / 24" value="${el.date}" id="date" class="date" required id="date"> 
                                        </div>
                                    </div>
                            
                                    <input type="submit" value="Сохранить">
                                </form>    
                            </dialog>

                            <button onclick="showDialog(this)">
                                Удалить
                            </button>
                 
                            <dialog>
                                <form onsubmit="deleteCard(this)" class="card">
                                    Подтвердите удаление
                                    <input type="hidden" value="${el.id}" id="id">

                                    <input type="submit" value="Удалить">
                                </form>   
                            </dialog>

                        </div>  
                `).join('')}
            </div>
        </div>
    `) || ``}
    

    ${(!vefired && pass && `
        <form onsubmit="signin()">
            Авторизация
            <input type="password" required minlength="3" id="pass" placeholder="Введите пароль">
            <input type="submit" value="Войти">
        </form>
    `) || ``}


    ${(!vefired && !pass && `
        <form onsubmit="setPass()">
            Регистрация
            <input type="password" required minlength="3" id="pass" placeholder="Придумайте пароль">
            <input type="submit" value="Продолжить">
        </form>        
    `) || ``}

    `;

    const forms = document.querySelectorAll('form');

    forms.forEach(form => (
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        })
    ))
    
    const dialogs = document.querySelectorAll('dialog');

    dialogs.forEach(e =>{
        e.addEventListener('click', function(event){
            if(event.target === e){
                e.close();
            }
        })
    })

    const dates = document.querySelectorAll('.date')

    dates.forEach(e => {
        e.addEventListener('input', (event) => {
            let value = event.target.value.replace(/\D/g, "");
            const pattern = "До __ / __"
            let result = "";
            let j = 0;
            for(let i = 0; i < pattern.length; i++){
                if(pattern[i] === "_"){
                    result += value[j] || "_";
                    j++;
                }else{
                    result += pattern[i];
                }
            }

            event.target.value = result;
        })
    })

    const numbers = document.querySelectorAll('.number');

    numbers.forEach(e=>{
        e.addEventListener('input', (event) => {
            let value = event.target.value.replace(/\D/g, "");
            const pattern = "____   ____   ____   ____"
            let result = "";
            let j = 0;
            for(let i = 0; i < pattern.length; i++){
                if(pattern[i] === "_"){
                    result += value[j] || "_";
                    j++;
                }else{
                    result += pattern[i];
                }
            }

            event.target.value = result;
        })
    })

    const sea = document.getElementById('sea');

    sea.addEventListener('input', function(){
        search = this.value;
        
        setTimeout(() => {
            render();
        },1000)
    })
}

function signin(){
    if(pass === this.pass.value){
        vefired = true;
        render();
    }else{
        this.pass.classList.add('error');
        setTimeout(() => {
            this.pass.classList.remove('error');
        }, 500)
    }
}

const copy = (copy) => {
    navigator.clipboard.writeText(copy.nextElementSibling.value)
}

function deleteCard(form){
    let card = cards.find(item => item.id === +(form.id.value))

    cards.splice(cards.indexOf(card), 1)

    render()
}

function redactCard(form){
    let card = cards.find(item => item.id === +(form.id.value))

    card.name = form.name.value;
    card.number = form.number.value;
    card.cvc = form.cvc.value;
    card.author = form.author.value;
    card.date = form.date.value;
    
    render();
}

function addCard(form){
    let name = form.name.value;
    let number = form.number.value;
    let cvc = form.cvc.value;
    let author = form.author.value;
    let date = form.date.value;

    cards.push({id, name, number, cvc, author, date});

    id++;
    
    render();
}

function setPass(){
    pass = this.pass.value;
    vefired = true;
    render();
}

const leave = () => {
    vefired = false;
    render()
}

function renamePass(){
    pass = this.pass.value;
    leave();
}

function showDialog(e){
    e.nextElementSibling.show()
}

const setTheme = () => {
    if(theme === 'white'){
        document.body.removeAttribute('dark', '');
    }else{
        document.body.setAttribute('dark', '');
    }
}

const updateTheme = () => {
    if(theme === 'white'){
        document.body.setAttribute('dark', '');
        theme = 'dark'
    }else{
        document.body.removeAttribute('dark', '');
        theme = 'white'
    }
}

setTheme();
render();

window.addEventListener('beforeunload', () => {
    localStorage.setItem('theme', theme); 
    localStorage.setItem('pass', pass); 
    localStorage.setItem('cards', JSON.stringify(cards));
    localStorage.setItem('id', id)
})