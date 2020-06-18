export default class Store {
  constructor(key, storage) {
    this._storekey = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storekey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storekey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
