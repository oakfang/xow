'use strict';

const {Component, renderTo, YES, NO} = require('xow');
const {observable, observe, link, pipe} = require('xain');

let storedState = localStorage.getItem('state');

const state = observable(storedState ? JSON.parse(storedState) : {
    currentInput: '',
    tasks: []
});

const App = Component(state);

observe(state, () => {
    localStorage.setItem('state', JSON.stringify(state));
});

let id = 0;

class TaskAdder extends App {
    static reaction(state) {
        return {
            current: pipe(state, 'currentInput'),
            disabledCount: link(state, ({tasks}) => tasks.filter(({enabled}) => !enabled).length)
        }
    }
    render() {
        const {current, disabledCount} = this.props;
        return ['div', {}, [
            ['input', {
                value: new String(current),
                style: {display: 'inline-block'}, 
                oninput(e) {this.state.currentInput = e.target.value}
            }],
            ['button', {
                style: {display: 'inline-block'}, 
                disabled: current ? NO : YES,
                onclick() {
                    this.state.tasks = [...state.tasks, {text: current, id: id++, enabled: true}];
                    this.state.currentInput = '';
                }
            }, ['Add']],
            ['button', {
                style: {display: 'inline-block'},
                disabled: disabledCount ? NO : YES,
                onclick() {
                    this.state.tasks = this.state.tasks.filter(({enabled}) => enabled);
                }
            }, 'Clear all done']
        ]];
    }
}

class TaskList extends App {
    static reaction(state) {
        return {
            tasks: pipe(state, 'tasks'),
            taskCount: link(state, ({tasks}) => tasks.length)
        }
    }
    render() {
        const {tasks, taskCount} = this.props;
        return ['div', {}, [
            ['h3', {}, `Task count is: ${taskCount}`],
            ['ul', {style: {'padding': 0}}, tasks.map((task, i) => (new Task({task, i})).$)]
        ]];
    }
}

class Task extends App {
    render() {
        const {task, i} = this.props;
        return ['li', {
            key: task.id,
            style: {'list-style-type': 'none'},
            onclick() {
                this.state.tasks = [...this.state.tasks.slice(0, i), 
                                    Object.assign({}, task, {enabled: !task.enabled}),
                                    ...this.state.tasks.slice(i + 1)];
            }
        }, [
            ['input', {
                type: 'checkbox',
                checked: task.enabled ? NO : YES,
                style: {'display': 'inline-block', 'margin-right': '25px', 'vertical-align': 'bottom'}
            }],
            ['span', {
                style: {'text-decoration': task.enabled ? 'initial' : 'line-through'}
            }, task.text]
        ]]
    }
}

class Main extends App {
    render() {
        const { newTask, list } = this.props;
        return ['div', {}, [
            ['h1', {}, 'Welcome!'],
            newTask.$,
            list.$
        ]];
    }
}

renderTo(document.getElementById('container'), new Main({
    newTask: new TaskAdder,
    list: new TaskList
}));