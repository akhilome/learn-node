exports.myMiddleWare = (req, res, next) => {
  req.name = 'Kay';
  next();
}

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('hello');
}