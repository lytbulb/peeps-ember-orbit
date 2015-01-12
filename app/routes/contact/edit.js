import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({outlet: 'detail'});
  },

  actions: {
    contactUpdated: function() {
      this.transitionTo('contact.index');
    },

    cancelContactEditing: function() {
      this.transitionTo('contact.index');
    }
  }
});
