const toArray = (obj)=> {
    const keys = Object.keys(obj);
    var array = {};
    array[Symbol.iterator] = function* () {
        for(let i=0; i < keys.length; i++){
            yield [obj[keys[i]], keys[i]];
        }
    };
    return array;
}
for (let [value, key] of toArray({a: {v:1}, b:2})) { 
    console.log(value, key); 
}