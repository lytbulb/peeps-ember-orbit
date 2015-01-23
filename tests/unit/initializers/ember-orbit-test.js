import Ember from 'ember';
import initializer from 'peeps-ember-orbit/initializers/ember-orbit';

var container, application;

module('EmberOrbitInitializer', {
  setup: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function() {
  initializer.initialize(container, application);

  // you would normally confirm the results of the initializer here
  ok(true);
});
