'use strict';

var React = require('react');
var ajax = require('jquery').ajax;

var tasksData = [{taskBody: 'hello world', _id: 1}, {taskBody: 'goodbye world', _id: 2}];

var TaskForm = React.createClass({
  getInitialState: function() {
    return {newTask: {taskBody: ''}};
  },
  handleChange: function(event) {
    this.setState({newTask: {taskBody: event.target.value}});
  },
  handleSubmit: function(event) {
    event.preventDefault();
    console.log(this.state.newTask);
    var newTask = this.state.newTask;
    ajax({
      url: this.props.url,
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(newTask),
      success: function(data) {
        this.props.onNewTaskSubmit(data);
        this.setState({newTask: {taskBody: ''}});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="newtask">New Task</label>
        <input id="newtask" type="text" value={this.state.newTask.taskBody} onChange={this.handleChange}/>
        <button type="submit">Create New Task</button>
      </form>
    )
  }
});

var Task = React.createClass({
  render: function() {
    return <li>{this.props.data.taskBody}</li>
  }
});

var TaskList = React.createClass({
  render: function() {
    var tasks = this.props.data.map(function(task) {
      return <Task data={task} key={task._id}/>;
    });
    return (
      <section>
        <h1>Tasks to complete:</h1>
        <ul>
          {tasks}
        </ul>
      </section>
    )
  }
});

var TasksApp = React.createClass({
  getInitialState: function() {
    return {tasksData: []};
  },
  onNewTask: function(task) {
    task._id = this.state.tasksData.length + 1;
    var stateCopy = this.state;
    stateCopy.tasksData.push(task);
    this.setState(stateCopy);
  },
  componentDidMount: function() {
    ajax({
      url: this.props.tasksBaseUrl,
      dataType: 'json',
      success: function(data) {
        var state = this.state;
        state.tasksData = data;
        this.setState(state);
      }.bind(this),
      error: function(xhr, status) {
        console.log(xhr, status);
      }
    });
  },
  render: function() {
    return (
      <main>
        <TaskForm onNewTaskSubmit={this.onNewTask} url={this.props.tasksBaseUrl}/>
        <TaskList data={this.state.tasksData} />
      </main>
    )
  }
});

React.render(<TasksApp tasksBaseUrl={'/api/v1/tasks'}/>, document.body);