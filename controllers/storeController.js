const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  // 1. Query the db for list of all stores
  const stores = await Store.find();
  // console.log(stores);
  res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // 2. TODO: Confirm they are the owner of the store
  // 3. Render out edit form so user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
}

exports.updateStore = async (req, res) => {
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, { 
    new: true, // return new store, not old
    runValidators: true
  }).exec();
  // indicate it worked and redirect to store
  req.flash('success', `${store.name} editted successfully. <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
}