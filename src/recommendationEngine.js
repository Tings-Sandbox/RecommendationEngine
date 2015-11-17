function u (list1, list2) {
  // return list of items present in both lists
  return list2.filter(function(element){
    return (list1.indexOf(element) >= 0);
  })
}

function n (list1, list2) {
  // return list of items present in only of of the two lists
  return list1.concat(list2).filter(function(element){
    return ((list1.indexOf(element) === -1 || list2.indexOf(element) === -1))
  })
}

function jaccardIndex (list1, list2) {
  // return decimal (0.0 to 1.0) which is the union over the total items
  var uLength = u(list1, list2).length;
  var nLength = n(list1, list2).length;

  if (uLength+nLength === 0){
    return false;
  }

  return uLength/ (uLength + nLength);
}

function calculateAgreement (user1, user2) {
  // return decimal (0.0 to 1.0) which is the agreement (likes AND dislikes) over the total
  var likes = jaccardIndex(user1.likes, user2.likes);
  var dislikes = jaccardIndex(user2.dislikes, user2.dislikes);

  //edge case: returns 0 if the users do not dislike the same items
  if(u(user1.dislikes, user2.dislikes).length === 0 && dislikes !== false){
    return 0;
  }

  if (likes === 0 || likes === 1){
    return likes;
  }
  if (dislikes === 0 || dislikes === 1){
    return dislikes;
  }
  return ((likes + dislikes)/2);

}

function calculateDisagreement (user1, user2) {
  // return decimal (0.0 to 1.0) which is the disagreement over the total


}

function calculateSimilarity (user1, user2) {
  // return decimal (-1.0 to 1.0) which is the agrement minus the disagreement over the total
}

function predictLike (itemId, user, users) {
  // return decimal (-1.0 to 1.0) which is the probability the user will like the item
}

function recommendationsFor(user, users) {
  // return list of item ids ordered by probability the user will like the item (greatest first)
}

// You're welcome to use this but you don't have to: [1,2,3].contains(2) -> true
Object.defineProperty(Array.prototype, 'includes', {
  value: function (primitive) {
    return this.indexOf(primitive) !== -1 // <- Nobody wants to read that!
  },
  enumerable: false // Looking at object's keys will NOT include this property.
});
