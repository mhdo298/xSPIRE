export class Events {
    static #singleton = null;

    static singleton() {
        return this.#singleton || (this.#singleton = new Events());
    }

    constructor() {
        this.subscribers = {};
    }

    _getEventOrDefault(event) {
        return this.subscribers[event] || (this.subscribers[event] = [])
    }

    subscribe(event, callback) {
        this._getEventOrDefault(event).push(callback);
    }

    async call(event, message) {
        await Promise.all(this._getEventOrDefault(event).map(async (callback) => await callback(message)))
    }
}