import EO from 'ember-orbit';

export default EO.Model.extend({
  name: EO.attr('string'),
  phoneNumber: EO.attr('string'),
  contact: EO.hasOne('contact', {inverse: 'phoneNumbers'})
});
