'use strict';

const {Component, renderTo} = require('xow');
const {observable, observe, link, pipe} = require('xain');

let storedState = localStorage.getItem('state');

const state = observable(storedState ? JSON.parse(storedState) : {
    currentInput: '',
    tasks: []
});

observe(state, () => {
    localStorage.setItem('state', JSON.stringify(state));
});

let id = 0;

class TaskAdder extends Component(state) {
    static reaction(state) {
        return {
            current: pipe(state, 'currentInput')
        }
    }
    render() {
        const {current} = this.props;
        return ['div', {}, [
            ['input', {
                value: new String(current),
                style: {display: 'inline-block'}, 
                oninput(e) {state.currentInput = e.target.value}
            }],
            ['button', {
                style: {display: 'inline-block'}, 
                disabled: current ? undefined : true,
                onclick() {
                    state.tasks = [...state.tasks, {text: current, id: id++, enabled: true}];
                    state.currentInput = '';
                }
            }, ['Add']],
            ['button', {
                style: {display: 'inline-block'},
                onclick() {
                    state.tasks = state.tasks.filter(({enabled}) => enabled);
                }
            }, ['Clear all done']]
        ]];
    }
}

class TaskList extends Component(state) {
    static reaction(state) {
        return {
            tasks: pipe(state, 'tasks'),
            taskCount: link(state, ({tasks}) => tasks.length)
        }
    }
    render() {
        const {tasks, taskCount} = this.props;
        return ['div', {}, [
            ['p', {}, [`Task count is: ${taskCount}`]],
            ['ul', {}, tasks.map((task, i) => (new Task({task, i})).$)]
        ]];
    }
}

class Task extends Component() {
    render() {
        const {task, i} = this.props;
        return ['li', {
            key: task.id,
            style: {'text-decoration': task.enabled ? 'initial' : 'line-through'},
            onclick: () => {
                state.tasks = [...state.tasks.slice(0, i), 
                               Object.assign({}, task, {enabled: !task.enabled}),
                               ...state.tasks.slice(i + 1)];
            }
        }, [task.text]]
    }
}

class Main extends Component() {
    render() {
        const { newTask, list } = this.props;
        return ['div', {}, [
            ['h1', {}, [
                'Welcome!'
            ]],
            newTask.$,
            list.$
        ]];
    }
}

renderTo(document.getElementById('container'), new Main({
    newTask: new TaskAdder,
    list: new TaskList
}));
