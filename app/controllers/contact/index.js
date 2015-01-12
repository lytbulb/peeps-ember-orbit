import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    edit: function() {
      this.transitionToRoute('contact.edit');
    },

    remove: function() {
      var _this = this;
      this.get('model').remove().then(function() {
        _this.transitionToRoute('contacts.index');
      });
    }
  }
});
