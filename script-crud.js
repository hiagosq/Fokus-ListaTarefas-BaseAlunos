const taskListContainer = document.querySelector('.app__section-task-list');
const taskAtiveDescription = document.querySelector('.app__section-active-task-description');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
const formTask = document.querySelector('.app__form-add-task');
const cancelarEdicao = document.querySelector('.app__form-footer__button--cancel');
const deletarEdicao = document.querySelector('.app__form-footer__button--delete');
const adicionarEdicao = document.querySelector('.app__button--add-task');
const deletarConcluida = document.querySelector('#btn-remover-concluidas');
const deletarTodas = document.querySelector('#btn-remover-todas');

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;
let tarefaEmEdicao = null;
let paragraphEmEdicao = null;

let tarefas = [
    {
        descricao:'Tarefa Concluída',
        concluida: true
    },
    {
        descricao:'Tarefa Pendente 1',
        concluida: false
    },
    {
        descricao:'Tarefa Pendente 2',
        concluida: false
    }
];

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"&gt>;
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

adicionarEdicao.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando Tarefa';
    formTask.classList.toggle('hidden');
})

cancelarEdicao.addEventListener('click', () =>{
    formTask.classList.add('hidden');
    limparForm();

})

deletarEdicao.addEventListener('click', () =>{
    if(tarefaSelecionada){
        itemTarefaSelecionada.remove();
        tarefas.filter(t => t != tarefaSelecionada);
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
    }
    limparForm();
});

const selecionarTarefaParaEditar = (tarefa, elemento, li) => {
    selecionarTarefa(tarefa, li);
    if(tarefa.concluida){
        return;
    }

    if(tarefaEmEdicao == tarefa){
        return;
    }

    formLabel.textContent = 'Editando Tarefa';
    tarefaEmEdicao = tarefa;
    paragraphEmEdicao = elemento;
    textArea.value = tarefa.descricao;
    formTask.classList.remove('hidden');


};

const selecionarTarefa = (tarefa, elemento) => {
    if(tarefa.concluida){
        return;
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function(button){
        button.classList.remove('app__section-task-list-item-active');
    });

    if(tarefaSelecionada == tarefa){
        taskAtiveDescription.textContent = null;
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
    }

    tarefaSelecionada = tarefa;
    itemTarefaSelecionada = elemento;
    taskAtiveDescription.textContent = tarefa.descricao;
    elemento.classList.add('app__section-task-list-item-active');

};


function createTask(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg; 

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');
    button.classList.add('add_button-edit');

    const editIcon = document.createElement('img');
    editIcon.setAttribute('src','./imagens/edit.png');

    button.appendChild(editIcon);

    button.addEventListener('click', (evento) => {
        evento.stopPropagation();
        selecionarTarefaParaEditar(tarefa, paragraph, li);
    });

    li.onclick = () => {
        selecionarTarefa(tarefa, li);
    };

    svgIcon.addEventListener('click', (evento) => {
        evento.stopPropagation();
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', true);
    });

    if(tarefa.concluida){
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    }


    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
};

formTask.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    if(tarefaEmEdicao){
        tarefaEmEdicao.descricao = textArea.value;
        paragraphEmEdicao.textContent = textArea.value;
    } else{
        const task = {
            descricao:textArea.value,
            concluida: false
        }
        tarefas.push(task);
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }
    taskAtiveDescription.textContent = textArea.value;
    limparForm();
});

tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

function limparForm(){
    tarefaEmEdicao = null;
    paragraphEmEdicao = null;
    textArea.value = '';
    formTask.classList.add('hidden');
    taskAtiveDescription.textContent = null;
};

const removerTarefa = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach((element) =>{
        element.remove();
    });
    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida):[];
    limparForm();
}

deletarConcluida.addEventListener('click', () => removerTarefa(true));
deletarTodas.addEventListener('click', () => removerTarefa(false));