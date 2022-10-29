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

"Oct 24, 2022"

export default function convertedDateFunc(postData) {

  var ad = new Date(), bd = new Date();
  let arr = [...postData.keys()];


   arr.sort(function (a,b) {
    let aDate = a.split(" ")
    let bDate = b.split(" ")


    ad.setDate(aDate[1].substr(0,aDate.length-1))
    ad.setMonth(months[aDate[0]])

    bd.setDate(bDate[1].substr(0,bDate.length-1))
    bd.setMonth(months[bDate[0]])

    return bd - ad;
   })


   let ret = new Map()
   for(let i=0;i<arr.length;i++) {

    let value = postData.get(arr[i]);
    ret.set(arr[i],value);

   }

   return ret;
}