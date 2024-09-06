const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn'); //html element가 들어있음. 

let todos = [

];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    //새로운 item 객체 생성하기 -> 초기값
    const item = { 
        id: new Date().getTime(),  
        text: '',
        complete: false}

    // 배열 맨 앞에 새로운 아이템 추가 
    todos.unshift(item); 

    //return 값이 있으니까
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);

    list.append(itemEl);
    inputEl.removeAttribute('disabled')
    inputEl.focus(); //바로 타이핑 할 수 있게 
    saveToLocalStorage();
}

//요소생성하기 (현재는 데이터만 생성한 상태니까 화면에는 보이지 않음)
//따로 함수로 빼기
function createTodoElement (item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');

    const checkboxEl  = document.createElement('input');
    checkboxEl.type = 'checkbox'; 
    checkboxEl.checked = item.complete;

    if(item.complete) {
        itemEl.classList.add('complete');
    }

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', '');

    const actionsEl =  document.createElement('div');
    actionsEl.classList.add('actions');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons','remove-btn');
    removeBtnEl.innerText = 'remove_circle';

    checkboxEl.addEventListener('change', ()=> {
        item.complete = checkboxEl.checked;

        if (item.complete) {
            itemEl.classList.add('complete');
        } else {
            itemEl.classList.remove('complete');
        }
        saveToLocalStorage();
    })
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    inputEl.addEventListener('blur', ()=> {
        inputEl.setAttribute('disabled','');
        saveToLocalStorage();
    })
    
    inputEl.addEventListener('input', ()=> {
        item.text = inputEl.value;
    })

    editBtnEl.addEventListener('click', ()=> {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    removeBtnEl.addEventListener('click',()=>{
       todos = todos.filter(t => t.id !== item.id)

       itemEl.remove();
       saveToLocalStorage();
    })


    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    itemEl.append(actionsEl);

    return {itemEl, inputEl, editBtnEl, removeBtnEl}

}

function saveToLocalStorage () {
    const data = JSON.stringify(todos);

    localStorage.setItem('my-todos',data);
}

//local storage에 저장된 데이터 가져오기
function loadFromLocalStorage () {
    const data = localStorage.getItem('my-todos');
    
    if (data) {
        todos = JSON.parse(data); //string -> 객체 변환
    }
}

function displayTodos () {
    loadFromLocalStorage();

    for(let i =0;i<todos.length ; i ++) {
        const item = todos[i];
        const {itemEl} = createTodoElement(item);

        list.append(itemEl);
    }

}

displayTodos(); //스크립트 실행되자마자 실행되도록 설정. 