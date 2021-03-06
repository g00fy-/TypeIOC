
'use strict';

exports.internal = {

    registrationBase : (function() {

        var Scaffold = require('../../scaffold');
        var RegistrationBaseModule = require('../../../lib/registration/base/registrationBase');
        var mockery = Scaffold.Mockery;

        return {

            constructor_setsUp_default_values : function(test) {

                var service = function() {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(service);

                test.strictEqual(service, serviceEntry.service);
                test.ok(serviceEntry.factory === null);
                test.ok(serviceEntry.name === null);
                test.ok(serviceEntry.initializer === null);
                test.ok(serviceEntry.disposer === null);
                test.ok(serviceEntry.instance === null);
                test.ok(serviceEntry.args);
                test.ok(Array.isArray(serviceEntry.args));
                test.strictEqual(0, serviceEntry.args.length);

                test.done();
            },

            has_name_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('name' in serviceEntry);

                test.done();
            },

            name_property_setUp : function(test) {

                var name = 'test';
                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.name = name;

                test.strictEqual(name, serviceEntry.name);

                test.done();
            },

            has_service_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('service' in serviceEntry);

                test.done();
            },

            service_property_setUp : function(test) {

                var service = function() {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(service);

                test.strictEqual(service, serviceEntry.service);

                test.done();
            },

            has_scope_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('scope' in serviceEntry);

                test.done();
            },

            scope_property_setUp : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.scope = Scaffold.Types.Scope.Hierarchy;

                test.strictEqual(Scaffold.Types.Scope.Hierarchy, serviceEntry.scope);

                test.done();
            },

            has_owner_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('owner' in serviceEntry);

                test.done();
            },

            owner_property_setUp : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.owner = Scaffold.Types.Owner.Externals;

                test.strictEqual(Scaffold.Types.Owner.Externals, serviceEntry.owner);

                test.done();
            },

            has_initializer_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('initializer' in serviceEntry);

                test.done();
            },

            initializer_property_setUp : function(test) {

                var initializer = new function(c, item) {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.initializer = initializer;

                test.strictEqual(initializer, serviceEntry.initializer);

                test.done();
            },

            has_disposer_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('disposer' in serviceEntry);

                test.done();
            },

            disposer_property_setUp : function(test) {

                var disposer = new function(item) {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.disposer = disposer;

                test.strictEqual(disposer, serviceEntry.disposer);

                test.done();
            },

            has_args_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('args' in serviceEntry);

                test.done();
            },

            args_property_setUp : function(test) {

                var args = [1, 3, 4];

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.args = args;

                test.strictEqual(args, serviceEntry.args);
                test.strictEqual(3, serviceEntry.args.length);

                test.done();
            },

            has_container_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('container' in serviceEntry);

                test.done();
            },

            container_property_setUp : function(test) {

                var container = {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.container = container;

                test.strictEqual(container, serviceEntry.container);

                test.done();
            },

            has_instance_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('instance' in serviceEntry);

                test.done();
            },

            instance_property_setUp : function(test) {

                var instance = {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.instance = instance;

                test.strictEqual(instance, serviceEntry.instance);

                test.done();
            },

            has_factory_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('factory' in serviceEntry);

                test.done();
            },

            factory_property_setUp : function(test) {

                var factory = function() {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.factory = factory;

                test.strictEqual(factory, serviceEntry.factory);

                test.done();
            },

            has_invoker_property : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                test.ok('invoker' in serviceEntry);

                test.done();
            },

            invoker_returns_function : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                var invoker = serviceEntry.invoker;

                test.ok(invoker);
                test.ok(typeof(invoker) == 'function');

                test.done();
            },

            invoker_returns_function_that_invokes_factory : function(test) {

                var factory = mockery.stub();

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.factory = factory;
                serviceEntry.container = {};

                var invoker = serviceEntry.invoker;
                invoker();

                test.ok(factory.calledOnce);

                test.done();
            },

            invoker_returns_function_that_invokes_factory_with_container_as_first_parameter : function(test) {

                var container = {};
                var firstArg = 1;
                var secondArg = 'a';
                var thirdArg = 'test';
                var factory = mockery.stub();

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.factory = factory;
                serviceEntry.container = container;
                serviceEntry.args = [firstArg, secondArg, thirdArg];

                var invoker = serviceEntry.invoker;
                invoker();

                test.ok(factory.withArgs(container, firstArg, secondArg, thirdArg).calledOnce);

                test.done();
            },


            cloneFor_clones_factory : function(test) {

                var factory = function (c, item) { };

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.factory = factory;


                var actual = serviceEntry.cloneFor(null);

                test.ok(actual.factory);
                test.strictEqual(actual.factory, serviceEntry.factory);

                test.done();

            },

            cloneFor_clones_scope : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.scope = Scaffold.Types.Scope.Hierarchy;

                var actual = serviceEntry.cloneFor(null);

                test.strictEqual(actual.scope, serviceEntry.scope);
                test.strictEqual(actual.scope, Scaffold.Types.Scope.Hierarchy);

                test.done();
            },

            cloneFor_clones_owner : function(test) {

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.owner = Scaffold.Types.Owner.Externals;


                var actual = serviceEntry.cloneFor(null);

                test.strictEqual(actual.owner, serviceEntry.owner);
                test.strictEqual(actual.owner, Scaffold.Types.Owner.Externals);

                test.done();

            },

            cloneFor_clones_container : function(test) {

                var container = {};

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);

                var actual = serviceEntry.cloneFor(container);

                test.ok(actual.container);
                test.strictEqual(actual.container, container);

                test.done();
            },

            cloneFor_clones_initializer : function(test) {

                var initializer = function (c, item) { };

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(null);
                serviceEntry.initializer = initializer;

                var actual = serviceEntry.cloneFor(null);

                test.ok(actual.initializer);
                test.strictEqual(actual.initializer, initializer);

                test.done();
            },

            cloneFor_clones_service : function(test) {

                var service = function() {  };

                var serviceEntry = new RegistrationBaseModule.RegistrationBase(service);

                var actual = serviceEntry.cloneFor(null);

                test.ok(actual.service);
                test.strictEqual(actual.service, serviceEntry.service);

                test.done();
            }
        };

    })()
}