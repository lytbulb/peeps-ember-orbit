import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('contacts', function() {
    this.route('new');
    this.resource('contact', {path: ':contact_id'}, function() {
      this.route('edit');
    });
  });
});

export default Router;
