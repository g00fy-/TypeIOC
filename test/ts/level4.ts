'use strict';

import testData = require('./../test-data');
import scaffold = require('./../scaffold');


export module Level4 {

    var containerBuilder : Typeioc.IContainerBuilder;

    export function setUp(callback) {
        containerBuilder = scaffold.createBuilder();
        callback();
    }

    export function serviceRegisteredOnParentResolveOnChildContainer(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test1())
            .within(Typeioc.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    }

    export function serviceRegisteredNamedOnParentResolveNamedOnChildContainer(test) {

        var registrationName = 'name reg';

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test1())
            .named(registrationName)
            .within(Typeioc.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolveNamed<testData.Test1Base>(testData.Test1Base, registrationName);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    }

    export function serviceRegisteredOnParentResolveOnChildContainerNoHierarchy(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test1());

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");

        test.done();
    }

    export function hierarchyScopedInstanceIsReusedOnSameContainer(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("test 4"))
            .within(Typeioc.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    }

    export function hierarchyScopedInstanceIsReusedOnSameContainerChildFirst(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("test 4"))
            .within(Typeioc.Types.Scope.Hierarchy);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = child.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = container.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 1");

        test.done();
    }

    export function containerScopedInstanceIsNotReusedOnChild(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("test 4"))
            .within(Typeioc.Types.Scope.Container);

        var container = containerBuilder.build();
        var child = container.createChild();

        var test1 = container.resolve<testData.Test1Base>(testData.Test1Base);
        test1.Name = "test 1";
        var test2 = child.resolve<testData.Test1Base>(testData.Test1Base);

        test.notEqual(test1, null);
        test.strictEqual(test1.Name, "test 1");
        test.notEqual(test2, null);
        test.strictEqual(test2.Name, "test 4");

        test.done();
    }


    export function uknownScopeError(test) {

        containerBuilder.register<testData.Test1Base>(testData.Test1Base)
            .as(() => new testData.Test4("test 4"))
            .within(5);

        var container = containerBuilder.build();
        var child = container.createChild();

        var delegate = () => child.resolve<testData.Test1Base>(testData.Test1Base);

        test.throws(delegate, function(err) {
            return (err instanceof scaffold.Exceptions.ResolutionError) &&
                /Unknown scoping/.test(err.message);
        });

        test.done();
    }

}