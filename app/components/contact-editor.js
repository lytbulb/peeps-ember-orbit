import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  contact: null,
  isNew: Ember.computed.none('model'),

  init: function() {
    var _this = this;

    this._super.apply(this, arguments);
    this.storeContext = this.get('store').createContext();

    if (this.get('isNew')) {
      this.storeContext.add('contact').then(function(contact) {
        _this.set('contact', contact);
      });

    } else {
      this.storeContext.find('contact', this.get('model.id')).then(function(contact) {
        _this.set('contact', contact);
      });
    }
  },

  didInsertElement: function() {
    this.$('input:first').focus();
  },

  actions: {
    addPhoneNumber: function() {
      var contact = this.get('contact');
      contact.get('store').add('phoneNumber').then(function(phoneNumber) {
        contact.get('phoneNumbers').addObject(phoneNumber);
      });
    },

    removePhoneNumber: function(phoneNumber) {
      var contact = this.get('contact');
      contact.get('phoneNumbers').removeObject(phoneNumber);
    },

    save: function() {
      var _this = this;
      var id =  this.get('contact.id');

      this.storeContext.commitTransaction().then(function() {
        _this.get('store').find('contact', id).then(function(model) {
          _this.sendAction('success', model);
        });
      });
    },

    cancel: function() {
      this.sendAction('cancel');
    }
  }
});
