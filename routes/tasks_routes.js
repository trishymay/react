'use strict';

var Task = require('../models/Task');
var bodyparser = require('body-parser');

module.exports = function(app) {
  app.use(bodyparser.json());

  app.get('/tasks', function(req, res) {
    Task.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve task'});

      res.json(data);
    });
  });

  app.post('/tasks', function(req, res) {
    var newTask = new Task(req.body);
    newTask.save(function(err, task) {
      if (err) return res.status(500).send({'msg': 'could not save task'});

      res.json(task);
    });
  });

  app.put('/tasks/:id', function(req, res) {
    var updatedTask = req.body;
    delete updatedTask._id;
    Task.update({_id: req.params.id}, updatedTask, function(err) {
      if (err) return res.status(500).send({'msg': 'could not update task'});

      res.json(req.body);
    });
  });

  app.delete('/tasks/:id', function(req, res) {
    Task.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send({'msg': 'could not delete task'});

      res.json({msg: 'task deleted'});
    });
  });
};