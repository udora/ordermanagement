

exports.login = function(req, res){
  res.render('login', { title: 'Order Management',message:'This is a protected resource. Authenticate yourself' });
 };