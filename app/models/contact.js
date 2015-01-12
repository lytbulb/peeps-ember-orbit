import EO from 'ember-orbit';

export default EO.Model.extend({
  firstName: EO.attr('string'),
  lastName: EO.attr('string'),
  email: EO.attr('string'),
  twitter: EO.attr('string'),
  phoneNumbers: EO.hasMany('phoneNumber', {inverse: 'contact', actsAsSet: true}),

  fullName: function() {
    var firstName = this.get('firstName');
    var lastName = this.get('lastName');

    if (firstName && lastName) {
      return firstName + ' ' + lastName;

    } else if (firstName) {
      return firstName;

    } else if (lastName) {
      return lastName;

    } else {
      return '(No name)';
    }
  }.property('firstName', 'lastName')
});
