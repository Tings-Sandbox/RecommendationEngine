function intersection (list1, list2) {
  // return list of items present in both lists
  return list2.filter(function(element){
    return (list1.indexOf(element) >= 0);
  })
}

function symmetricDifference (list1, list2) {
  // return list of items present in only of of the two lists
  return list1.concat(list2).filter(function(element){
    return ((list1.indexOf(element) === -1 || list2.indexOf(element) === -1))
  })
}

function jaccardIndex (list1, list2) {
  // return decimal (0.0 to 1.0) which is the intersection over the total items
  var uLength = intersection(list1, list2).length;
  var nLength = symmetricDifference(list1, list2).length;

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
  if(intersection(user1.dislikes, user2.dislikes).length === 0 && dislikes !== false){
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

  //returns 1 if one user dislikes each item the other dislikes
  //recall that jaccardIndex compares two lists and determines the percentage of the intersection
  var dislikeFactor = (jaccardIndex(user1.likes, user2.dislikes) + jaccardIndex(user2.likes, user1.dislikes))/2;
  return dislikeFactor;
}

function calculateSimilarity (user1, user2) {
  // return decimal (-1.0 to 1.0) which is the agrement minus the disagreement over the total
  return calculateAgreement(user1, user2) - calculateDisagreement(user1, user2);
}

//FROM SOLUTION BRANCH:::
function predictLike (itemId, user, users) {
  // return decimal (-1.0 to 1.0) which is the probability the user will like the item
  var usersExceptUser = symmetricDifference(users, [user])
   var usersWhoLikesItem = usersExceptUser.filter(whoLikes(itemId))
   var sumSimilarityWithLikers = usersWhoLikesItem.reduce(sumWith(calculateSimilarity), 0.0)

   function whoLikes (itemId) {
     return function (user) {
       return user.likes.includes(itemId)
     }
   }

   function sumWith (func) {
     return function (sum, otherUser) {
       return sum += calculateSimilarity(user, otherUser)
     }
   }

   var usersWhoDislikesItem = usersExceptUser.filter(whoDislikes(itemId))

   function whoDislikes (itemId) {
     return function (user) {
       return user.dislikes.includes(itemId)
     }
   }

   var sumSimilarityWithDislikers = usersWhoDislikesItem.reduce(sumWith(calculateSimilarity), 0.0)
   var usersWhoRatedItem = usersWhoLikesItem.length + usersWhoDislikesItem.length
   var probabilityOfLike = (sumSimilarityWithLikers - sumSimilarityWithDislikers) / usersWhoRatedItem
   return probabilityOfLike
}

function recommendationsFor(user, users) {
  // return list of item ids ordered by probability the user will like the item (greatest first)
  var allItemIds = users.reduce(getItemIds, [])
   function getItemIds (itemIds, user) {
     return user.likes.concat(user.dislikes).reduce(aggregateUnique, itemIds)
   }
   function aggregateUnique (array, element) {
     return array.includes(element) ? array : array.concat(element)
   }

   var unratedItemIds = allItemIds.filter(userHasNotRated)
   function userHasNotRated (itemId) {
     return !user.likes.concat(user.dislikes).includes(itemId)
   }

   var predictions = unratedItemIds.map(function (itemId) {
     return {id: itemId, predictedRating: predictLike(itemId, user, users)}
   })

   var sortedPredictions = predictions.sort(function (a, b) {
     return a.predictedRating < b.predictedRating
   })

   var recommendations = sortedPredictions.map(function (prediction) {
     return prediction.id
   })

   // return array of itemIds ordered by greatest probabilityOfLike first
   return recommendations;
}

// You're welcome to use this but you don't have to: [1,2,3].includes(2) -> true
Object.defineProperty(Array.prototype, 'includes', {
  value: function (primitive) {
    return this.indexOf(primitive) !== -1 // <- Nobody wants to read that!
  },
  enumerable: false // Looking at object's keys will NOT include this property.
});
