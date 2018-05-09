let Store = {};

export function saveStore(s) {
    Store = s;
}
export function modifyStore(f) {
    Store = f(Store);
}
export function getStore() {
    return Store;
}
