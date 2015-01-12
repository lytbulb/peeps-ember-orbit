import Ember from 'ember';
import Orbit from 'orbit';
import JSONAPISource from 'orbit-common/jsonapi-source';
import JSONAPISerializer from 'orbit-common/jsonapi-serializer';
import LocalStorageSource from 'orbit-common/local-storage-source';
import EO from 'ember-orbit';

EO.Source.reopen({
  clone: function(source) {
    this.orbitSource.reset(Orbit.clone(source.orbitSource.retrieve()));
  }
});

EO.Context = EO.Store.extend({
  baseStore: null,

  init: function() {
    var baseStore = this.get('baseStore');

    this.set('schema', baseStore.get('schema'));

    this._super();

    this.clone(baseStore);

    this.beginTransaction();
  },

  beginTransaction: function() {
    this.set('transaction', new Orbit.Transaction(this.orbitSource));
  },

  commitTransaction: function() {
    var operations = this.get('transaction.ops');

    if (operations.length > 0) {
      operations = this.coalesceOperations(operations);

      console.log('commitTransaction - operations', operations);

      return this.get('baseStore').transform(operations);
    } else {
      return Ember.RSVP.Promise.resolve();
    }
  },

  coalesceOperations: function(ops) {
    var res = [];
    var prevOp;
    var i, il;
    var j, jl;
    var op;

    for (i = 0, il = ops.length; i < il; i++) {
      op = ops[i];

      // remove previous ops that are negated by this op
      if (op.op === 'replace' || op.op === 'remove') {
        for (jl = res.length, j = jl - 1; j >= 0; j--) {
          prevOp = res[j];
          if (Orbit.eq(prevOp.path, op.path)) {
            res.removeAt(j);
          }
        }
      }

      res.push(op);
    }

    return res;
  }
});

EO.Store.reopen({
  createContext: function() {
    return EO.Context.create({
      baseStore: this
    });

    // var rescueFindHandler = function() {
    //   return _this.find.apply(_this, arguments).then(function(found) {
    //     context.
    //   });
    // }
    // context.orbitSource.on('didFind', rescueFindHandler)
    //
    // var findConnector = new Orbit.RequestConnector(
    //   context.orbitSource,
    //   this.orbitSource,
    //   {mode: 'rescue', actions: ['find']}
    // );
  }
});

var MainStore = EO.Store.extend();

var APISerializer = JSONAPISerializer.extend({
  deserializeRecord: function(type, id, data) {
    var record = {};

    Object.keys(data).forEach(function(property) {
      record[ Ember.String.camelize(property) ] = data[ property ];
    });

    return this._super.call(this, type, id, record);
  },

  resourceType: function(type) {
    return Ember.String.underscore(this._super(type));
  },

  resourceLink: function(type, link) {
    return Ember.String.underscore(this._super(type, link));
  },

  resourceAttr: function(type, attr) {
    return Ember.String.underscore(this._super(type, attr));
  }
});

var APISource = JSONAPISource.extend({
  SerializerClass: APISerializer,

  ajax: function(url, method, hash) {
    // TODO - jsonapi-resources should accept application/vnd.api+json
    if (hash && hash.data) {
      hash.contentType = 'application/json; charset=utf-8';
    }
    // hash = hash || {};
    // hash.crossDomain = true;
    // hash.xhrFields = { withCredentials: true };
    return this._super(url, method, hash);
  }
});

var EO_APISource = EO.Source.extend({
  orbitSourceClass: APISource
});

var EO_LocalStorageSource = EO.Source.extend({
  orbitSourceClass: LocalStorageSource,
  orbitSourceOptions: {
    namespace: "peeps" // n.s. for localStorage
  }
});

function registerSources(application) {
  application.register('schema:main', EO.Schema);
  application.register('store:main', MainStore);
  application.register('source:api', EO_APISource);
  application.register('source:local', EO_LocalStorageSource);
}

function connectSources(container) {
  var main = container.lookup('store:main').orbitSource;
  var api = container.lookup('source:api').orbitSource;
  var local = container.lookup('source:local').orbitSource;

  // Set ids on sources for clearer logging
  main.id = 'main';
  api.id = 'api';
  local.id = 'local';

  // Initialize main source's cache from local storage
  main.reset(Orbit.clone(local.retrieve('/')));

  var mainToLocalConnector = new Orbit.TransformConnector(main, local);
  var mainToApiConnector = new Orbit.TransformConnector(main, api, { blocking: false });
  var apiToMainConnector = new Orbit.TransformConnector(api, main);

  main.on('didTransform', function(ops, inverse) {
    console.log('main.didTransform', ops, inverse);
  });

  main.on('didFind', function() {
    console.log('main.didFind', arguments);
    // api.find.apply(api, arguments);
  });

  main.on('didNotFind', function() {
    console.log('main.didNotFind', arguments);
  });

  main.on('assistFind', function(type, id) {
    console.log('main.assistFind', arguments);
    if (id === undefined) {
      api.find.apply(api, arguments);
    }
  });

  main.on('rescueFind', function() {
    console.log('main.rescueFind', arguments);
    return api.find.apply(api, arguments).then(
      function(r) {
        console.log('rescue success', r);
        return r;
      },
      function(e) {
        console.log('rescue fail', e);
        throw e;
      }
    );
  });

  api.on('didFind', function() {
    console.log('api.didFind', arguments);
  });

  api.on('didNotFind', function() {
    console.log('api.didNotFind', arguments);
  });

  api.on('assistFind', function() {
    console.log('api.assistFind', arguments);
  });

  api.on('rescueFind', function() {
    console.log('api.rescueFind', arguments);
  });

  local.on('didTransform', function(ops, inverse) {
    console.log('local.didTransform', ops, inverse);
  });
}

function injectSources(application) {
  application.inject('controller', 'store', 'store:main');
  application.inject('route', 'store', 'store:main');
}

export default {
  name: 'injectStore',
  initialize: function(container, application) {
    Orbit.Promise = Ember.RSVP.Promise;
    Orbit.ajax = Ember.$.ajax;

    registerSources(application);
    injectSources(application);
    connectSources(container);
  }
};
