/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

///<reference path='typeioc.d.ts' />

declare module Typeioc.Internal {

    interface IRegistrationBaseService {
        create(service : any) : IRegistrationBase;
    }

    interface IInstanceRegistrationService {
        create<R>(baseRegistration : IRegistrationBase) : Typeioc.IRegistration<R>;
    }

    interface IModuleRegistrationService {
        create(baseRegistration : IRegistrationBase) : IModuleRegistration;
    }

    interface IConfigRegistrationService {
        create(config : Typeioc.IConfig) : IConfigRegistration;
    }

    interface IRegistrationStorageService {
        create<R>() : IRegistrationStorage<R>;
    }

    interface IIDisposableStorageService {
        create() : IDisposableStorage;
    }

    interface IInternalStorageService<K, T> {
        create() : Typeioc.Internal.IInternalStorage<K, T>;
    }

    interface IContainerService {
        create() : IContainer;
    }

    interface IContainerApiService {
        create<R>(container : IImportApi<R>) : IContainerApi<R>;
    }

    interface IInternalContainerService {
        create() : IContainer;
    }

    interface IContainerApi<T> {
        serviceValue : T;
        nameValue : string;
        cacheValue : IApiCache;
        dependenciesValue : Array<Typeioc.IDynamicDependency>;
        isDependenciesResolvable : boolean;
        attemptValue : boolean;
        throwResolveError : boolean;
        argsValue : Array<any>;
        service(value : any) : Typeioc.IResolveWith<T>;
    }

    interface IImportApi<T> {
        execute(api : IContainerApi<T>) : T;
    }

    interface IApiCache {
        use : boolean;
        name :string
    }

    interface IContainer extends Typeioc.IContainer {
        add(registrations : IRegistrationBase[]) : void;
    }


    interface IIndex {
        [index: number]: any;
    }

    interface IIndexedCollection extends IIndex {
        [name: string]: any;
    }

    interface IInternalStorage<K, T> {
        add(key : K, value : T) : void;
        get(key : K) : T;
        tryGet(key : K) : T;
        register(key: K, defaultValue: () => T) : T;
        contains (key : K) : boolean;
    }

    interface IDisposableItem {
        weakReference : any;
        disposer : Typeioc.IDisposer<any>;
    }

    interface IDisposableStorage {
        add(obj : any, disposer : Typeioc.IDisposer<any>);
        disposeItems();
    }

    interface IRegistrationStorage<T> {
        addEntry(registration : IRegistrationBase, entry : () => T) : void;
        getEntry(registration : IRegistrationBase) : T;
    }

    interface IRegistrationBase {
        service : any;
        factory : Typeioc.IFactory<any>;
        name : string;
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        initializer : Typeioc.IInitializer<any>;
        disposer : Typeioc.IDisposer<any>;
        args : any[];
        container : Typeioc.IContainer;
        instance : any;
        invoker : Typeioc.IInvoker;
        cloneFor : (container: Typeioc.IContainer) => IRegistrationBase;
    }

    interface IConfigRegistration {
        scope : Typeioc.Types.Scope;
        owner : Typeioc.Types.Owner;
        registrations : IRegistrationBase[];
    }

    interface IModuleRegistration {
        getAsModuleRegistration : () => Typeioc.IAsModuleRegistration;
        registrations : IRegistrationBase[];
    }

    interface IModuleItemRegistrationOptions {
        factory : Typeioc.IFactory<any>;
        name : string;
    }
}