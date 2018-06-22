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

//# add-hydration:src/store.js?7824c789d5a62a81e3ab9d80c5121e24d11e793f

Standard Vuex, nothing special, so I won't go into any detail.

We need to use the store now. Update `create-app`:


//# add-hydration:src/create-app.js?7824c789d5a62a81e3ab9d80c5121e24d11e793f

We are now returning `{ app, store, App }`. This is because we will need access to both `App` and `store` in `src/server.js` later on.

If you run `npm run dev`, and visit `localhost:8080`, everything should still be working. Update `src/Hello.vue`, to dispatch the action in `mounted`, and retreive it using a `computed` property:

//# add-hydration:src/create-app.js?c0a305b6e6cd8c2e0bcfd516ef30ebd0646c3884

`localhost:8080` should now display the `title` as well as `Hello`.

### Fetching the resources on the server

Run `npm run build && node src/server.js`, then visit `localhost:8000`. You will notice `Hello` is rendered, but the `post.title` is not. This is because `mounted` only runs in a browser. There are no dynamic updated when using SSR, only `created` and `beforeCreate` execute. See [here](https://ssr.vuejs.org/guide/universal.html#component-lifecycle-hooks) for more information. We need another way to dispatch the action.

In `Hello.vue`, add a `asyncData` function. This is not part of Vue, just a regular JavaScript function.


