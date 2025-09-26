class EventBus {
    constructor() {
        this.events = {};
        this.callbackID = 0;
    }

    publish(eventName, ...args) {
        const callback = this.events[eventName];
        if (!callback) {
            return console.warn(eventName + ': событие не найдено!');
        }
        for (let id in callback) {
            callback[id](...args);
        }
    }

    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = {};
        }
        const id = this.callbackID++;
        this.events[eventName][id] = callback;
        const unsubscribe = () => {
            delete this.events[eventName][id];
            if (Object.keys(this.events[eventName]).length === 0) {
                delete this.events[eventName];
            }
        };
        return {unsubscribe};
    }
}

export default EventBus;