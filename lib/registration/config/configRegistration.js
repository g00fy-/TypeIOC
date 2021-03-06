/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../../exceptions/index');
var Utils = require('../../utils/index');
var ConfigRegistration = (function () {
    function ConfigRegistration(_registrationBaseService, _moduleRegistrationService) {
        this._registrationBaseService = _registrationBaseService;
        this._moduleRegistrationService = _moduleRegistrationService;
    }
    Object.defineProperty(ConfigRegistration.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        set: function (value) {
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigRegistration.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        set: function (value) {
            this._owner = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigRegistration.prototype, "registrations", {
        get: function () {
            var result = this.createComponentRegistrations(this._config.components);
            var moduleRegoes = this.createModuleRegistrations(this._config);
            return result.concat(moduleRegoes);
        },
        enumerable: true,
        configurable: true
    });
    ConfigRegistration.prototype.apply = function (config) {
        if (!config)
            throw new Exceptions.ArgumentNullError("config");
        this._config = config;
    };
    ConfigRegistration.prototype.createComponentRegistrations = function (components, serviceModule, resolverModule) {
        if (!components)
            return [];
        var self = this;
        return components.map(function (item) {
            return self.registerComponent(item, serviceModule, resolverModule);
        });
    };
    ConfigRegistration.prototype.createModuleRegistrations = function (config) {
        var result = [];
        if (!config.modules)
            return result;
        var self = this;
        config.modules.forEach(function (item) {
            var regoes = self.createModule(item);
            result.push.apply(result, regoes);
        });
        return result;
    };
    ConfigRegistration.prototype.createModule = function (configModule) {
        var result = [];
        if (configModule.components) {
            var componentRegos = this.createComponentRegistrations(configModule.components, configModule.serviceModule, configModule.resolverModule);
            result.push.apply(result, componentRegos);
        }
        if (configModule.serviceModule && configModule.resolverModule && configModule.forModule !== false) {
            var regoBase = this._registrationBaseService.create(configModule.serviceModule);
            var moduleRegistration = this._moduleRegistrationService.create(regoBase);
            var mRego = moduleRegistration.getAsModuleRegistration();
            var asResolver = mRego.as(configModule.resolverModule);
            if (configModule.within) {
                asResolver.within(configModule.within);
            }
            else {
                asResolver.within(this.scope);
            }
            if (configModule.ownedBy) {
                asResolver.ownedBy(configModule.ownedBy);
            }
            else {
                asResolver.ownedBy(this.owner);
            }
            if (configModule.forInstances) {
                var self = this;
                configModule.forInstances.forEach(function (forInstance) {
                    var resolver = self.getComponent(forInstance.resolver, configModule.resolverModule);
                    var params = forInstance.parameters || [];
                    var factory = forInstance.factory || self.getInstantiation(resolver, params, configModule.resolverModule);
                    asResolver.forService(resolver, factory);
                });
            }
            var regoes = moduleRegistration.registrations;
            result.push.apply(result, regoes);
        }
        return result;
    };
    ConfigRegistration.prototype.registerComponent = function (component, serviceModule, resolverModule) {
        var service = this.getComponent(component.service, serviceModule);
        var result = this._registrationBaseService.create(service);
        if (component.named) {
            result.name = component.named;
        }
        var params = component.parameters || [];
        if (component.factory) {
            result.factory = component.factory;
        }
        else {
            var resolver = this.getComponent(component.resolver, resolverModule);
            result.factory = this.getInstantiation(resolver, params, resolverModule);
        }
        result.scope = component.within || this.scope;
        result.owner = component.ownedBy || this.owner;
        if (component.initializeBy) {
            result.initializer = component.initializeBy;
        }
        if (component.disposer) {
            result.disposer = component.disposer;
        }
        return result;
    };
    ConfigRegistration.prototype.getComponent = function (instanceLocation, moduleInstance) {
        if (!instanceLocation.name) {
            var exception = new Exceptions.ConfigurationError('Missing component name');
            exception.innerError = new Exceptions.ArgumentNullError('name');
            exception.data = instanceLocation;
            throw exception;
        }
        var result;
        if (instanceLocation.instanceModule) {
            result = instanceLocation.instanceModule[instanceLocation.name];
            if (!result)
                throw new Exceptions.ConfigurationError('Component not found within instance location : ' + instanceLocation.name);
            return result;
        }
        if (moduleInstance) {
            result = moduleInstance[instanceLocation.name];
            if (!result)
                throw new Exceptions.ConfigurationError('Component not found within module instance : ' + instanceLocation.name);
            return result;
        }
        throw new Exceptions.ConfigurationError('Unable to load component : ' + instanceLocation.name);
    };
    ConfigRegistration.prototype.getInstantiation = function (resolver, parameters, moduleInstance) {
        var _this = this;
        return function (c) {
            var instances = parameters.map(function (item) {
                if (item.instance)
                    return item.instance;
                if (!item.location)
                    throw new Exceptions.ConfigurationError('Missing components location');
                var component = _this.getComponent(item.location, moduleInstance);
                return item.isDependency === true ? c.resolve(component) : new component();
            });
            return Utils.construct(resolver, instances);
        };
    };
    return ConfigRegistration;
})();
exports.ConfigRegistration = ConfigRegistration;
//# sourceMappingURL=configRegistration.js.map