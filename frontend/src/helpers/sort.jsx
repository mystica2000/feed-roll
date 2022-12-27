const months = {
  "Jan" : 1,
  "Feb" : 2,
  "Mar" : 3,
  "Apr" : 4,
  "May" : 5,
  "Jun" : 6,
  "Jul" : 7,
  "Aug" : 8,
  "Sep" : 9,
  "Oct" : 10,
  "Nov" : 11,
  "Dec" : 12
}

export default function convertedDateFunc(postData) {

  let arr = [...postData.keys()];
  let dateArray = []
  let dateMap = new Map();

  arr.forEach((aDate)=> {
    dateArray.push(new Date(aDate));
    dateMap.set(new Date(aDate).toString(),aDate);
  })

   dateArray.sort(function (a,b) {
    return b - a;
   })


   let ret = new Map()
   for(let i=0;i<dateArray.length;i++) {

    let mapIndex = dateArray[i];
    let realIndex = dateMap.get(mapIndex.toString());
    let value = postData.get(realIndex);
    ret.set(realIndex,value);

   }

   return ret;
}