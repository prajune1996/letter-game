const storageKeyName = "gamescore";

export const setLocalStorage = (data) => {
    if (!data) return;
    console.log(data);
    localStorage.setItem(storageKeyName, JSON.stringify(data));
  };
  
  export const getLocalStorage = () => {
    return localStorage.getItem(storageKeyName);
  };
  
  export const deleteLocalStorage = () => {
    return localStorage.removeItem(storageKeyName);
  };