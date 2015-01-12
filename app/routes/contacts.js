import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.get('store').find('contact');
    return this.get('store').all('contact');
  }
});
