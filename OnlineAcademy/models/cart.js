module.exports = {
    getNumberOfItems(cart) {
        console.log(cart,'cart');
      return cart.length;
    },
  
    add(cart, item) {
      for (const ci of cart) {
        if (ci.id === item.id) {
          return false;
        }
      }
      cart.push(item);
      return true;
    },
  
    remove(cart, id) {
      for (i = cart.length - 1; i >= 0; i--) {
        if (id === cart[i].id) {
          cart.splice(i, 1);
          return;
        }
      }
    }
  };
  