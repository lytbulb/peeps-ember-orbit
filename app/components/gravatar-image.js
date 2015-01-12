import Ember from 'ember';

export default Ember.Component.extend({
  size: 100,
  email: '',

  gravatarUrl: function() {
    var email = this.get('email'),
        size = this.get('size');

    return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=' + size;
  }.property('email', 'size')
});
