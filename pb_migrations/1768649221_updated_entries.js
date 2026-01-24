/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3165375535")

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3446931122",
    "hidden": false,
    "id": "relation104153177",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "files",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3165375535")

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3446931122",
    "hidden": false,
    "id": "relation104153177",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "files",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
