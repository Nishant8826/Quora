function validEmail(val) {
  if (
    /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(
      val
    ) == false
  ) {
    return false;
  } else return true;
}

function validPhone(num) {
  if (/^[6789][0-9]{9}$/.test(num) == false) {
    return false;
  } else return true;
}
function isValid(str) {
  if (
    typeof str !== "string" ||
    typeof str === undefined ||
    typeof str === null
  )
    return false;
  if (str.trim().length == 0) return false;
  else return true;
}
function isValidBody(body){
  if(Object.keys(body).length==0)return false
  else return true
}
module.exports = { validEmail, validPhone, isValid,isValidBody };
