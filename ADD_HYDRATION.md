This article will continue on from my previous one, where we implemented basic server side rendering. Now we will add hydration. If the application relies on an external resource, for example data retreived from an external endpoint, the data needs to be fetched and resolved __before__ we call `renderer.renderToString`.

For this example, we will fetch a post from [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts/1). The data looks like this:

```json
{
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
}
```

The strategy will go like this:

Client Side Rendering:

- in the App's `mounted` lifecycle hook, `dispatch` a Vuex `action`
- `commit` the response
- render as usual

Server Side Rendering:

- check for a static `asyncData` function we will make
- pass the store to `asyncData`, and call `dispatch(action)`
- commit the result
- now we have the required data, call `renderer.renderToString`

### Setup

We need some new modules. Namely:

- `axios` - a HTTP Client that works in a browser and node environment
- `vuex` - to store the data

Install them with:

```
npm install axios vuex --save
```


### Create the store

Let's make a store, and get it working on the dev server first. Create a store by running `touch src/store.js`. Inside it, add the following:


