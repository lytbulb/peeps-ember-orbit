import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return null;
  },

  renderTemplate: function() {
    this.render({outlet: 'detail'});
  },

  actions: {
    contactCreated: function(contact) {
      this.transitionTo('contact.index', contact);
    },

    cancelContactCreation: function() {
      this.transitionTo('contacts.index');
    }
  }
});
