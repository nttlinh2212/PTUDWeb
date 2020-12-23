const numeral = require('numeral');
module.exports = {
  getCurrency(val) {
    return numeral(val).format('0,0')+' đ';
  },
  getStar(star1,star2,star3,star4,star5) {
    return (star1+star2*2+star3*3+star4*4+star5*5)/(star1+star2+star3+star4+star5);
  }
}