import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function(model) {
    this.transitionTo('contact.index', model);
  }
});
